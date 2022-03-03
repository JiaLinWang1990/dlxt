<template>
    <div class="body-container">
         <div class='b-body'>
            <div class='b-header'>
                <div class="header-menu">
                    <div class="menu-item header-logo"></div>
                    <div :class='{ active:index===number}' v-for="(item,index) in tabs" :key=item.id @click="handleClickTab(item,index)" class="menu-item">{{item.name}}</div>               
                </div>
                <div class="header-title">
                    电力设备状态智能监测系统
                </div>
                <div class="header-right">
                    <button @click="users"><i class="el-icon-open"></i></button>                      
                    <button @click="trun()"><i class="el-icon-s-data"></i></button>
                    <button @click="logOut()"><i class="el-icon-switch-button"></i></button>
                </div>
                <div style="clear:both;"></div>
            </div>
            <div class='b-main'>
                <router-view></router-view>
            </div>
        </div>        
        
    </div>
</template>
<script>
    import * as account from '@/data/api.js'
    export default {
        data(){
            return {
                activeTab:'site',
                showChart:false,
                currentView:'file',
                number:1,
                tabs:[
                    {name:'综合统计',id:'sum'},
                    {name:'站点总览',id:'site'},
                    {name:'报警管理',id:'warning'},
                ]
            }
        },
        methods:{
            trun(){
                 this.$router.push('file')
            },
            logOut(){
                account.logout().then(res=>{
                    if(res.code==0){
                        sessionStorage.removeItem('userInfo')
                        this.$router.push('login')
                    }
                })                        
            },
            users(){},
            handleClickTab(tab,idx){
                this.activeTab = tab.id;
                this.number = idx;
                this.$router.push(tab.id)
            },
        }
    }
</script>
<style  lang='less' scoped>
.body-container{
    width:100%;height:100%;overflow: hidden;
    /deep/.el-input__inner{height:28px;line-height: 28px;}
}
.b-body{
    width:100%;height:100%;
}
.b-header{
    width:100%;height:54px;position: relative;   background:rgb(61,63,68);color:#fff;
    // background:#091335;
}
.b-main{
    width:100%;height:calc(100% - 54px);background: rgb(33,35,37);padding:10px;
}
.el-button--primary{
    margin-top: 15px;
}
.el-form-item{
    margin-bottom: 0px;
}
.el-button+.el-button{margin-left: 0;}
.b-header .el-tabs{
    width: 152px;
    height: 50px;
}

.el-input__inner{
    height: 32px;
    line-height: 32px
}
.header-menu{
   height:100%;line-height: 54px;text-align: center;float: left;
}
.menu-item{
    float:left;font-size:20px;
    width:120px;height:54px;line-height: 54px;
    border-right:solid 1px #fff;
}
.menu-item.active{
    color:#409EFF;
}
.menu-item:first-child{
    border-right:0;
}
.header-logo{
    width:150px;
}
.header-title{
    text-align: center;height:54px;line-height: 54px;font-size: 34px;
}
.header-right{
    position: absolute;right:0;top:0;;
    width:100px;float:right;height:54px;line-height: 54px;
    i{
        font-size: 18px;
    }
}
</style>
