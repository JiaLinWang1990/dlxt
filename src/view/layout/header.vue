<template>
   <div class="header-box">
        <i class="el-icon-menu"></i>
        <span class="header-title">电力设备智能监测系统管理后台</span>
        <div class="header-right">
            <el-select v-model="language" size="mini" placeholder="请选择">
                <el-option 
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <span class="time">{{currentTime}}</span>
            <button @click="users"><i class="el-icon-user"></i></button>                      
            <button @click="trun()"><i class="el-icon-coin"></i></button>
            <button @click="logOut()"><i class="el-icon-switch-button"></i></button>
        </div>
   </div>
</template>

<script>
import * as account from '@/data/api.js'
   export default {
       name:'',
       data(){
           return {
               userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
               language:1,
               options:[
                    {value:1,label:'简体中文'}
                ],
               currentTime:'',
           }
       },
       mounted(){
           setInterval(this.timeFormat,1000)
       },

       methods: {
            timeFormat(){
                let date = new Date();
                this.currentTime = date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()+" "+date.getHours()+':'+date.getMinutes()
            },
           users(){},
           trun(){
               this.$router.push('site')
           },
           logOut(){
               account.logout().then(res=>{
                   sessionStorage.removeItem('userInfo')
                    if(res.code==0){
                        this.$router.push('login')
                    }
                }) 
           }
       }
   }
</script>

<style lang='less' scoped>
    .header-box{padding: 0 20px;}
    .header-title{font-size:22px;margin-left:20px;}
    .header-right{
        position: absolute;right:0;top:0;;
        float:right;height:54px;line-height: 54px;
         i{
        font-size: 18px;
        color:#000;
    }
    button{
        border:0;background:#CCCCCC;cursor: pointer;padding-right:5px;
    }
    /deep/.el-select{width:120px;padding-right:10px;}
    /deep/.el-input__inner{
        background:#000;color:#fff;
    }
    .time{
        padding-right:10px;font-size: 14px;;
    }
    }
</style>
