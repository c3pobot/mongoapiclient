'use strict'
const log = require('./logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
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
      log.info('Mongo connection successful...')
    }else{
      log.error('Mongo connection error. Will try again in 5 seconds')
      setTimeout(checkMongo, 5000)
    }
  }catch(e){
    log.error(e.name+' '+e.message+' '+e.type)
    setTimeout(checkMongo, 5000)
  }
}
checkMongo()
const Cmds = {}
Cmds.del = async(collection, query, data)=>{
  try{
    return await apiRequest('del', collection, query)
  }catch(e){
    throw(e)
  }
}
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
Cmds.rep = async(collection, query, data)=>{
  try{
    return await apiRequest('rep', collection, query, data)
  }catch(e){
    throw(e)
  }
}
Cmds.aggregate = async(collection, query, pipline)=>{
  try{
    return await apiRequest('aggregate', collection, query, pipline)
  }catch(e){
    throw(e)
  }
}
module.exports = Cmds
