import Vue from 'vue'
import axios from 'axios';
// import router from '@/router'
import Router from '@/router/index'
import {Message,MessageBox} from 'element-ui';
function getCookie(cookName){

    var cookieStr = document.cookie.split(";");

    for (var i = 0; i < cookieStr.length; i++){

    var val = cookieStr[i].split("=");

    if (escape(cookName) == val[0].replace(/\s*/g,""))
    return unescape(val[1]);
    }
    return null;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function delCookie(name){
    setCookie(name, "", -1);
} 
axios.interceptors.request.use(config => {
    let {isLogin, header = {}, params = {}, data = {}, url} = config;
    // config.url += basePath;
    let cookie = getCookie('cloud_token');
    if(cookie){
        config.headers['X-AUTH-TOKEN'] = cookie;
    }else{
        // Router.push('login')
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
    if(error.response.status == 401){
        MessageBox.alert('登录已失效，请重新登录','提示', {
            confirmButtonText: '确定',
            callback: function () {
                delCookie('cloud_token');
                Router.push({path:'/'},()=>{})
            }
        })
    }else{
        Message({
            message: error.response.data.msg,
            type: 'error',
            showClose: true,
            center: true
        })
        return Promise.reject(new Error(error.response.data.msg))
        // console.error(error.response.statusText)
    }         
    // return Promise.reject(new Error('登录失效'));
    
})

export {axios}