docker login -u gitlab-ci-token -p $CI_JOB_TOKEN registry.ubx.ph
[[ -z "$DOCKERHUB_TOKEN" ]] && echo "DOCKERHUB_TOKEN is currently EMPTY" || docker login --username ubxadmin -p ${DOCKERHUB_TOKEN}