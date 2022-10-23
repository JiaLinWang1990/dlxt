import { axios } from '@/util/axios.js';
const baseUrl = '/api'


/* 站点下告警列表 */
export function alarmList(params={},callback){
    return axios.request({
      "url" : baseUrl+'/sites/'+params.site_id+"/alarm_info/",
        "method": "get",
        "params":params.data
    },callback)
}
  

/* 设备下告警列表 */
export function alarmList(params={},callback){
    return axios.request({
      "url" : baseUrl+'/equipments/'+params.equipments_id+"/alarm_info/",
        "method": "get",
        "params":params.data
    },callback)
}