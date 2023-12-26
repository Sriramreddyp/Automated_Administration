pipeline{
    agent any
    tools {
        nodejs "Node"
    }

    environment {
        CREDS = credentials('ecd3faa6-3cd5-47de-b703-01df6ee1447a')
     }
    
    stages{
        
    stage('Git Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Sriramreddyp/Automated_Administration.git'
      }
    }
    
    stage('Installation and Build'){
        steps{
            echo 'Installing Pacakges'
            sh 'npm install'
        }
    }
    
    stage("OWASP DependencyCheck"){
        steps{
            echo 'Dependency check'
            dependencyCheck additionalArguments: '--scan ./ --format HTML', odcInstallation: 'DP'
        }
    }
    

    //Security Issue with Interpolation -- Should update later
    stage('Docker Build and update') {
      steps {
      script{
         sh "docker login -u ${CREDS_USR} -p ${CREDS_PSW}"
         sh "docker build -t jenkinstest -f Dockerfile ."
         sh "docker tag jenkinstest sriram2211/jenkinstest:latest"
         sh "docker push sriram2211/jenkinstest:latest"
    }
    }
}
    
    stage('Deploy'){
        steps{
            echo 'Deploying Application'
            sh 'nohup npm start > prod.log &'
        }
    }
    
    }
}
