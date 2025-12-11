pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
    }

   environment {
        TIME_ZONE = 'Asia/Seoul'
        
        // GitHub
        GIT_TARGET_BRANCH = 'main'
        GIT_REPOSITORY_URL = 'https://github.com/oolralra/app-com'
        GIT_CREDENTIONALS_ID = 'git_cre'


        // AWS ECR
        AWS_ECR_CREDENTIAL_ID = 'aws_ecr'
        AWS_ECR_URI = '865577889736.dkr.ecr.ap-northeast-2.amazonaws.com'
        AWS_ECR_IMAGE_NAME = 'app'
        AWS_REGION = 'ap-northeast-2'
        
    }

    stages {
        stage('init') {
            steps {
                echo 'init stage'
                deleteDir()
            }
        }
        
        stage('Cloning Repository') {
            steps {
                echo 'Cloning Repository'
                git branch: "${GIT_TARGET_BRANCH}",
                    credentialsId: "${GIT_CREDENTIONALS_ID}",
                    url: "${GIT_REPOSITORY_URL}"
            }
        }
        


        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        docker build -t ${AWS_ECR_IMAGE_NAME} ./svelte
                        docker tag ${AWS_ECR_IMAGE_NAME} ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:${BUILD_NUMBER}
                    '''
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
              withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "${AWS_ECR_CREDENTIAL_ID}"]]) {
                    script {
                        sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ECR_URI}
                        docker push ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:${BUILD_NUMBER}
                        
                        '''
                    }
                }
            }
        }
        
        stage('Clean Up Docker Images on Jenkins Server') {
            steps {
                echo 'Cleaning up unused Docker images on Jenkins server'
                sh "docker image prune -f --all"
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
