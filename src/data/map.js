import { axios } from '@/util/axios.js';
const baseUrl = '/api'

//公司状态统计接口 
export function companyStatus(params={},callback){
    return axios.request({
      "url" : baseUrl+'/customers/'+params.customer_id+'/status-infos/',
      "method" : "get",
      "params":params.data
    },callback)
}

//站点下状态统计
export function siteStatus(params={},callback){
    return axios.request({
      "url" : baseUrl+'/sites/'+params.site_id+'/status-infos/',
      "method" : "get",
      "params":params.data
    },callback)
}

//公司最新异常通知(最多只有3条)
export function customerLatestAlarms(params={},callback){
    return axios.request({
      "url" : baseUrl+'/customers/'+params.customer_id+'/latest-alarms/',
      "method" : "get"
    },callback)
}

//站点最新异常通知(最多只有3条)
export function siteLatestAlarms(params={},callback){
  return axios.request({
    "url" : baseUrl+'/sites/'+params.site_id+'/latest-alarms/',
    "method" : "get"
  },callback)
}


//公司异常电力设备异常趋势率
export function abnormalRatio(params={},callback){
    return axios.request({
      "url" : baseUrl+'/customers/'+params.customer_id+'/abnormal-ratio/',
      "method" : "get"
    },callback)
}

//公司异常情况处理统计
export function customerAbnormal(params={},callback){
    return axios.request({
      "url" : baseUrl+'/customers/'+params.customer_id+'/count-abnormal/',
      "method" : "get"
    },callback)
}

//站点异常电力设备异常趋势率
export function siteAbnormalRatio(params={},callback){
  return axios.request({
    "url" : baseUrl+'/sites/'+params.site_id+'/abnormal-ratio/',
    "method" : "get"
  },callback)
}

//站点异常情况处理统计
export function siteAbnormal(params={},callback){
    return axios.request({
      "url" : baseUrl+'/sites/'+params.site_id+'/count-abnormal/',
      "method" : "get"
    },callback)
}
