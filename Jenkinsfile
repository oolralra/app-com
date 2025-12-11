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
        GIT_EMAIL = 'oolralra@gmail.com'
        GIT_NAME = 'oolralra'
        GIT_REPOSITORY_DEP = 'git@github.com:oolralra/deployment.git'


        // AWS ECR
        AWS_ECR_CREDENTIAL_ID = 'aws_cre'
        AWS_ECR_URI = '865577889736.dkr.ecr.ap-northeast-2.amazonaws.com'
        AWS_ECR_IMAGE_NAME = 'app'
        AWS_REGION = 'ap-northeast-2'
        
    }

    stages {
        stage('1.init') {
            steps {
                echo '1.init stage'
                deleteDir()
            }
        }
        
        stage('2.Cloning Repository') {
            steps {
                echo '2.Cloning Repository'
                git branch: "${GIT_TARGET_BRANCH}",
                    credentialsId: "${GIT_CREDENTIONALS_ID}",
                    url: "${GIT_REPOSITORY_URL}"
            }
        }
        


        stage('3.Build Docker Image') {
            steps {
                script {
                    sh '''
                        docker build -t ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:${BUILD_NUMBER} ./svelte
                        docker build -t ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:latest ./svelte
                    '''
                }
            }
        }
        
        stage('4.Push to ECR') {
            steps {
              withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "${AWS_ECR_CREDENTIAL_ID}"]]) {
                    script {
                        sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ECR_URI}
                        docker push ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:${BUILD_NUMBER}
                        docker push ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:latest
                        '''
                    }
                }
            }
            post {
                failure {
                    script {
                        sh '''
                        docker rm -f ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:${BUILD_NUMBER}
                        docker rm -f ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:latest
                        echo docker image push fail
                        '''
                    }
                }
                success {
                    script {
                   
                        sh '''
                        docker rm -f ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:${BUILD_NUMBER}
                        docker rm -f ${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:latest
                        echo docker image push success
                        '''
                    }

                }                
            }
        }

        stage('5.EKS manifest file update') {
            steps {
                git credentialsId: GIT_CREDENTIONALS_ID, url: GIT_REPOSITORY_DEP, branch: 'main'
                script {
                    sh "git config --global user.email ${GIT_EMAIL}"
                    sh "git config --global user.name ${GIT_NAME}"
                    sh "sed -i 's@${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:.*@${AWS_ECR_URI}/${AWS_ECR_IMAGE_NAME}:${BUILD_NUMBER}@g' svel.yml"

                    sh "git add ."
                    sh "git branch -M main"
                    sh "git commit -m 'fixed tag ${BUILD_NUMBER}'"
                    sh "git remote remove origin"
                    sh "git remote add origin ${GIT_REPOSITORY_DEP}"
                    sh "git push origin main"
                }

            }
            post {
                failure {
                    sh "echo manifest update failed"
                }
                success {
                    sh "echo manifest update success"
                }
            }
        }
        
    }

}
