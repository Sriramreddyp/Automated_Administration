import Express from "express";
import util from "node:util";
import * as com from "node:child_process";
export const router = Express.Router();

const exec = util.promisify(com.exec);

//Global Variables for a single session
var hosts = "";
var groupName = "";
var keyNamePublic = "id_rsa.pub";
var keyNamePrivate = "id_rsa";
var userName = "";
var rootfilename = "";

router.get("/", (req, res) => {
  res.json({ status: "Connected to exec route!!" });
});

//-- Feature Should be upgraded later
//ssh-key gen route -- (return - keyname)
// router.post("/ssh-keygen", async (req, res) => {
//   var keyname = req.body.keyname;

//   await com.exec(
//     `ssh-keygen -q -t rsa -N '' -f ~/.ssh/${keyname} <<<y >/dev/null 2>&1`,
//     (error, stderr, stdout) => {
//       if (error) res.send(error);
//       else if (stderr) res.send("Error in executing the command..");
//       else {
//         keyName = keyname;
//         console.log(keyName);
//         res.send("Sucessfully key-pair generated");
//       }
//     }
//   );
// });

//Initial setup
//1 -- pull shell and playbooks
//2 -- Initialize a file for ansible
//3 -- cp those shell and playbooks to ansible
//4 -- create inventory and cfg,file,host -- version1
//5 -- test
router.post("/initial-setup", async (req, res) => {
  var workers = req.body.workers;
  groupName = req.body.groupname;
  rootfilename = req.body.filename;
  var usernameBase = req.body.baseuser;
  var passBase = req.body.pass;
  userName = req.body.ansibleReqUser;

  //converting array into space seperated string for bash script
  hosts = " ";
  for (let i of workers) {
    hosts = hosts + i + " ";
  }

  //checking string format
  console.log(hosts);

  //pull repo
  async function task1() {
    let operation = new Promise((resolve, reject) => {
      exec(
        `cd /$HOME && git clone git@github.com:Sriramreddyp/Scripts_And_Playbooks.git`,
        (error, stderr, stdout) => {
          if (stdout) {
            console.log("Pulled Repo Sucessfully!!!");
            resolve(true);
          }
          resolve(false);
        }
      );
    });
    return await operation;
  }

  //Initialize an ansible File
  async function task2() {
    let operation = new Promise((resolve, reject) => {
      exec(
        `cd /$HOME/Scripts_And_Playbooks && ./inventory_creation "${hosts}" "${rootfilename}" "${groupName}" "${usernameBase}" "${passBase}"`,
        (error, stderr) => {
          if (stderr || error) resolve(false);
          else {
            console.log("Sucessfully Created Initial Folder of ansible...");
            resolve(true);
          }
        }
      );
    });
    return await operation;
  }

  //Setup for user creation
  async function task3() {
    let operation = new Promise((resolve, reject) => {
      exec(
        `cd /$HOME/Scripts_And_Playbooks && ./manual_user_updation "${hosts}" "${rootfilename}" "${userName}" "${keyNamePublic}"`,
        (error, stderr) => {
          if (stderr || error) resolve(false);
          else {
            console.log("Setup Sucessfull for user creation...");
            resolve(true);
          }
        }
      );
    });
    return await operation;
  }

  //Copying playbooks from Scripts file to ansiblefile
  async function task4() {
    let operation = new Promise((resolve, reject) => {
      exec(
        `cd /$HOME/Scripts_And_Playbooks && cp setting_up_user.yml setting_up_firewall.yml ~/${rootfilename}`,
        (error, stderr) => {
          if (stderr || error) resolve(false);
          else {
            console.log("File transfer Sucesfull!!!");
            resolve(true);
          }
        }
      );
    });
    return await operation;
  }
  let answer = {};
  let ackOne = await task1();
  let ackTwo = await task2();
  let ackThree = await task3();
  let ackFour = await task4();

  answer = {
    "Pulling repositories": ackOne,
    "Ansible - File Setup": ackTwo,
    "Setup - user creation": ackThree,
    "Copying Scripts": ackFour,
  };

  res.json(answer);
});

//Creating User
//6 -- setup user
//Executed correctly but bugged somewhere - should change later
router.get("/create-user", async (req, res) => {
  //Creating User
  async function task1() {
    let operation = new Promise((resolve, reject) => {
      exec(
        `cd /$HOME/${rootfilename} && ansible-playbook setting_up_user.yml`,
        () => {
          console.log("User Creation Sucessfull!!");
          resolve(true);
        }
      );
    });
    return await operation;
  }
  let answer = {};
  let ackOne = await task1();

  answer = {
    "User-creation": ackOne,
  };

  res.json(answer);
});

//7 -- setup ssh keys
//8 -- test again
router.get("/final-setup", async (req, res) => {
  //Clear inventory file and update remote_user as username
  async function task1() {
    let operation = new Promise((resolve, _reject) => {
      exec(
        `cd /$HOME/Scripts_And_Playbooks && ./inventory_refresh "${hosts}" "${rootfilename}" "${groupName}" "${keyNamePrivate}" "${userName}"`,
        (error, stderr) => {
          if (stderr || error) resolve(false);
          else {
            console.log("SSH Key Updation Sucessfull!!!");
            resolve(true);
          }
        }
      );
    });
    return await operation;
  }
  let answer = {};
  let ackOne = await task1();

  answer = {
    "SSH Key-Updation": ackOne,
  };

  res.json(answer);
});

//Task-Executer-playbook
router.post("/ansible-taskDoEr", async (req, res) => {
  var Taskname = req.body.name;
  async function task1() {
    let operation = new Promise((resolve, _reject) => {
      exec(
        `cd /$HOME/${rootfilename} && ansible-playbook setting_up_${Taskname}.yml`,
        () => {
          console.log(`${Taskname} Setup SucessFull!!!`);
          resolve(true);
        }
      );
    });
    return await operation;
  }
  let answer = {};
  let ackOne = await task1();

  answer = {
    "Initializes Task Setup": ackOne,
  };

  res.json(answer);
});

//Ansible connection test
router.post("/ansible-test", async (req, res) => {
  var filename = req.body.name;
  com.exec(
    `cd /home/kratos/Ansible/${filename} && ansible all -m ping`,
    (error, stderr, stdout) => {
      if (error) res.send(error);
      else if (stderr) res.send(stderr);
      else res.send("Connection sucessfull!!");
    }
  );
});

//utility remoteCommand execution route
router.post("/commandExec", async (req, res) => {
  var command = req.body.cmd;

  await exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log("error");
      res.send(error.message);
    }

    if (stderr) {
      console.log("stdError");
      res.send(stderr.message);
    }

    console.log("Executed Sucessfully");
    res.send(stdout);
  });
});
