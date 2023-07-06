'use strict'
const path = require('path')
const MONGO_API_URI = process.env.MONGO_API_URI
const fetch = require('node-fetch')
let mongoReady = false
const apiRequest = async(uri, collection, query, data)=>{
  try{
    let payload = {method: 'POST', headers: {'Content-Type': 'application/json'}, compress: true, timeout: 60000}
    let body = { collection: collection, matchCondition: query, data: data }
    payload.body = JSON.stringify(body)
    let res = await fetch(path.join(MONGO_API_URI, uri), payload)
    if(res.headers?.get('Content-Type')?.includes('application/json')) return await res.json()
  }catch(e){
    throw(e)
  }
}
const checkMongo = async()=>{
  try{
    let res = await apiRequest('status')
    if(res?.status === 'ok'){
      mongoReady = true
      console.log('Mongo connection successful...')
    }else{
      console.error('Mongo connection error. Will try again in 5 seconds')
      setTimeout(checkMongo, 5000)
    }
  }catch(e){
    console.error(e.name+' '+e.message+' '+e.type)
    setTimeout(checkMongo, 5000)
  }
}
checkMongo()
const Cmds = {}
Cmds.set = async(collection, query, data)=>{
  try{
    return await apiRequest('set', collection, query, data)
  }catch(e){
    throw(e)
  }
}
Cmds.find = async(collection, query, project)=>{
  try{
    return await apiRequest('find', collection, query, project)
  }catch(e){
    throw(e)
  }
}
Cmds.mongoStatus = () =>{
  return mongoReady
}
module.exports = Cmds
