#!/bin/bash

echo "Exporting Variables..."


export DOCKER_API_VERSION=1.39
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


# Run DB Migration
echo "Running DB Migrations"
SN=$(aws ec2 describe-subnets --region ${AWS_DEFAULT_REGION} --subnet-ids --filters Name=tag:Name,Values=${PROJECT_NAME}-${ENVIRONMENT}-private-subnet-${AWS_DEFAULT_REGION}a | jq '.Subnets[0] .SubnetId')
SG=$(aws ec2 describe-security-groups --region ${AWS_DEFAULT_REGION} --group-ids --filters Name=tag:Name,Values=${PROJECT_NAME}-${ENVIRONMENT}-ecs-sg | jq '.SecurityGroups[0] .GroupId')
aws ecs run-task --launch-type FARGATE --cluster $PROJECT_NAME-$ENVIRONMENT-cluster --task-definition $PROJECT_NAME-$ENVIRONMENT-ate-db-migrate --network-configuration "awsvpcConfiguration={subnets=${SN},securityGroups=${SG},assignPublicIp=\"DISABLED\"}"

echo "Reconfigure api.json"
mv .gitlab/api.json api.json
sed -i "s#CHANGEENV#$ENVIRONMENT#g" api.json
sed -i "s#PROJECT#$PROJECT_NAME#g" api.json
sed -i "s#AWSREGION#$AWS_DEFAULT_REGION#g" api.json
sed -i "s#AWSACCOUNT#$AWS_ACCOUNT_ID#g" api.json
sed -i "s#COMMITTAG#${CI_COMMIT_SHA:0:8}#g" api.json
sed -i "s#ENVPARAM#$ENVPAR#g" api.json

echo "Updating task defintion  ${PROJECT_NAME}-${ENVIRONMENT}-service-ate"
aws ecs register-task-definition --family ${PROJECT_NAME}-${ENVIRONMENT}-service-ate --requires-compatibilities FARGATE --cpu 1024 --memory 2048 --cli-input-json file://api.json

echo "Executing Rolling Update"
aws ecs update-service --cluster ${PROJECT_NAME}-${ENVIRONMENT}-cluster --service ${PROJECT_NAME}-${ENVIRONMENT}-service-ate --task-definition ${PROJECT_NAME}-${ENVIRONMENT}-service-ate --region $AWS_DEFAULT_REGION


## Wait
echo ""
echo "Waiting for rolling update to complete..."
echo ""
aws ecs wait services-stable --cluster $PROJECT_NAME-$ENVIRONMENT-cluster --service ${PROJECT_NAME}-${ENVIRONMENT}-service-ate
echo ""
echo "Rolling Update Complete!"
echo ""

# export AGW_NAME=${PROJECT_NAME}-${ENVIRONMENT}-backend-api
# AGW_ID=$(aws apigateway get-rest-apis --region $AWS_DEFAULT_REGION | jq --arg agw $AGW_NAME -r '.items[] | select(.name==$agw) | .id')

# #echo "Backing up current API Gateway configuration as ${CI_COMMIT_SHA:0:8}.yaml"
# aws apigateway get-export --region ${AWS_DEFAULT_REGION} --parameters extensions='integrations' --rest-api-id ${AGW_ID} --stage-name ${ENVIRONMENT} --accepts application/yaml --export-type oas30 ${CI_COMMIT_SHA:0:8}.yaml

# # Update ${PROJECT_NAME}-${PROJECT_TYPE}-${ENVIRONMENT} API Gateway
# echo "Updating API Gateway via file agw/${CI_COMMIT_REF_NAME}.yaml ..."
# aws apigateway put-rest-api --cli-binary-format raw-in-base64-out --region ${AWS_DEFAULT_REGION} --rest-api-id ${AGW_ID} --mode overwrite --fail-on-warnings --body 'file://agw/${CI_COMMIT_REF_NAME}.yaml'

# # Deploy ${PROJECT_NAME}-${PROJECT_TYPE}-${ENVIRONMENT} API Gateway
# echo "Deploying latest version of API Gateway"
# aws apigateway create-deployment --region ${AWS_DEFAULT_REGION} --rest-api-id ${AGW_ID} --stage-name $ENVIRONMENT --description "API Gateway for $ENVIRONMENT"
