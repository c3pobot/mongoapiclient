'use strict'
const log = require('./logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
const path = require('path')
const MONGO_API_URI = process.env.MONGO_API_URI
const fetch = require('node-fetch')
let mongoReady = false
const parseResponse = async(res)=>{
  try{
    if(!res) return
    if (res?.status?.toString().startsWith('5')) {
      throw('Bad status code '+res.status)
    }
    let body

    if (res?.status === 204) {
      body = null
    } else if (res?.headers?.get('Content-Type')?.includes('application/json')) {
      body = await res?.json()
    } else {
      body = await res?.text()
    }
    if(!body) body = res?.status
    return {
      status: res?.status,
      body: body
    }
  }catch(e){
    throw(e)
  }
}
const fetchRequest = async(uri, opts = {})=>{
  try{
    let res = await fetch(uri, opts)
    return await parseResponse(res)
  }catch(e){
    if(e?.error) return {error: e.name, message: e.message, type: e.type}
    if(e?.status) return await parseResponse(e)
    throw(e)
  }
}
const requestWithRetry = async(uri, opts = {}, count = 0)=>{
  try{
    let res = await fetchRequest(uri, opts)
    if(res?.error === 'FetchError' && 10 >= count){
      count++
      return await requestWithRetry(uri, opts, count)
    }
  }catch(e){
    throw(e)
  }
}
const apiRequest = async(uri, collection, query, data)=>{
  try{
    let payload = {method: 'POST', headers: {'Content-Type': 'application/json'}, compress: true, timeout: 60000}
    let body = { collection: collection, matchCondition: query, data: data }
    payload.body = JSON.stringify(body)
    let res = await requestWithRetry(path.join(MONGO_API_URI, uri), payload)
    if(res?.body) return res.body
    throw(res)
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
