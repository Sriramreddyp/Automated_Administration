# Automated API

## Analogy :

A Restful-API which runs on the control node of the ansible environment where administrator can easily configure all the worker nodes with some prebuilt playbook configurations.

## Stack Used :

- Backend :
  - Node JS
  - Express JS
- Linux central node
- ansible

## Requirements :

- A central Linux server where this api will run on
- A user on that Linux server who has sudo password less access.
- Bash Scripts :
  - Looping through user string (space seprated) and appending them to a file line by line.
  - Looping through user string (space seperated) and transfering ssh key in each and every node.
  - Looping through host vars to create file for each node and appending ssh-key
- Ansible - Playbooks :
  - Firewall Configuration
  - apache2 Configuratoin
  - nginx Configuration
  - User - Setup
  - Initial Docker Hosting Setup

# Software Description :

Initially running this software should setup central node for ansible by adding necessary files and initializing worker nodes.
Then and thereby ansible scripts will be pulled from the git repo and stored in the central node and executed whenever wanted to.

## Steps :

### Initial steps :

- Initially user should provide all the worker nodes ans input which will be stored in an array.
- it should be global

#### SSH key-gen and Transfer :

- Should generate ssh-key where name of the ssh-key should be taken from user.
- Transfering that ssh-key to all the worker nodes from the base user - we can execute our ansible playbook (Initial ansible configuration has to be done in this step iteself which was mentioned below)

#### Creating a user :

- Create a new user and add that user into sudoers file with new primary group as new group and sudo as secondary group. (user should be a passwdless user).

<b>Note</b> : While navigating through file system be as discrete as possible like create this particular ansible folder with realtive path beginning with $PATH so it will easy for further routes to work on.

### Ansible-Configuration :

- Login into the new user created.
- Create an new directory for ansible initiation - this filename should be taken as user input and should be declared as global variable.
- After creating user and assigning all the worker nodes globally,pull all the utility scripts and ansible playbooks in the above created file.
  - Create an inventory file ,add all the worker nodes from the globally assigned array of worker nodes using a bash script and add the remote user as globally configured user <b>(first script)</b>
  - Create an ansible cfg file with base requirements
  - Create a directory for files
  - test ansible ping from that directory

### Playbook - Execution :

- A test ansible route for utility
- After the initial initialization, create a common route for execution of any of the ansible-plybook on all the worker nodes using that globally declared filename ,where the type of playbook to be executed should be taken from user as input.

### Error handling above steps :

- Initial Step :

  - Base user should be a sudoser - check for passwordless sudo access
  - ssh key generation error (handle them in the promise itself)
  - ssh - transfer (Promise itself).
  - creation of user (promise itself).

- Ansible-Configuration

  - Checking for the login session as new user or not.
  - Checking whether the global variables are assigned or not.

* PlayBook Execution
  - Checking for the login session as new user or not.
  - Checking whether the global variables are assigned or not.

### Extra Ideas for new routes and playbooks :

- package installer route :
  - Where host_vars file will be frequently updated with the user input package and passed through the playbook with a use of bashscript

* Session managed variables
  - Creation of account based management using db for frequent usage and saving configuration data.
