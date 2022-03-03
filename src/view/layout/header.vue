<template>
   <div class="header-box">
        <i class="el-icon-menu"></i>
        <span class="header-title">电力设备智能监测系统</span>
        <div class="header-right">
            <button @click="users"><i class="el-icon-open"></i></button>                      
            <button @click="trun()" v-if="userInfo.role_level!=30"><i class="el-icon-s-data"></i></button>
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
           }
       },
       mounted(){},

       methods: {
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
        width:100px;float:right;height:54px;line-height: 54px;
        i{
            font-size: 18px;
        }
    }
</style>
