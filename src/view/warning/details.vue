<template>
    <div>
        <el-dialog :visible.sync="showDetails" width="480px" title="报警详情">        
            <div class="body-content">
                <div class="warn-info">
                    <p class="info-title">报警信息</p>
                    <div style="display:table">
                        <el-col :span="24">
                            <el-col :span="5"> 报警时间：</el-col>
                            <el-col :span="17">{{detailsInfo.warningTime}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 设备名称：</el-col>
                            <el-col :span="17">{{detailsInfo.deviceName}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 站点名称：</el-col>
                            <el-col :span="17">{{detailsInfo.siteName}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 测点名称：</el-col>
                            <el-col :span="17">{{detailsInfo.pointName}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 传感器类型：</el-col>
                            <el-col :span="17">{{detailsInfo.sensorType}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 报警状态：</el-col>
                            <el-col :span="17">{{detailsInfo.state}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 报警描述：</el-col>
                            <el-col :span="17">{{detailsInfo.description}}</el-col>                        
                        </el-col>
                    </div>   
                    <div class="form-class">
                         <p class="info-title">报警处理</p>
                         <el-form :model="handleForm" label-position="left">
                           <el-form-item label="处理结果："  label-width="98px">
                                <el-radio v-model="handleForm.result" label="1">已处理</el-radio>
                                <el-radio v-model="handleForm.result" label="2">未处理</el-radio>
                           </el-form-item>
                                <el-form-item label="处理意见：" label-width="98px">
                                    <el-input type="textarea" placeholder="请输入内容" v-model="handleForm.description">
                                </el-input>
                           </el-form-item>
                         </el-form>

                    </div>    
                </div>
            </div>   
             <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>         
        </el-dialog>
    </div>
</template>
<script>
export default {
   data() {
      return {
        showClo:false,
        detailsInfo:{
            warningTime:"2022-07-11 15:59:00",
            deviceName:'长沙出线间隔A相刀闸',
            siteName:'长沙站',
            pointName:'测点1',
            sensorType:'AE',
            state:'告警',
            description:'悬浮放电100%',
        },
        handleForm:{
            result:'',
            description:'',
        }
      }
   },
    props:{
        visible:{
            type:Boolean,
            default:false
        }
    },
   computed:{
        showDetails:{
               get(){
                   return this.visible;
               },
               set(val){
                   this.$emit('update:visible',val)
               }
           }
       },
   created(){
   },
   mounted(){
   },
   methods:{
   },
}
</script>
<style lang="less" scoped>
/deep/.el-dialog{
    
    background: #2C2E30;
    .el-dialog__header{
        padding:8px 5px;
        border-bottom: solid 3px #ccc;
        .el-dialog__title{
            color:#fff;
        }
    } 
   
    .el-dialog__headerbtn{
        top:8px;
    }
    .el-dialog__body{
        padding:0;
        color:#fff;
        .form-class{
            .el-form-item__label{
                text-align: right;                
            }
            .el-form-item__label,.el-form-item__content{
                line-height: 28px;color:#fff;
            }
            .el-radio{
                color:#fff;
            }
        }
        .warn-info{
            padding:0 30px;
            .el-col-5{
                text-align: right;
            }
            .el-col-5,.el-col-17{
                height:28px;line-height: 28px;
            }
            .info-title{
                height:32px;line-height: 32px;;
            }
        }
    }
    .el-dialog__footer{
        text-align: center;padding:10px;
        .el-button{
            padding:5px 15px;background:transparent;color:#fff;
        }
    }

}
</style>
