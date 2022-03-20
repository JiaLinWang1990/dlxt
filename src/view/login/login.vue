<template>
    <div class="login-content">
        <div class="left-bg">

        </div>
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
</template>

<script>
import * as account from '@/data/api.js'
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
       }
   }
  },
  methods: {
      login(){
          account.login(this.formModel).then(res=>{
              if(res.code == 0){
                sessionStorage.setItem('userInfo',JSON.stringify(res.data))
                  this.$router.push({name:'site'})
              }              
          },err=>{
              console.log
          })          
      }
  }
}
</script>

<style lang='less' scoped>
    .login-content{
        height:100%;
        // background:url("~@/assets/bg.png") center center no-repeat;
        background:#000;
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
</style>
