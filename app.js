const express = require('express')
var bodyParser = require('body-parser')
const cors = require("cors")
const con = require('./db/conn')
const router_1 = require('./controller/login')
const router_2 = require('./controller/private')
const router_public = require('./controller/public/showIssues')
const csvtojson = require("csvtojson");
let url = "mongodb://localhost:27017/";
const app = express()
var corsOptions = {
    origin: "http://localhost:4200"
};
app.use(cors(corsOptions));
const port = 3000

app.get("/", (req,res) => {
    return res.send("hello")
})
con.client.connect()
app.get("/createUsers", async(req,res) => {

  const result=await  collectionExists();
  return res.send("okay")
  
  })
async function collectionExists (){
    
    const collections = await con.client.db("userDB").listCollections().toArray();
    const collectionNames = collections.map(c => c.name).filter(name => name === "userCollection");
console.log(collectionNames)
    if( !(collectionNames[0] === "userCollection" )){

        csvtojson().fromFile("reporter.csv").then(csvData => {
            
                con.client.db("userDB").collection("userCollection").insertMany(csvData, (err, res) => {
                    if (err) throw err;
                    console.log(res);
                    
                });
            
        });
        csvtojson().fromFile("developer.csv").then(array => {
            
                con.client.db("userDB").collection("userCollection").insertMany(array, (err, res) => {
                    if (err) throw err;

        
                   if( res.insertedCount===4){
                       console.log(res.insertedCount)
                       return true
                   }
                });
            
        
        });
        
        
    }else{
        console.log(collectionNames + " exists")
        return false
    }
}


app.use(bodyParser.json())
app.use('/app', router_1.login);
app.use('/private', router_2.private);
app.use('/public',router_public.public)
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});