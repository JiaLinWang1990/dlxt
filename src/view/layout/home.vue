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
                    <el-select v-model="language" size="mini" placeholder="请选择" popper-class="dark-style">
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
                userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
                activeTab:'site',
                showChart:false,
                currentView:'file',
                number:1,
                tabs:[
                    {name:'综合统计',id:'sum'},
                    {name:'站点详情',id:'site'},
                    {name:'告警管理',id:'warning'},
                ],                
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
        methods:{
            timeFormat(){
                let date = new Date();
                this.currentTime = date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()+" "+date.getHours()+':'+date.getMinutes()
            },
            trun(){
                let level = this.userInfo.role_level
                if(level==30){
                    this.$message({
                        message: '普通用户无权限',
                        type: 'warning'
                    });
                }else{
                    this.$router.push('file')
                }                
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
    width:100%;height:calc(100% - 54px);background: rgb(33,35,37);padding:40px 50px 10px 10px;
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
   position:absolute;font-size:20px;z-index: 999;left:0;top:0;
}
.menu-item{ 
    float:left;   
    padding:0 15px;height:54px;line-height: 54px;
    border-right:solid 1px #fff;cursor: pointer;
}
.menu-item.active{
    color:#409EFF;
}
.menu-item:first-child{
    border-right:0;
}
.header-logo{
    width:150px;
    background: url("~@/assets/h-logo.png") no-repeat;
    background-size: 94% 100%;
    background-position: 10px 0;
}
.header-title{
    text-align: center;height:54px;line-height: 54px;font-size: 34px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
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
