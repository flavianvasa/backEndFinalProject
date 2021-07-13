var express = require('express');
var router = express.Router();
const con = require('../../db/conn')

router.get('/listIssuesDev', async (req,res) => {
const dev = req.user;
const result = await getIssuesForSpecificDev(dev);
res.send(result);
});


router.post('/updateStatus', async (req,res) => {
    const {id,status} = req.body;
    await resolveIssue(id,status);
    res.send("Updated");
    });

async function getIssuesForSpecificDev (dev){
    
    const result = await  con.client.db("userDB").collection("issuesCollection").find({"developer":dev}).toArray();
    
    return result;



}

async function resolveIssue(id,status){
    await  con.client.db("userDB").collection("issuesCollection").updateOne({"_id":id},{$set:{"status":status}});
    

}


module.exports = {
    developerController:router
};