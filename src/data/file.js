import { axios } from '@/util/axios.js';
const baseUrl = '/api'
/* 新增公司 ok*/
export function addCompany(params={},callback){
    return axios.request({
      "url" : baseUrl+"/customers/",
      "method" : "post",
      "data":params
    },callback)
}
/* 修改公司*/
export function editCompany(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customers/"+params.customer_id+'/',
    "method" : "put",
    "data":params.params
  },callback)
}
/* 公司详情ok */  
export function companyDetails(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customers/"+params.customer_id+'/',
    "method" : "get",
  },callback)
}
/* 删除公司ok */
export function delCompany(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customers/"+params.customer_id+'/?clear_resource='+params.isClear,
    "method" : "delete",
  },callback)
}
/* 公司下所有站点详情 */  
export function companySitesDetails(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customer_sites/"+params.customer_id+'/',
    "method" : "get",
  },callback)
}
/* 新增站点ok */
export function addSite(params={},callback){
    return axios.request({
      "url" : baseUrl+"/customer_sites/"+params.parent_id+'/',
      "method" : "post",
      "data":params.params
    },callback)
}
/* 修改站点*/
export function editSite(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customer/"+params.customer_id+'/sites/'+params.site_id+'/',
    "method" : "put",
    "data":params.params
  },callback)
}
/* 删除站点ok */
export function delSite(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customer/"+params.customer_id+'/sites/'+params.site_id+'/?clear_resource='+params.isClear,
    "method" : "delete",
  },callback)
}
/* 站点详情 */
export function siteDetails(params={},callback){
  return axios.request({
    "url" : baseUrl+"/customer/"+params.customer_id+'/sites/'+params.site_id+'/',
    "method" : "get",
  },callback)
}
/* 站点下设备详情 */
export function siteDeviceDetails(params={},callback){
  return axios.request({
    "url" : baseUrl+"/sites/"+params.site_id+'/equipment/',
    "method" : "get",
  },callback)
}

/* 新增设备ok */
export function addDevice(params={},callback){
    return axios.request({
      "url" : baseUrl+"/sites/"+ params.site_id +"/equipment/",
      "method" : "post",
      "data":params.params
    },callback)
}
/* 删除设备 */
export function delDevice(params={},callback){
  return axios.request({
    "url" : baseUrl+"/sites/"+params.site_id+'/equipments/'+params.equipment_id+'/?clear_resource='+params.isClear,
    "method" : "delete",
  },callback)
}
/* 修改设备*/
export function editDevice(params={},callback){
  return axios.request({
    "url" : baseUrl+"/sites/"+params.site_id+'/equipments/'+params.equipment_id+'/',
    "method" : "put",
    "data":params.params
  },callback)
}
/* 设备详情 */
export function deviceDetails(params={},callback){
  return axios.request({
    "url" : baseUrl+"/sites/"+params.site_id+'/equipments/'+params.device_id+'/',
    "method" : "get",
  },callback)
}

/* 新增测点ok */
export function addPoint(params={},callback){
    return axios.request({
      "url" : baseUrl+"/equipment/"+params.device_id+"/point/",
      "method" : "post",
      "data":params.params
    },callback)
}

/* 修改测点*/
export function editPoint(params={},callback){
  return axios.request({
    "url" : baseUrl+"/equipment/"+params.equipment_id+'/point/'+params.point_id+'/',
    "method" : "put",
    "data":params.params
  },callback)
}
/* 单个测点详情 */
export function pointDetails(params={},callback){
  return axios.request({
    "url" : baseUrl+"/equipment/"+params.equipment_id +"/point/"+params.point_id+'/' ,
    "method" : "get",
  },callback)
}

/* 删除测点 */
export function delPoint(params={},callback){
  return axios.request({
    "url" : baseUrl+"/equipment/"+params.equipment_id+'/point/'+params.point_id+'/?clear_resource='+params.isClear,
    "method" : "delete",
  },callback)
}


/*导入档案*/ 
export function importFile(params={},callback){
  return axios.request({
    "url" : baseUrl+"/file_import/",
    "method" : "post",
    "data":params.data
  },callback)
}

