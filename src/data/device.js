import { axios } from '@/util/axios.js';
const baseUrl = '/api'

function handlerPaging(params={}){
  let {page,limit} = params;
  let pn = parseInt(page),ps = parseInt(limit);
  if(isNaN(pn) || pn < 0 ){
    pn = 1;
  }
  if(isNaN(ps) || ps < 1 ){
    ps = 10;
  }
  return Object.assign(params,{page:pn,limit:ps})
}


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
      params:params
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
  let _params = params || {};
  handlerPaging(_params);
  return axios.request({
    "url" : baseUrl+'/gateways/'+params.gateway_id+"/sensor_info/",
    "method" : "get",
    "params":_params
  },callback)
}


/*趋势详情*/

export function queryTrendDetail(params={},callback){
  return axios.request({
    "url" : baseUrl+'/points-graph/',
    "method" : "post",
    "data":params
  },callback)
}


/* 传感器详情 */
export function sensorDetails(params={},callback){
    return axios.request({
      "url" : baseUrl+"/sensor/"+params.sensor_data_id+'/sensor_type/'+params.sensor_type+'/',
      "method" : "get",
    },callback)
}
  


//地图页面接口
export function queryTrees(params={},callback){
    return axios.request({
      "url" : baseUrl+'/map/customer-tress/',
      "method" : "get",
      "params":params
    },callback)
}



/*导入网关*/ 
export function importFile(params={},callback){
    return axios.request({
      "url" : baseUrl+"/gateway_file_import/",
        "method": "post",       
      "data":params.data
    },callback)
  }
  
  /* 导出网关 */
export function exportData(params={},callback){
    return axios.request({
        "url" : baseUrl+'/gateway_file_export/',
        "method": "get",
        "responseType": "blob",
        "params":params
    },callback)
}

/* 获取采集时间间隔接口 */
export function querySensorTiming(params={},callback){
    return axios.request({
      "url" : baseUrl+'/gateway/'+params.client_number+'/sensor_id/'+params.sensor_id+'/',
      "method" : "get",
    },callback)
}

/* 修改采集时间间隔接口 */
export function setSensorTiming(params={},callback){
  return axios.request({
    "url" : baseUrl+'/gateway/'+params.client_number+'/sensor_id/'+params.sensor_id+'/',
    "method" : "put",
    "data":params.params
  },callback)
}


/* 同种批量应用 */
export function setBatch(params={},callback){
  return axios.request({
    "url" : baseUrl+'/sensor-upload-intervals/',
    "method" : "put",
    "data":params
  },callback)
}


/* 传感器详情机械特性特有 */
export function getCNDJInfo(params={},callback){
  return axios.request({
    "url" : baseUrl+'/mech-motor/'+params.sensor_number+'/details/',
    "method" : "get",
  },callback)
}



/* 
传感器工作模式修改
*/
export function setWorkMode(params={},callback){
    return axios.request({
      "url" : baseUrl+'/sensor-work-mode/sensor_id/'+params.sensor_id+'/',
      "method" : "put",
      "data":params.data
    },callback)
  }