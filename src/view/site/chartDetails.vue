<template>
   <div>
       <el-dialog :visible.sync="dialogVisible" :width="dialogWidth">
            <div style="display:flex;flex-wrap: wrap;flex: 0 0 33%;justify-content: space-between;">
                <div class="body-content" v-for="(item,idx) in dataDetails" :key="idx">
                    <div class="basic-box">
                        <el-row class="basic-info">
                            <el-col :span="12">
                                <p>测点名称:{{item.point_name}}</p>
                                <p>传感器类型:{{item.type}}</p>
                                                        
                            </el-col>
                            <el-col :span="12">
                                <p>设备名称:{{item.device_name}}</p> 
                            </el-col>
                        </el-row>
                        <el-row class="basic-info">
                            <el-col :span="24">
                                <p>采样时间:{{item.sensor_info.update_time?item.sensor_info.update_time.substring(0,item.sensor_info.update_time.length-7):''}}</p>  
                            </el-col>
                        </el-row> 
                    </div>
                    <el-tabs  type="border-card" v-model="activeTab[idx]" @tab-click="handleClick" class="chart-tabs">
                        <el-tab-pane label="特征图谱" name="common">                            
                        </el-tab-pane>
                        <el-tab-pane label="PRPS" name="prps" v-if="item.type=='UHF'">
                        </el-tab-pane>
                        <el-tab-pane label="PRPD" name="prpd"  v-if="item.type=='UHF'">                            
                        </el-tab-pane>
                    </el-tabs>
                    <div :id="item.point_id" class="chart-3d"></div> 
                               
                </div> 
                 
            </div>
                    
        </el-dialog>
   </div>
</template>

<script>
    import * as pdcharts  from '@/util/js/index.js'
   export default {
       name:'',
        props:{
           visible:{
               type:Boolean,
               default:false
           },
           dataDetails:{
               type:Array,
               default:{}
           },
       },
       data(){
           return {
               dialogWidth:0,
               activeTab:[]
           }
       },
        computed:{
           dialogVisible:{
               get(){
                   return this.visible;
               },
               set(val){
                   this.$emit('update:visible',val)
               }
           }
       },
       created(){
           this.setDialogWidth();
       },
       mounted(){
           this.$nextTick(()=>{
                this.initChart(); 
            })  
            window.onresize = () => {
                return (() => {
                    this.setDialogWidth()
                })()
            }
       },

       methods: {
            open(){
            this.$nextTick(()=>{
                this.initChart(); 
            })                   
        },
        setDialogWidth(){
            let len = this.dataDetails.length;
            this.dialogWidth = (len==1?1:(len>4?3:2))*353 + 'px';
        },
        handleClick(tab){
            // if(tab.name=='common'){

            // }
        },
        initChart(){
            let This = this;
            this.dataDetails.forEach((item,idx)=>{
                //    let item = this.dataDetails[i];
                let data ; 
                This.activeTab[idx] = 'common'
                let actualType = item.type.toLowerCase()             
                    if(item.type=='Temp'){
                        data = JSON.parse(JSON.stringify(require('@/util/js/data/temperature.js').data));
                        actualType = 'temperature'
                        data.chartBody.series[0].dataList[0] = item.sensor_info.params?item.sensor_info.params.Temp.T:'';
                    }else if(item.type=='TEV'){
                        data = JSON.parse(JSON.stringify(require('@/util/js/data/tev.js').data));
                         data.chartBody.axisInfo.value = item.sensor_info.params.TEV.amp;
                    }else if(item.type=='AE'){
                        data = JSON.parse(JSON.stringify(require('@/util/js/data/ae.js').data));
                        let maxvalue = item.sensor_info.params.AE.maxvalue;
                        data.chartBody.series[0].dataList[0].value = Number(maxvalue).toFixed(2);//最大放电幅值
                        data.chartBody.series[1].dataList[0].value = Number(item.sensor_info.params.AE.rmsvalue).toFixed(2);//有效放电幅值
                        data.chartBody.series[2].dataList[0].value = Number(item.sensor_info.params.AE.harmonic1).toFixed(2);//频率分量1
                        data.chartBody.series[3].dataList[0].value = Number(item.sensor_info.params.AE.harmonic2).toFixed(2);//频率分量2
                    }
                    else{
                        This.activeTab[idx] =  'prps'
                        data = JSON.parse(JSON.stringify(require('@/util/js/data/prps.js').data));
                        actualType = 'prps3d';
                        var  _data = item.sensor_info.params.UHF.prps;
                        var  temp = data.chartBody.series[0].dataList
                        for(var i=0;i<_data.length;i++){
                            temp[i][2] = _data[i];
                        }
                    }
                    pdcharts.draw(document.getElementById(item.point_id), {
                        width: '350px',
                        height: '350px',
                        type: pdcharts.chartType[actualType],
                        // type:14,
                        data: data.chartBody,
                        background: "#100C2A"
                    });
               })           
           }
       }
   }
</script>

<style lang="less" scoped>
/deep/.el-dialog{
    margin-top: 0 !important;
}
.chart-3d{
   height: 500px;margin-top: 30px !important;position: relative !important;
   border:solid 2px #0070C0;
}
/deep/.chart-3d>div{
    width:100% !important;height:100% !important
}
 /deep/.el-dialog__header{
    padding: 8px 0;
       background: #141E38;
       border:none;
       .el-dialog__headerbtn{
           top: 0px;right:0;
       }
       .el-dialog__headerbtn .el-dialog__close{
           color:#fff;
       }
 }
/deep/.el-dialog__body{
    padding:0;
    background: #2C2E30;
    color:#fff;
    box-sizing: border-box;
}
.basic-info{
    padding:0 20px;
    width:350px;
    p{
        height:30px;line-height: 30px;;
    }
}
.basic-box{
    border:solid 1px #ccc;
}
/deep/.el-tabs--border-card{
    background:transparent;
}
/deep/.chart-tabs .el-tabs__content{
    // height:350px;
    padding:0;
}
/deep/.el-tabs__header{
    margin:0;
    background: transparent !important;
    .el-tabs__nav-wrap::after{
        height: 0;;
    }
    .el-tabs__item{
        border-radius: 6px;
        // background: #D7D7D7;
    }
    .el-tabs__item.is-active{
        background: #D7D7D7;
    }
}
</style>

