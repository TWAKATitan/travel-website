# AWS configuration
AWS_ACCOUNT_ID := 
AWS_REGION := 
AWS_PROFILE := 
ECR_REPO_NAME := 
IMAGE_TAG := latest

# AWS ECR URI
ECR_REPO_URI := $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(ECR_REPO_NAME)

.PHONY: docker_build docker_push help

docker_build:
	@echo "Building Docker image..."
	docker build -t $(ECR_REPO_NAME):$(IMAGE_TAG) . || { echo "Error: Docker build failed."; exit 1; }
	@echo "Tagging Docker image for ECR..."
	docker tag $(ECR_REPO_NAME):$(IMAGE_TAG) $(ECR_REPO_URI):$(IMAGE_TAG) || { echo "Error: Docker tagging failed."; exit 1; }

docker_push: docker_build
	@echo "Logging in to AWS ECR..."
	aws ecr get-login-password --region $(AWS_REGION) --profile $(AWS_PROFILE) \
	| docker --config /tmp/.docker login --username AWS --password-stdin $(ECR_REPO_URI) || { echo "Error: AWS ECR login failed."; exit 1; }

	@echo "Pushing Docker image to ECR..."
	docker push $(ECR_REPO_URI):$(IMAGE_TAG) || { echo "Error: Docker push failed."; exit 1; }

help:
	@echo "Available targets:"
	@echo "  docker_build            - Build Docker image"
	@echo "  run_pytest              - Run pytest inside Docker"
	@echo "  docker_push             - Push Docker image to ECR"