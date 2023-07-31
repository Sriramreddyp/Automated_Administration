import Express from "express";
import * as com from "child_process";
export const router = Express.Router();


router.get("/",(req,res)=>{
res.json({status:"Connected to exec route!!"});
});


//utility remoteCommand execution route
router.post("/commandExec",async (req,res)=>{
 var command = req.body.cmd;

await com.exec(command,(error,stdout,stderr)=>{

     if(error){
      console.log("error");
      res.send(error.message);
     }

     if(stderr){
        console.log("stdError");
        res.send(stderr.message);
       }

     console.log("Executed Sucessfully");
     res.send(stdout);
});
});

//considering ssh keys are initially configured.
//Inventory and ansible set-up route
//developer defined path -- hardcoded
//user defined worker node
//creation of ansible.cfg
//creation of files dir
//scp of ssh key to worker node
//ansible ping from that folder
//if sucessfull return path,if not return false ,lo error
router.post("/initial-setup",async (req,res)=>{

var filename = req.body.name;
var ip = req.body.ip;

//1.
await com.exec(`mkdir /home/kratos/Ansible/${filename}`,(error,stderr,stdout)=>{
 if(error)
 res.send("Error in creating file for ansible setup");
 else if(stderr)
 res.send("Error in executing command");
 else
 console.log("File Sucessfully Created for setup");
});

//2.
await com.exec(`cd /home/kratos/Ansible/${filename} && echo [servers] > inventory && echo ${ip} >> inventory && mkdir files`,(error,stderr,stdout)=>{
if(error)
res.send("Error in creating inventory file");
else if(stderr)
res.send("Error in executing command");
else
console.log("Sucessfully created worker node inventory");
});

//3.
await com.exec(`cd /home/kratos/Ansible/${filename} && echo "[defaults]" > ansible.cfg && echo "inventory = inventory" >> ansible.cfg && echo "private_key_file = ~/.ssh/id_ed25519" >> ansible.cfg`,(error,stderr,stdout)=>{
if(error)
 res.send("Error in creating cfg file");
else if(stderr)
 res.send("Error in executing command");
else
res.send(`Initial Setup Sucessfull, path : ${filename}`);
});
});

//writing bash scripts for sudo password acess tasks like, ssh key copy, user creation, then only  we can execute other ansible playbooks with user configured as remote one in inventory file
//Creating a user and giving root acess to that user


//Ansible connection test
router.post("/ansible-test",async(req,res)=>{
var filename = req.body.name;
await com.exec(`cd /home/kratos/Ansible/${filename} && ansible all -m ping`,(error,stderr,stdout)=>{
if(error)
 res.send(error);
else if(stderr)
 res.send(stderr);
else
 res.send("Connection sucessfull!!");
});

});

//Task-Executer-playbook
router.post("/ansible-taskDoEr",async (req,res)=>{
var filename = req.body.name;
var task = req.body.task;
await com.exec(`cd /home/kratos/Ansible/${filename} && ansible-playbook /home/kratos/Ansible/AutomationScripts/setting_up_${task}.yml`,(error,stderr,stdout)=>{

if(error)
 res.send(error);
else if(stderr)
  res.send(stderr);
else
 res.send(`${task} Setup Sucessfull`);
});
});
