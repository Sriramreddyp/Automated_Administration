pipeline{
    agent any
    
    tools {nodejs "node"}
    tools {dockerTool "docker"}
    
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

      stage('Docker Build') {
      steps {
       withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker', url: 'https://hub.docker.com/repository/docker/sriram2211/jenkinstest/general') {
    // some block
    script{
             
                withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                          sh "docker build sriram2211/jenkinstest ."
                          sh "docker push sriram2211/jenkinstest:latest"
                    }
            }
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