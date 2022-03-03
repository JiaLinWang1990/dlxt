<template>
    <div class='aside-style'>
        <div class="logo">logo</div>
        <div class='menu'>
            <el-menu 
                @select="handleSelect"
                :default-active="currentMenu"
                class="el-menu-vertical-demo"
                background-color="#000"
                text-color="#fff"
                active-text-color="#ffd04b">
                <el-menu-item  index="file">
                    <i class="el-icon-files"></i>
                    <span slot="title">档案管理</span>
                </el-menu-item>
                <el-menu-item index="device">
                    <i class="el-icon-s-platform"></i>
                    <span slot="title">设备管理</span>
                </el-menu-item>
                <el-menu-item index="user">
                    <i class="el-icon-user"></i>
                    <span slot="title">用户管理</span>
                </el-menu-item>
                <el-menu-item index="system">
                    <i class="el-icon-setting"></i>
                    <span slot="title">系统管理</span>
                </el-menu-item>
            </el-menu>
        </div>
    </div>
</template>
<script>
    import tree from '@/components/tree.vue'
    export default {
        components:{
            tree,
        },
        data(){
            return {
                currentMenu:'file',
                 data: [],
            }
        },
        mounted(){
            this.currentMenu = this.$route.name;
        },
        methods: {
             handleNodeClick(data) {
                console.log(data);
            },
            handleSelect(key,keyPath){
                this.$emit('skip',key)
                console.log(key,keyPath)
            },
            
        }
    }
</script>
<style lang='less'>

    .aside-style{
        height:100%;
         .logo{
            height:70px;line-height: 70px;text-align: center;
            border-bottom:solid 1px #ccc;background:#2B4C6A;
            color:#fff;font-size: 34px;;
        }
    }
    .menu{
      height: calc(100% - 70px);background: #000;
    }
    .el-menu-vertical-demo{
        border-right: 0;
    }

</style>
