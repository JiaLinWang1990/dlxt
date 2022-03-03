import Vue from 'vue'
import axios from 'axios';
import router from '@/router'
import {Message} from 'element-ui';
function getCookie(cookName){

    var cookieStr = document.cookie.split(";");

    for (var i = 0; i < cookieStr.length; i++){

    var val = cookieStr[i].split("=");

    if (escape(cookName) == val[0].replace(/\s*/g,""))
    return unescape(val[1]);
    }
    return null;
}
axios.interceptors.request.use(config => {
    let {isLogin, header = {}, params = {}, data = {}, url} = config;
    // config.url += basePath;
    let cookie = getCookie('cloud_token');
    if(cookie){
        config.headers['X-AUTH-TOKEN'] = cookie;
    }else{

    }

//    config.data = Object.assign(config.data,authConfig)
    return config;
}, (error) => {
    return Promise.reject(error);
});


axios.interceptors.response.use((response) => {
    let {data, config, headers,status} = response
    if(data.code!=0){
        return  Promise.reject(data.msg)
    }
    return response.data;
}, (error) => {    
    Message({
        message: error.response.data.msg,
        type: 'error',
        showClose: true,
        center: true
    })
    if(error.response.status == '401'){
        window.router.push({path:'/'})
    }
    return Promise.reject(error);
    
})

export {axios}