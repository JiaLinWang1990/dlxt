<template>
   <div class="header-box">
        <!-- <i class="el-icon-menu"></i> -->
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
            <el-dropdown  trigger="click" @command="handleCommand">
                <button @click="users"><i class="el-icon-user"></i></button>  
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>修改信息</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>                    
            <button @click="trun()"><i class="el-icon-s-home"></i></button>
            <button @click="logOut()"><i class="el-icon-switch-button"></i></button>
        </div>
        <div v-if="editUserDialog">
            <el-dialog title="修改信息" :visible.sync="editUserDialog" width="500px">
                <el-form :model="form">
                    <el-form-item label="密码:" :label-width="formLabelWidth">
                        <el-input v-model="form.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱:" :label-width="formLabelWidth">
                        <el-input v-model="form.email" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="电话:" :label-width="formLabelWidth">
                        <el-input v-model="form.phone" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editUserDialog = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </div>
            </el-dialog>
        </div>
   </div>
</template>

<script>
import * as account from '@/data/api.js'
import {MessageBox} from 'element-ui';
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
               editUserDialog:false,
               form:{
                    password:'',
                    email:'',
                    phone:'',
               },
               formLabelWidth:"80px"
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
                let This = this;
                this.$confirm('是否退出系统?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    account.logout().then(res=>{
                        if(res.code==0){
                            sessionStorage.removeItem('userInfo')
                            This.$router.push('login')
                        }
                    }) 
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });          
                }); 
           },
           handleCommand(){
                this.editUserDialog = true;                 
           },
           editUserInfo(){
                account.editUserInfo({data:this.form,userId:this.userInfo.id}).then(res=>{
                    console.log(res,'res')
                    this.editUserDialog = false;
                    this.$router.push('login')
                })                
           } 
       }
   }
</script>

<style lang='less' scoped>
    .header-box{padding: 0 20px;
        /deep/.el-input__inner{height:28px;line-height: 28px;}
        /deep/.el-dialog__header{
            line-height: 32px;
        }
    }
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
        // background:#000;color:#fff;
    }
    .time{
        padding-right:10px;font-size: 14px;;
    }
    /deep/.el-dropdown-menu{
        padding:0;
    }
    /deep/.el-form-item{
        margin-bottom: 0px;
    }
    
}
</style>
