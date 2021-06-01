pipeline { //파이프라인의 시작
    // 스테이지 별로 다른 거
    agent any //아무 agent 사용

    // 파이프라인이 몇 분 주기로 trigger될 것인가 정의
    triggers {
        pollSCM('*/3 * * * *')
    }

    // 파이프라인 안에서 사용할 환경변수
    // jenkins 안에서 git에 접근하기 위한 credential은 등록을 했지만, AWS 접근을 위한 등록도 필요함
    environment {
      
      AWS_ACCESS_KEY_ID = credentials('awsAccessKeyId')
      AWS_SECRET_ACCESS_KEY = credentials('awsSecretAccessKey')
      AWS_DEFAULT_REGION = 'ap-northeast-2' //northeast-2 : seoul
      HOME = '.' // Avoid npm root owned
    }

    //stages : stage라는 큰 단계들을 모아놓은 Block
    stages {
        //stage : 여러 work들을 수행
        //필요한 Git 레포지토리를 다운로드 받음
        stage('Prepare') {
            agent any
            // 해당 Git 레포지토리를 Pull 받음
            steps {
                echo 'Clonning Repository'
              
                git url: 'https://github.com/june-777/Capstone.git',
                    branch: 'master',
                    credentialsId: 'june777_Capstone'
                    sh '''
                    sleep 5
                    pwd
                    '''
            }
            //post : "stage"의 실행이 완료될 때 실행되는 하나 이상의 추가 단계, 공식문서에선 stage{ } 이후에 사용되지만, block 안에서도 사용 가능한듯.
            post { //(참고) post내에서 슬랙도 보낼 수 있는듯 함
                // If Maven was able to run the tests, even if some of the test
                // failed, record the test results and archive the jar file.
                success { //성공시
                    echo 'Successfully Pulled Repository'
                }

                always { // 항상
                  echo "i tried..."
                }

                cleanup { // post 모든 작업 끝나고나서 실행
                  echo "after all other post condition"
                }
            }
        }
        



        //(중요!!) ./website의 파일들을 aws s3 에 파일을 올림 
        //위에서 accesstoken을 환경변수로 등록함으로써, 해당 AWS user에 대한 내용들이 나오는 것임.
        stage('Deploy to AWS: S3') {
          steps {
            echo 'Deploying to AWS: S3'
            // 프론트엔드 디렉토리의 정적파일들을 S3 에 올림, 이 전에 반드시 EC2 instance profile 을 등록해야함.
            dir ('./website'){ //dir : change current directory (jenkins가 원래 루트디렉토리에 있다가 ./website로 이동)
                sh '''
                pwd
                aws s3 sync ./ s3://iamjenkinsbucket1
                '''
                //aws : aws CLI 시작, sync : 여러개의 파일을 recursive하게 복사, s3://[버킷이름]/[파일이름]
                //현재디렉토리(./website)의 모든 파일을 s3스토리지의 특정버킷으로 복사하세요
            }
          }
        
          post {
              // If Maven was able to run the tests, even if some of the test
              // failed, record the test results and archive the jar file.
              success { //성공시 수행
                  echo 'Successfully Cloned Repository'
              }
              failure {
                  echo 'I failed :('
              }
          }
        }

        stage('Deploy to nginx server') {
          steps{
            echo 'Deploying to nginx server'
            dir ('./website'){
              sh'''
              pwd
              sudo cp -r * /html
              '''
            }
          }
        }


        stage('Test Backend') {
          //test를 하려면 npm 있어야하고 npm은 node서버 바탕에서 수행. 즉, 도커로 node 띄우기.
          agent any
           //   image 'node:latest'
            
          
          steps {
            echo 'Test Backend'


                // npm run test : index.test.js 실행
            }
        }
        
        
        stage('Bulid Backend') {
          agent any
          steps {
            echo 'Build Backend'
          }

          post { //원래 앞의 stage들은 실패해도 다음 stage로 넘어감. 서버를 빌드하다 실패했는데 배포하면 안될 것임. 빌드하다 실패하면 에러 실행하고 pipeline강제종료
            failure {
              error 'This pipeline stops here...'
            }
          }
        }
        
        stage('Deploy Backend') {
          agent any

          steps {
            echo 'Build Backend'

//            dir ('./server'){
//                sh '''
//                docker run -p 80:80 -d server 
//                '''
              //위에서 만든 도커 이미지 run
//            }
          }

          post {
            success {
              echo 'FINALLY SUCCESS'
              
//              mail  to: 'wlwhswnsrl96@gmail.com',
//                    subject: "Deploy Success",
//                    body: "Successfully deployed!"
                  
            }
          }
        }
  }
}
