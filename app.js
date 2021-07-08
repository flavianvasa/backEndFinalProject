const express = require('express')
const mongodb = require("mongodb").MongoClient;
const con = require('./db/conn')
const csvtojson = require("csvtojson");
let url = "mongodb://localhost:27017/";
const app = express()
const port = 3000
con.client.connect()
csvtojson()
    .fromFile("reporter.csv")
    .then(csvData => {
        // mongodb.connect(
        //     url,
        //     { useNewUrlParser: true, useUnifiedTopology: true },
        //     (err, client) => {
        //       if (err) throw err;
       // con.client.connect()
        csvData.forEach(obj => {
            con.client
                .db("userDB")
                .collection("userCollection")
                .updateOne(obj, { $set: obj }, { upsert: true }, (err, res) => {
                    if (err) throw err;
                    //con.client.close();
                });
        });
    });
csvtojson()
    .fromFile("developer.csv")
    .then(array => {
        // mongodb.connect(
        //     url,
        //     { useNewUrlParser: true, useUnifiedTopology: true },
        //     (err, client) => {
        //       if (err) throw err;
        
        array.forEach(obj1 => {
            con.client
                .db("userDB")
                .collection("devCollection")
                .updateOne(obj1, { $set: obj1 }, { upsert: true }, (err, res) => {
                    if (err) throw err;

                    con.client.close();
                });
        });
        
    });

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});