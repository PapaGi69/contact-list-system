#!/bin/bash

[[ "$PROJECT_NAME" ]] || { echo "Project name  doesn't exist in env variable. Please set it"; exit; }


function check_sast {
  for LEVELS in critical high
  do
    export VULCOUNT=$(cat reports/scan-full-report.json | jq -r ".properties.metrics.${LEVELS}")
    for VULCHECK in $VULCOUNT
    do
      if [ "$VULCHECK" -gt 0 ]; then
        echo -e "\n\n\e[31mCritical/High Vulnerabilities found. If this a Merge Request Job, please check the comments section. \e[0m"
        exit 1
      fi
    done
  done 
  echo -e "\n\nNo Critical/High Vulnerabilities found."
  exit 0 
}

function check_depscan {
  FILE=reports/depscan-report-nodejs.json
  if test -f "$FILE"; then
    for SEVERITY in CRITICAL HIGH
    do
      export VULCOUNT=$(cat ${FILE} | jq -r ".severity")
      for VULCHECK in $VULCOUNT
      do
        if [[ "$VULCHECK" == "CRITICAL" || "$VULCHECK" == "HIGH" ]]; then
          echo -e "\n\n\e[31mCritical/High Vulnerabilities found. If this a Merge Request Job, please check the comments section. \e[0m"
          exit 1
        fi
      done
    done
    echo -e "\n\n No Critical/High Vulnerabilities found."
    exit 0
  else
    echo -e "\n\n No Critical/High Vulnerabilities found."
    exit 0
  fi
}

if [ "$1" == "code-quality" ]; then
  if [ -z "$CI_MERGE_REQUEST_IID" ]; then
    docker run --env CODECLIMATE_CODE="$PWD" --volume "$PWD":/code --volume /var/run/docker.sock:/var/run/docker.sock --volume /tmp/cc:/tmp/cc codeclimate/codeclimate analyze
  else
    #docker run --env CODECLIMATE_CODE="$PWD" --volume "$PWD":/code --volume /var/run/docker.sock:/var/run/docker.sock --volume /tmp/cc:/tmp/cc codeclimate/codeclimate analyze -f json > gl-code-quality-report.json
    export OUTPUT=$(docker run --env CODECLIMATE_CODE="$PWD" --volume "$PWD":/code --volume /var/run/docker.sock:/var/run/docker.sock --volume /tmp/cc:/tmp/cc codeclimate/codeclimate analyze)
    curl -s -XPOST "https://gitlab.ubx.ph/api/v4/projects/${CI_MERGE_REQUEST_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes" \
        -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        --data-urlencode "body=\`\`\`${OUTPUT}"  > TEMP
  fi
  test $? -eq 1 || exit 1
fi

#if [ "$1" == "code-quality" ]; then
#  export SP_VERSION=$(echo "$CI_SERVER_VERSION" | sed 's/^\([0-9]*\)\.\([0-9]*\).*/\1-\2-stable/')
#  docker run --env CODECLIMATE_CODE="$PWD" \
#    --volume "$PWD":/code \
#    --volume /var/run/docker.sock:/var/run/docker.sock \
#    --volume /tmp/cc:/tmp/cc codeclimate/codeclimate analyze -f json > gl-code-quality-report.json
#  #docker run \
#  #  --env SOURCE_CODE=/code \
#  #  --volume "$PWD":/code \
#  #  --volume /var/run/docker.sock:/var/run/docker.sock \
#  #  "registry.gitlab.com/gitlab-org/ci-cd/codequality:$SP_VERSION" /code
#fi

if [ "$1" == "sast" ]; then
  if [ -z "$CI_MERGE_REQUEST_IID" ]; then
      echo "This is not a merge request!"
      docker run --rm -e "WORKSPACE=${PWD}" -v $PWD:/app shiftleft/sast-scan:gl-insights scan -t ${SAST} --build -o reports/
    else
      export OUTPUT=$(docker run --rm -e "WORKSPACE=${PWD}" -v $PWD:/app shiftleft/sast-scan:gl-insights scan -t ${SAST}  --build -o reports/ | sed $'s/\e\\[[0-9;:]*[a-zA-Z]//g')
      curl -s -XPOST "https://gitlab.ubx.ph/api/v4/projects/${CI_MERGE_REQUEST_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes" \
        -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        --data-urlencode "body=\`\`\`${OUTPUT}"  > TEMP
  fi
  check_sast
fi

