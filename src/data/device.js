import { axios } from '@/util/axios.js';
const baseUrl = '/api'

//query sensor_infos from company
export function queryTree(params={},callback){
    return axios.request({
      "url" : baseUrl+'/customer-trees/',
      "method" : "get",
      "params":params
    },callback)
}

//query sensor_infos from equipment
export function queryEquipmentSensor(params={},callback){
    let urlParams = '/equipments/'+params.equipments+'/sensor_info/';
    return axios.request({
      "url" : baseUrl+urlParams,
      "method" : "get",
      "params":params
    },callback)
}

//query sensor_infos from site
export function querySiteSensor(params={},callback){
    let urlParams = '/sites/'+params.sites+'/sensor_info/';
    return axios.request({
      "url" : baseUrl+urlParams,
      "method" : "get",
    },callback)
}

//query point trend
export function queryPointTrend(params={},callback){
  return axios.request({
    "url" : baseUrl+'/points_trend/',
    "method" : "post",
    "data":params
  },callback)
}

//query 设备导航图
export function queryDeviceTree(params={},callback){
  return axios.request({
    "url" : baseUrl+'/gateway-trees/',
    "method" : "get",
  },callback)
}

//创建主机
export function addDevice(params={},callback){
  return axios.request({
    "url" : baseUrl+'/gateways/',
    "method" : "post",
    "data":params.params
  },callback)
}
//修改主机
export function editDevice(params={},callback){
  return axios.request({
    "url" : baseUrl+'/gateways/'+params.gateway_id+'/',
    "method" : "put",
    "data":params.params
  },callback)
}

/* 单个主机详情 */
export function gatewayDetails(params={},callback){
  return axios.request({
    "url" : baseUrl+"/gateways/"+params.gateway_id+'/',
    "method" : "get",
  },callback)
}

/* 删除主机 */
export function delGateway(params={},callback){
  return axios.request({
    "url" : baseUrl+"/gateways/"+params.gateway_id+'/?clear_resource='+params.isClear,
    "method" : "delete",
  },callback)
}
/* 站点下主机列表信息 */
export function siteGateways(params={},callback){
  return axios.request({
    "url" : baseUrl+'/sites/'+params.site_id+"/gateways/",
    "method" : "get",
  },callback)
}

/* 下发指令 */ 
export function publishSensors(params={},callback){
  return axios.request({
    "url" : baseUrl+'/gateways/'+params.gateway_id+"/publish_sensors/",
    "method" : "get",
  },callback)
}


/*主机下传感器列表*/ 
export function getSensorList(params={},callback){
  let _params = params.searchForm || {};
  return axios.request({
    "url" : baseUrl+'/gateways/'+params.gateway_id+"/sensor_info/",
    "method" : "get",
    "params":_params
  },callback)
}