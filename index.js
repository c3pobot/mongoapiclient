'use strict'
const path = require('path')
const MONGO_API_URI = process.env.MONGO_API_URI
const fetch = require('./fetch')
let mongoReady = false, retryCount = 10

const fetchRequest = async(uri, opts = {})=>{
  try{
    let res = await fetch(uri, opts)
    return await parseResponse(res)
  }catch(e){
    if(e?.error) return {error: e.name, message: e.message, type: e.type}
    throw(e)
  }
}
const requestWithRetry = async(uri, opts = {}, count = 0)=>{
  try{
    let res = await fetch(uri, opts)
    if(res?.error === 'FetchError'){
      if(count < retryCount){
        count++
        return await requestWithRetry(uri, opts, count)
      }else{
        throw(`tried request ${count} time(s) and errored with ${res.error} : ${res.message}`)
      }
    }
    return res
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
    return res?.body
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
    console.error(e)
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
Cmds.push = async(collection, query, data)=>{
  try{
    return await apiRequest('push', collection, query, data)
  }catch(e){
    throw(e)
  }
}
Cmds.insert = async(collection, data)=>{
  try{
    return await apiRequest('insert', collection, null, data)
  }catch(e){
    throw(e)
  }
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
Cmds.math = async(collection, query, data)=>{
  try{
    return await apiRequest('math', collection, query, data)
  }catch(e){
    throw(e)
  }
}
Cmds.next = async(collection, query, data)=>{
  try{
    return await apiRequest('next', collection, query, data)
  }catch(e){
    throw(e)
  }
}
Cmds.count = async(collection, query, data)=>{
  try{
    return await apiRequest('count', collection, query, data)
  }catch(e){
    throw(e)
  }
}
module.exports = Cmds