if [ "$1" == "depscan" ]; then
  export SAST=$1
  if [ -z "$CI_MERGE_REQUEST_IID" ]; then
    echo "This is not a merge request!"
    docker run --rm -e "WORKSPACE=${PWD}" -v $PWD:/app shiftleft/sast-scan:gl-insights scan -t ${SAST} --build -o reports/
  else
    echo "part of a merge rquest"
    export OUTPUT=$(docker run --rm -e "WORKSPACE=${PWD}" -v $PWD:/app shiftleft/sast-scan:gl-insights scan -t ${SAST}  --build -o reports/ | sed $'s/\e\\[[0-9;:]*[a-zA-Z]//g')
    curl -s -XPOST "https://gitlab.ubx.ph/api/v4/projects/${CI_MERGE_REQUEST_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes" \
      -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
      -H "Content-Type: application/x-www-form-urlencoded" \
        --data-urlencode "body=\`\`\`${OUTPUT}" > TEMP
  fi
  check_depscan
fi

if [ "$1" == "container-scan" ]; then
    docker run -d --name db arminc/clair-db:latest
    docker run -p 6060:6060 --link db:postgres -d --name clair --restart on-failure arminc/clair-local-scan:latest
    docker pull registry.ubx.ph/$CI_PROJECT_PATH/$PROJECT_NAME:${CI_COMMIT_SHA:0:8}
    wget https://github.com/arminc/clair-scanner/releases/download/v12/clair-scanner_linux_amd64 > TMP
    mv clair-scanner_linux_amd64 clair-scanner
    chmod +x clair-scanner
    
    touch clair-whitelist.yml
    #echo "Getting whitelist file"
    #wget https://sme-api-dev-storage.s3.amazonaws.com/migration/clair-whitelist.yml
    retries=0
    echo "Waiting for clair daemon to start"
    export IP=$(hostname -i)
    while( ! wget -T 10 -q -O /dev/null http://localhost:6060/v1/namespaces ) ; do sleep 1 ; echo -n "." ; if [ $retries -eq 10 ] ; then echo " Timeout, aborting." ; exit 1 ; fi ; retries=$(($retries+1)) ; done
    ./clair-scanner -c http://localhost:6060 --ip=$IP -r gl-container-scanning-report.json -l clair.log -w clair-whitelist.yml registry.ubx.ph/$CI_PROJECT_PATH/$PROJECT_NAME:${CI_COMMIT_SHA:0:8}|| true
    export CLAIRLOG=$(cat clair.log)
    if [ -z "$CI_MERGE_REQUEST_IID" ]; then
      echo "Nuninu.."
      else
      curl -s -XPOST "https://gitlab.ubx.ph/api/v4/projects/${CI_MERGE_REQUEST_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/notes" \
        -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
        -H "Content-Type: application/x-www-form-urlencoded" \
          --data-urlencode "body=\`\`\`${CLAIRLOG}" > TEMP
    fi
    grep -cE 'NO unapproved vulnerabilities' >/dev/null 2>&1 clair.log
    test $? -eq 0 || exit 1
fi


#if [ "$1" == "container-scan" ]; then
#  docker run -d --name db arminc/clair-db:latest
#  docker run -p 6060:6060 --link db:postgres -d --name clair --restart on-failure arminc/clair-local-scan:v2.0.8_fe9b059d930314b54c78f75afe265955faf4fdc1
#  docker pull registry.ubx.ph/$CI_PROJECT_PATH/$PROJECT_NAME:${CI_COMMIT_SHA:0:8}
#  wget https://github.com/arminc/clair-scanner/releases/download/v8/clair-scanner_linux_amd64
#  mv clair-scanner_linux_amd64 clair-scanner
#  chmod +x clair-scanner
#  touch clair-whitelist.yml
#  retries=0
#  echo "Waiting for clair daemon to start"
#  export IP=$(hostname -i)
#  while( ! wget -T 10 -q -O /dev/null http://localhost:6060/v1/namespaces ) ; do sleep 1 ; echo -n "." ; if [ $retries -eq 10 ] ; then echo " Timeout, aborting." ; exit 1 ; fi ; retries=$(($retries+1)) ; done
#  ./clair-scanner -c http://localhost:6060 --ip=$IP -r gl-container-scanning-report.json -l clair.log -w clair-whitelist.yml registry.ubx.ph/$CI_PROJECT_PATH/$PROJECT_NAME:${CI_COMMIT_SHA:0:8} || true
#  #./clair-scanner -c http://localhost:6060 --ip=$IP --reportAll=true -w clair-whitelist.yml registry.ubx.ph/$CI_PROJECT_PATH/$PROJECT_NAME:${CI_COMMIT_SHA:0:8} || true
#  echo $?
#fi

if [ "$1" == "unit-test" ]; then
  docker pull registry.ubx.ph/$CI_PROJECT_PATH/$PROJECT_NAME:${CI_COMMIT_SHA:0:8}
  docker run -t registry.ubx.ph/$CI_PROJECT_PATH/$PROJECT_NAME:${CI_COMMIT_SHA:0:8} bash ./start.sh test
fi
