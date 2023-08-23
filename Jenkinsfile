pipeline{
    agent any
    
    tools {nodejs "node"}
    
    stages{
        
    stage('Git Pull') {
      steps {
        git branch: 'main', credentialsId: 'git-cred', url: 'https://github.com/Sriramreddyp/Automated_Administration.git'
      }
    }
    
    stage('Installation and Build'){
        steps{
            echo 'Installing Pacakges'
            sh 'npm install'
        }
    }
    
    stage('Deploy'){
     when{
      branch "main"
     }
        steps{
            echo 'Deploying Application'
            sh 'nohup npm start > prod.log &'
        }
    }
    
    }
}