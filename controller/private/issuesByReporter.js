var express = require('express');
var router = express.Router();
const con = require('../../db/conn')


router.post('/addIssues', async(req,res) =>{
const {status,type,developer} = req.body;
const author = req.user;
const result = await addIssues(status,author,type,developer);

return res.json(result);

})


router.post('/updateIssues/:id', async(req,res) =>{
   const _id = req.params.id;
   const id = parseInt(_id);
  
    const author = req.user;
    const {status,type,developer}= req.body;
     const result = await isAuthor(id,author);
    if (result){
        updateIssue(id,status,type,developer);
     }else{

        return res.json({"message": "This issue can be updated only by the author"});
    }
    res.json({"message": "Updated"});
    })

async function addIssues (status,author,type,developer){
    
        const result = await  con.client.db("userDB").collection("issuesCollection")
.insertOne({"_id":await getNextSequenceValue("productid"),"status":status, "author":author,"type":type,"developer":developer});
        
        return result;
    


}
async function getNextSequenceValue(sequenceName){
    var sequenceDocument = await  con.client.db("userDB").collection("counters").findOneAndUpdate(
       {_id: sequenceName },
        {$inc:{sequence_value:1}},
       
    );
    return sequenceDocument.value.sequence_value;
 }

 
async function isAuthor (_id,author){
    
    const result = await  con.client.db("userDB").collection("issuesCollection").findOne({"_id":_id} );
   if  ( result.author === author){return true}
    return false;



}

async function updateIssue(id,status,type,developer){
    await  con.client.db("userDB").collection("issuesCollection").updateOne({"_id" : id},{$set:{"status":status,"type":type,"developer":developer}});
    

}


module.exports = {
    reporterController:router
};