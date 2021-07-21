var express = require('express');
var router = express.Router();
const con = require('../../db/conn')

router.get('/listIssuesDev', async (req,res) => {
const dev = req.user;
const result = await getIssuesForSpecificDev(dev);
res.send(result);
});


router.put('/updateStatus', async (req,res) => {
    const {id,status} = req.body;
    const result =await resolveIssue(id,status);
    res.json({"message":result});
    });

async function getIssuesForSpecificDev (dev){
    
    const result = await  con.client.db("userDB").collection("issuesCollection").find({"developer":dev}).toArray();
    
    return result;



}

async function resolveIssue(id,status){
    console.log("id "+id);
    console.log("status "+status)
  const result =  await  con.client.db("userDB").collection("issuesCollection").updateOne({"_id" : id},{$set:{"status":status}});
  
 if  (result.modifiedCount === 1){
     return "updated"
 } else{
     return "failed updating"
 }  

}


module.exports = {
    developerController:router
};