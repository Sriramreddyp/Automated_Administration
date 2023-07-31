import Express from "express";
import * as com from "child_process";
export const router = Express.Router();


router.get("/",(req,res)=>{
res.json({status:"Connected to exec route!!"});
});



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



router.get("/ansible-test",async(req,res)=>{

await com.exec("cd /home/kratos/Ansible/AutomationScripts && ansible all -m ping",(error,stderr,stdout)=>{
if(error)
 res.send(error);
else if(stderr)
 res.send(stderr);
else
 res.send(stdout);
});
});

router.get("/ansible-firewall",async (req,res)=>{
await com.exec("cd /home/kratos/Ansible/AutomationScripts && ansible-playbook setting_up_firewall.yml",(error,stderr,stdout)=>{

if(error)
 res.send(error);

if(stderr)
  res.send(stderr);
else
 res.send(stdout);
});
});
