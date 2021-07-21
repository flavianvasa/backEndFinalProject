var express = require('express');
var router = express.Router();
const con = require('../../db/conn')


router.post('/addIssues', async(req,res) =>{
const {status,issue,type,developer} = req.body;
const author = req.user;
const result = await addIssues(status,issue,author,type,developer);

return res.json(result);

})


router.put('/updateIssues/:id', async(req,res) =>{
   const _id = req.params.id;
   const id = parseInt(_id);
  
    const author = req.user;
    const {status,issue, type,developer}= req.body;
     const result = await isAuthor(id,author);
    if (result){
       const result=await  updateIssue(id,status,issue,type,developer);
       return res.json({"message":result});
     }else{

        return res.json({"message": "This issue can be updated only by the author"});
    }
   
    })

async function addIssues (status,issue,author,type,developer){
    
        const result = await  con.client.db("userDB").collection("issuesCollection")
.insertOne({"_id":await getNextSequenceValue("productid"),"status":status,"issue":issue, "author":author,"type":type,"developer":developer});
        
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

async function updateIssue(id,status,issue,type,developer){
   const result = await  con.client.db("userDB").collection("issuesCollection").updateOne({"_id" : id},{$set:{"status":status,"issue":issue,"type":type,"developer":developer}});
   if  (result.modifiedCount === 1){
    return "updated"
} else{
    return "failed updating"
}  

}


module.exports = {
    reporterController:router
};