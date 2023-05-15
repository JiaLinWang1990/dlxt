<template>
    <div style="height:100%">        
        <div class='b-header'>
            <div class="header-menu">
                <div class="menu-item header-logo"></div>
            </div>          
            <div class="header-right">
                <el-select v-model="language" size="mini" placeholder="请选择" popper-class="dark-style">
                    <el-option 
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <span class="time">{{currentTime}}</span>               
            </div>
            <div style="clear:both;"></div>
        </div>
        <div class="login-content">
            <div class="left-bg"></div>
            <div class="login-box">
                <div class="login-logo"></div>
                <p class='login-title'>欢迎登录</p>
                <el-form :model="formModel" :rules="rules" ref="formModel" class="login-form" label-position="left" label-width="60px">
                    <el-form-item  prop="username" label="账号">
                        <el-input v-model="formModel.username"></el-input>
                    </el-form-item> 
                    <el-form-item prop="password"  label="密码">
                        <el-input type='password' v-model="formModel.password"></el-input>
                    </el-form-item>                                  
                </el-form>
                <div class="login-set">
                    <el-checkbox v-model="checked" label="自动登录" style="float:left;color:#468EFF;"></el-checkbox>
                    <span style="float:right;color:#468EFF;cursor:pointer;font-size:14px;">忘记密码</span>
                </div>
                <el-button class="login-btn"  style="width:100%;background:#5A5B5C;border:0;color:#fff;" @click="login">登录</el-button>

            </div>
        </div>
    </div>
</template>

<script>
import * as account from '@/data/api.js'
import Bus from "@/util/Bus.js";
export default {
  name:'',
  data(){
   return {
       formModel:{
           username:"",
           password:'',
       },
       checked:false,
       rules:{
           username: [
            { required: true, message: '请输入账户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
       },
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
      login(){
          account.login(this.formModel).then(res=>{
              if(res.code == 0){
                    sessionStorage.setItem('userInfo',JSON.stringify(res.data))
                  this.$router.push({ name: 'sum' })
                    Bus.$emit('logined',res.data.id)
              }              
          },err=>{
              console.log(err)
          })          
      }
  }
}
</script>

<style lang='less' scoped>
    .login-content{
        height:calc(100% - 54px);
        // background:url("~@/assets/bg.png") center center no-repeat;
        background:#212325;
        background-size:100% 100%;
        display: flex;    justify-content:center;align-items:center;
    }
    .left-bg{
        width:562px;height: 330px;background:url("~@/assets/login-bg.png");
        background-size:100% 100%;border-radius: 10px;;
    }
    .login-box{
        height:450px;width:450px;border-radius:10px;
        // position:absolute;top:0;bottom:0;right:0;left:0;margin:auto;
        text-align: center;padding:40px 50px;box-sizing: border-box;
        .el-form-item{
            margin-bottom: 22px;
        }
    }
    .login-logo{
        width: 50px;height:42px;
        background: url("~@/assets/logo.png");
        margin:0 auto;
        text-align: center;
    }
    .login-title{
        color:#fff;
        margin-top: 15px;font-size: 20px;
    }
    .login-form{
        margin-top:50px;
    }
    .login-set{
        margin-top:20px;
    }
    /deep/.login-set .el-checkbox{
        color:#000;
    }
    .login-btn{
        width:100%;margin-top: 30px;letter-spacing: 5px;font-size: 20px;
    }
    /deep/.el-form-item__label{
        color:#fff;
    }
    .b-header{
        width:100%;height:54px;position: relative;   background:rgb(61,63,68);color:#fff;
        // background:#091335;
    }
    .header-menu{
        height:100%;line-height: 54px;text-align: center;float: left;
        position:absolute;font-size:20px;z-index: 999;left:0;top:0;
    }
    .header-logo{
        width:150px;
        background: url("~@/assets/h-logo.png") no-repeat;
        background-size: 94% 100%;
        background-position: 10px 0;
    }
    .menu-item{ 
        float:left;   
        padding:0 15px;height:54px;line-height: 54px;
        cursor: pointer;
    }
    .header-right{
        position: absolute;right:10px;top:0;z-index: 1;
        float:right;height:54px;line-height: 54px;
        i{
            font-size: 18px;
            color:#fff;
        }
        button{
            border:0;background:#3D3F44;cursor: pointer;padding-right:5px;
        }
        /deep/.el-select{width:120px;padding-right:10px;}
        /deep/.el-input__inner{
            background:#212325;color:#fff;
        }
        .time{
            padding-right:10px;font-size: 14px;;
        }
    }
</style>
