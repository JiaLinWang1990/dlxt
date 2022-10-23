import { axios } from '@/util/axios.js';
const baseUrl = '/api'
function  empty(obj){
  Object.keys(obj).forEach(item=>{
      if(!obj[item]||obj[item].length==0)  delete obj[item]
  })
  return obj;
}
export function login(params={},callback){
    return axios.request({
      "url" : baseUrl+"/user/login/",
      "method" : "post",
      "isLogin" : true,
      "data":params
    },callback)
}

export function logout(params={},callback){
  return axios.request({
    "url" : baseUrl+"/logout/",
    "method" : "post",
    "isLogin" : true,
    "data":params
  },callback)
}
//get customer list
export function getCustomerList(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customers/",
    "method" : "get",
    "isLogin" : true,
    "data":params
  },callback)
}
//add customer
export function addCustomerList(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customers/",
    "method" : "post",
    "data":params
  },callback)
}
//edit  user
export function usersQuery(params={},type,callback){
  return axios.request({
    "url" : baseUrl+"/users/",
    "method" : type,
    "params":params
  },callback)
}

//edit  user
export function usersRequest(params={},type,callback){
  return axios.request({
    "url" : baseUrl+"/users/",
    "method" : type,
    "data":params
  },callback)
}
//add  user
export function usersAdd(params={},type,callback){
  return axios.request({
    "url" : baseUrl+"/users/",
    "method" : type,
    "data":params
  },callback)
}
//delete  user
export function usersDelete(params={},type,callback){
  return axios.request({
    "url" : baseUrl+"/users/",
    "method" : type,
    "params":params
  },callback)
}

//site interface
export function siteRequest(params,type,callback){
  return axios.request({
    "url" : baseUrl+"/customer_sites/"+params+'/',
    "method" : type,
  },callback)
}



//用户详情修改
export function editUserInfo(params={},callback){
    return axios.request({
      "url" : baseUrl+"/user/"+params.userId+'/',
      "method" : "put",
      "data":params.data
    },callback)
  }