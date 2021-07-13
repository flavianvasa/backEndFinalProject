const express = require('express');
const router = express.Router();
const con = require('../../db/conn') 

router.get('/publicIssues', async (req,res) =>{
  const result = await  showAllIssues();
  res.send(result);
})

router.get('/filerIssuesStatus/:status', async (req,res) =>{
  const status = req.params.status;
  const result = await  filterByStatus(status);
  res.send(result);
})

router.get('/filerIssuesRep/:reporter', async (req,res) =>{
  const reporter = req.params.reporter;
  const result = await  filterByReporter(reporter);
  res.send(result);
})

router.get('/filerIssuesType/:type', async (req,res) =>{
  const type = req.params.type;
  const result = await  filterByType(type);
  res.send(result);
})

router.get('/filerIssuesDev/:developer', async (req,res) =>{
  const developer = req.params.developer;
  const result = await  filterByDeveloper(developer);
  res.send(result);
})


async function showAllIssues(){
 
    const result = await  con.client.db("userDB").collection("issuesCollection").find().toArray();
    return result;
 
}

async function filterByStatus(status){
 
  const result = await  con.client.db("userDB").collection("issuesCollection").find({"status":status}).toArray();
  return result;

}

async function filterByReporter(reporter){
 
  const result = await  con.client.db("userDB").collection("issuesCollection").find({"author":reporter}).toArray();
  return result;

}

async function filterByType(type){
 
  const result = await  con.client.db("userDB").collection("issuesCollection").find({"type":type}).toArray();
  return result;

}

async function filterByDeveloper(developer){
 
  const result = await  con.client.db("userDB").collection("issuesCollection").find({"developer":developer}).toArray();
  return result;

}

module.exports={
  public:router
}