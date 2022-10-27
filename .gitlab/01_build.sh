#!/bin/bash
date -d "today" > ./timestamp.txt
export DOCKER_API_VERSION=1.39

## Extract Environment specific variables
echo "Exporting Variables..."

if [ $CI_COMMIT_REF_NAME == fea* ]
then
    export PROJECT_NAME=`jq --arg branch $CI_COMMIT_REF_NAME -r '.general | .project_name' $ENVVAR_SOURCE_FILE`
    export VENTURE_NAME=`jq --arg branch $CI_COMMIT_REF_NAME -r '.general | .venture_name' $ENVVAR_SOURCE_FILE`
    export DOMAIN_NAME=`jq --arg branch $CI_COMMIT_REF_NAME -r '.general | .domain_name' $ENVVAR_SOURCE_FILE`
    export TERRAFORM_TOKEN=`jq --arg branch $CI_COMMIT_REF_NAME -r '.general | .terraform' $ENVVAR_SOURCE_FILE`
    export UBX_ID=`jq --arg branch $CI_COMMIT_REF_NAME -r '.ubxph | .ubx_id' $ENVVAR_SOURCE_FILE`
    export UBX_SECRET=`jq --arg branch $CI_COMMIT_REF_NAME -r '.ubxph | .ubx_secret' $ENVVAR_SOURCE_FILE`
    export AWS_ACCESS_KEY_ID=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .accessKeyId' $ENVVAR_SOURCE_FILE`
    export AWS_SECRET_ACCESS_KEY=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .accessKeySecret' $ENVVAR_SOURCE_FILE`
    export AWS_DEFAULT_REGION=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .awsDefaultRegion' $ENVVAR_SOURCE_FILE`
    export CHANGEKEY=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .changekey' $ENVVAR_SOURCE_FILE`
    export ENVIRONMENT=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .environment' $ENVVAR_SOURCE_FILE`
    export RDS_PASSWORD=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .dbPassword' $ENVVAR_SOURCE_FILE`
    export AWS_ACCOUNT_ID=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .awsAccountId' $ENVVAR_SOURCE_FILE`
    export ENVPAR=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .envparamater' $ENVVAR_SOURCE_FILE`
    export DOCKERFILE=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | .dev | .dockerfile' $ENVVAR_SOURCE_FILE`

else

    export PROJECT_NAME=`jq --arg branch $CI_COMMIT_REF_NAME -r '.general | .project_name' $ENVVAR_SOURCE_FILE`
    export VENTURE_NAME=`jq --arg branch $CI_COMMIT_REF_NAME -r '.general | .venture_name' $ENVVAR_SOURCE_FILE`
    export DOMAIN_NAME=`jq --arg branch $CI_COMMIT_REF_NAME -r '.general | .domain_name' $ENVVAR_SOURCE_FILE`
    export TERRAFORM_TOKEN=`jq --arg branch $CI_COMMIT_REF_NAME -r '.general | .terraform' $ENVVAR_SOURCE_FILE`
    export UBX_ID=`jq --arg branch $CI_COMMIT_REF_NAME -r '.ubxph | .ubx_id' $ENVVAR_SOURCE_FILE`
    export UBX_SECRET=`jq --arg branch $CI_COMMIT_REF_NAME -r '.ubxph | .ubx_secret' $ENVVAR_SOURCE_FILE`
    export AWS_ACCESS_KEY_ID=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .accessKeyId' $ENVVAR_SOURCE_FILE`
    export AWS_SECRET_ACCESS_KEY=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .accessKeySecret' $ENVVAR_SOURCE_FILE`
    export AWS_DEFAULT_REGION=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .awsDefaultRegion' $ENVVAR_SOURCE_FILE`
    export CHANGEKEY=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .changekey' $ENVVAR_SOURCE_FILE`
    export ENVIRONMENT=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .environment' $ENVVAR_SOURCE_FILE`
    export RDS_PASSWORD=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .dbPassword' $ENVVAR_SOURCE_FILE`
    export AWS_ACCOUNT_ID=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .awsAccountId' $ENVVAR_SOURCE_FILE`
    export ENVPAR=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .envparamater' $ENVVAR_SOURCE_FILE`
    export DOCKERFILE=`jq --arg branch $CI_COMMIT_REF_NAME -r '.environment[] | select(.commitBranch==$branch) | .dockerfile' $ENVVAR_SOURCE_FILE`
fi

export ENVVAR=$(aws ssm get-parameters --region ${AWS_DEFAULT_REGION} --with-decryption --names "/envvar/${PROJECT_NAME}/${ENVIRONMENT}/ate" | jq -r '.Parameters[]  | .Value')
echo "$ENVVAR" > .env

#Docker Login
docker login -u gitlab-ci-token -p $CI_JOB_TOKEN registry.ubx.ph
aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com


cp .gitlab/Dockerfile ./Dockerfile
docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${PROJECT_NAME}-${ENVIRONMENT}-ate-api:${CI_COMMIT_SHA:0:8} -f ./Dockerfile .
docker tag ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${PROJECT_NAME}-${ENVIRONMENT}-ate-api:${CI_COMMIT_SHA:0:8} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${PROJECT_NAME}-${ENVIRONMENT}-ate-api:develop


docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${PROJECT_NAME}-${ENVIRONMENT}-ate-api:${CI_COMMIT_SHA:0:8}
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${PROJECT_NAME}-${ENVIRONMENT}-ate-api:develop
#docker push registry.ubx.ph/$CI_PROJECT_PATH/backend-api:${CI_COMMIT_SHA:0:8}
