<template>
   <div>
       <el-dialog :visible.sync="dialogVisible"  width="1000px" :close-on-click-modal="false" top="30px">
           <div style="width:25px;height:25px;cursor:pointer;float:right;padding-right:5px;padding-top:10px;">
               <i class="el-icon-error" style="font-size:25px;color:#CA5051;" @click="dialogVisible=false"></i>
           </div>
           <div class="dialog_header">
               机械特性数据
           </div>
           <div class="">
               <el-tabs v-model="activeName" type="card">
                <!-- <div class="pane-content">
                            <div class="content-chart">dddd</div>
                            <div class="content-params">eeee</div>
                        </div> -->
                    <el-tab-pane label="断路器机械特性" name="first"></el-tab-pane>
                    <el-tab-pane label="储能电机电流" name="second"></el-tab-pane>
                    <el-tab-pane label="主回路电流" name="third"></el-tab-pane>
                </el-tabs>  
                <component :is="isComponent" :dataInfo="dataInfo" :dataDetails="dataDetails"></component>  
           </div>
                        
        </el-dialog>
   </div>
</template>

<script>
import * as echarts from 'echarts';
import * as device from '@/data/device.js'
import dlq from './dlq.vue'
import zhl from './zhl.vue'
import cnjd from './cndj.vue'
   export default {
       name:'',     
       props:{
           visible:{
               type:Boolean,
               default:false
           },       
           dataDetails:{
               type:Object,
               default:()=>{}
           },   
       },
       computed:{
           dialogVisible:{
               get(){
                   return this.visible;
               },
               set(val){
                   this.$emit('update:visible',val)
               }
           },
           isComponent() {
                return this.componentsList[this.activeName];
            }
       },
       data(){
           let This = this;
           return {
               activeName:'first',
               componentsList:{                  
                    first:resolve => {require(['./dlq.vue'], resolve)},
                    second:resolve => {require(['./cndj.vue'], resolve)},
                    third:zhl
               },    
               dataInfo: {}        
           }
       },
       mounted(){
        this.$nextTick(()=>{
            this.getSensorDetails(this.dataDetails)
        })         
       },
        methods: {
            getSensorDetails(item) { 
                device.sensorDetails({sensor_data_id:item.sensor_data_id,sensor_type:item.sensor_type}).then(res => {
                    console.log(res,'机械特性详情');
                    this.dataInfo=res.data;
                })
            },
        }
   }
</script>
<style lang='less' scoped>
    /deep/.el-dialog__header{
       padding: 0;
       background: #141E38;
       border:none;
       .el-dialog__headerbtn{
           top: 3px;
       }
       .el-dialog__headerbtn .el-dialog__close{
           color:#fff;
           display: none;
       }
    }
      /deep/.el-dialog__body{
        padding:0;
        background: #fff;
    }
    .dialog_header{
        height:46px;line-height: 46px;
        width:100%;text-align: center;color:#fff;font-size: 20px;background:#4472C4;
    }
    /deep/.el-tabs{
        padding-top: 15px;;
        .el-tabs__item{
            color:#409eff;
            border:solid 1px #4472C4;
            height:30px;line-height: 30px;;
            margin-right:1px;
            border-radius:3px;
            font-size: 16px;
        }
        .el-tabs__item:last-child{
            border-right:solid 1px #4472C4;
        }
        .el-tabs__nav-wrap{
            margin-bottom:0;
        }
        .el-tabs__item.is-active{
            background:#409eff;
            color:#fff;
        }
        .el-tabs__header{
            border:none;
            padding:0 20px;
            margin:0;
        }
        .el-tabs__nav{
            border:none;
        }
        .el-tab-pane{
            width:100%;
        }
    }
</style>
