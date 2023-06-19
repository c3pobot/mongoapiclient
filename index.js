'use strict'
const fetch = require('node-fetch')
const Cmds = {}
const Request = async(method, collection, matchCondition, data, limitCount, skipCount )=>{
  try{
    const payload = { collection: collection, matchCondition: matchCondition, data: data, limitCount: limitCount, skipCount: skipCount }

    const obj = await fetch(process.env.MONGO_API_URI+'/'+method, {
      method: 'POST',
      timeout: 600000,
      compress: true,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    const resHeader = obj?.headers.get('content-type')
    if(resHeader?.includes('application/json')) return await obj.json()
  }catch(e){
    console.error(e);
  }
}
Cmds.aggregate = async(collection, matchCondition, data)=>{
  try{
    return await Request('aggregate', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.count = async(collection, matchCondition, data)=>{
  try{
    return await Request('count', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.cmd = Request
Cmds.del = async(collection, matchCondition, data)=>{
  try{
    return await Request('del', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.delMany = async(collection, matchCondition, data)=>{
  try{
    return await Request('delMany', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.find = async(collection, matchCondition, data)=>{
  try{
    let obj = await Request('find', collection, matchCondition, data)
    if(!obj) obj = []
    return obj
  }catch(e){
    throw (e)
  }
}
Cmds.init = async()=>{
  try{
    const obj = await Request('status')
    if(obj?.status === 'ok') return 1
  }catch(e){
    console.error(e);
  }
}
Cmds.limit = async(collection, matchCondition, data, limitCount)=>{
  try{
    return await Request('limit', collection, matchCondition, data, limitCount)
  }catch(e){
    throw (e)
  }
}
Cmds.math = async(collection, matchCondition, data)=>{
  try{
    return await Request('math', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.next = async(collection, matchCondition, data)=>{
  try{
    return await Request('next', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.pull = async(collection, matchCondition, data)=>{
  try{
    return await Request('pull', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.push = async(collection, matchCondition, data)=>{
  try{
    return await Request('push', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.rep = async(collection, matchCondition, data)=>{
  try{
    return await Request('rep', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.set = async(collection, matchCondition, data)=>{
  try{
    return await Request('set', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.setMany = async(collection, matchCondition, data)=>{
  try{
    return await Request('setMany', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
Cmds.skip = async(collection, matchCondition, data, limitCount, skipCount)=>{
  try{
    return await Request('skip', collection, matchCondition, data, limitCount, skipCount)
  }catch(e){
    throw (e)
  }
}
Cmds.unset = async(collection, matchCondition, data)=>{
  try{
    return await Request('unset', collection, matchCondition, data)
  }catch(e){
    throw (e)
  }
}
module.exports = Cmds
