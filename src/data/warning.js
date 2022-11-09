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

/* 站点下告警列表 */
export function siteAlarmList(params = {}, callback) {
    handlerPaging(params.data);
    return axios.request({
      "url" : baseUrl+'/sites/'+params.site_id+"/alarm_info/",
        "method": "get",
        "params":params.data
    },callback)
}
  

/* 设备下告警列表 */
export function equipmentAlarmList(params = {}, callback) {
    handlerPaging(params.data);
    return axios.request({
      "url" : baseUrl+'/equipments/'+params.equipments_id+"/alarm_info/",
        "method": "get",
        "params":params.data
    },callback)
}


/* 处理告警 */
export function handleAlarm(params = {}, callback) {
    return axios.request({
      "url" : baseUrl+'/alarms/'+params.alarm_id+"/",
        "method": "put",
        "data":params.data
    },callback)
}


