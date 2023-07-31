import express from "express";
import bodyP from "body-parser";
import * as exe from "./routes/execute.js";

const app = express();
const port = 9000;

app.use(express.static("./public"));
app.use(bodyP.urlencoded({extended:true}));
app.use(express.json());



app.get("/",(req,res)=>{
res.json({status:"Running"});
});

app.use("/exec",exe.router);


app.listen(port,()=>{
console.log(`Listening on port : ${port}`);
})
