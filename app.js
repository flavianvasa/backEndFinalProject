const express = require('express')
var bodyParser = require('body-parser')
const con = require('./db/conn')
const router_1 = require('./controller/login')
const router_2 = require('./controller/private')
const router_public = require('./controller/public/showIssues')
const csvtojson = require("csvtojson");
let url = "mongodb://localhost:27017/";
const app = express()
const port = 3000
con.client.connect()
csvtojson().fromFile("reporter.csv").then(csvData => {
    csvData.forEach( obj =>{
        con.client.db("userDB").collection("userCollection").updateOne({ "username": obj.username }, { $set: obj }, { upsert: true }, (err, res) => {
            if (err) throw err;
            //con.client.close();
        });
    });
});
csvtojson().fromFile("developer.csv").then(array => {
    array.forEach( obj =>{
        con.client.db("userDB").collection("userCollection").updateOne({ "username": obj.username }, { $set: obj }, { upsert: true }, (err, res) => {
            if (err) throw err;

            //con.client.close();
        });
    });

});
app.use(bodyParser.json())
app.use('/app', router_1.login);
app.use('/private', router_2.private);
app.use('/public',router_public.public)
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});