<template>
    <div>
        <el-dialog :visible.sync="showDetails" width="480px" title="报警详情">        
            <div class="body-content">
                <div class="warn-info">
                    <p class="info-title">报警信息</p>
                    <div style="display:table">
                        <el-col :span="24">
                            <el-col :span="5"> 报警时间：</el-col>
                            <el-col :span="17">{{detailsInfo.create_date?detailsInfo.create_date:detailsInfo.update_time}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 设备名称：</el-col>
                            <el-col :span="17">{{detailsInfo.equipment_name}}</el-col>                        
                        </el-col>
                        <el-col :span="24" v-if="detailsInfo.site_name">
                            <el-col :span="5"> 站点名称：</el-col>
                            <el-col :span="17">{{detailsInfo.site_name}}</el-col>                        
                        </el-col>
                        <el-col :span="24" v-if="detailsInfo.point_name">
                            <el-col :span="5"> 测点名称：</el-col>
                            <el-col :span="17">{{detailsInfo.point_name}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 传感器类型：</el-col>
                            <el-col :span="17">{{detailsInfo.sensor_type}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 报警状态：</el-col>
                            <el-col :span="17">{{alarmLevel[detailsInfo.alarm_level]}}</el-col>                        
                        </el-col>
                        <el-col :span="24">
                            <el-col :span="5"> 报警描述：</el-col>
                            <el-col :span="17">{{detailsInfo.alarm_describe}}</el-col>                        
                        </el-col>
                    </div>   
                    <div class="form-class">
                         <p class="info-title">报警处理</p>
                         <el-form :model="handleForm" label-position="left">
                           <el-form-item label="处理结果："  label-width="98px">
                            <el-radio-group v-model="handleForm.is_processed">
                                <el-radio :label="true">已处理</el-radio>
                                <el-radio :label="false">未处理</el-radio>
                            </el-radio-group>
                                
                           </el-form-item>
                                <el-form-item label="处理意见：" label-width="98px">
                                    <el-input type="textarea" placeholder="请输入内容" v-model="handleForm.processed_remarks">
                                </el-input>
                           </el-form-item>
                         </el-form>

                    </div>    
                </div>
            </div>   
             <span slot="footer" class="dialog-footer">
                <el-button @click="showDetails = false">取 消</el-button>
                <el-button type="primary" @click="handleAlarm">确 定</el-button>
            </span>         
        </el-dialog>
    </div>
</template>
<script>
import * as warning from '@/data/warning.js'
export default {
   data() {
      return {
        showClo:false,       
        handleForm:{
            is_processed:'',
            processed_remarks:'',
          },
          alarmLevel: ['正常', '预警', '报警'],
      }
   },
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        detailsInfo: {
            type: Object,
            default: {}
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
    mounted() {
        if (this.detailsInfo) {
            this.handleForm.is_processed = this.detailsInfo.is_processed;
        }
   },
    methods: {
        handleAlarm(row) {            
            warning.handleAlarm({data:this.handleForm,alarm_id:this.detailsInfo.alarm_id}).then(res => {
                console.log(res,);
                this.$message({ type: 'success', message: '修改成功' }); 
                this.$emit("clickNode");
                this.$emit("refreshTree");//更新树的未处理数
                this.showDetails = false
            })
        }
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
