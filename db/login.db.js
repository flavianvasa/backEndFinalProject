const con = require('./conn')
 
async function getUSer (_username){
    
        const result = await  con.client.db("userDB").collection("userCollection").findOne({"username":_username});
        
        return result;
    


}
module.exports = getUSer;