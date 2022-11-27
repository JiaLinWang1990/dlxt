<template>
   <div v-if="dialogVisible">
       <el-dialog :visible.sync="dialogVisible" :width="dialogWidth" :showClose="showClo" :close-on-click-modal="false">
           <!-- <div class="refresh" style="width:25px;height:25px;cursor:pointer;margin-left:5px;display:inline-block" @click="dialogVisible=false">
               <i class="el-icon-refresh-left" style="font-size:25px;font-weight:bold;color:#CA5051;"></i>
           </div> -->
           <div style="width:100%;height:25px;cursor:pointer;">
                <i class="el-icon-caret-right" style="font-size:25px;color:#CA5051;float:left" @click="reset"></i>
               <i class="el-icon-error" style="font-size:25px;color:#CA5051;float:right" @click="dialogVisible=false"></i>
           </div>
            <div style="display:flex;flex-wrap: wrap;flex: 0 0 33%;justify-content: start;">
                <div class="body-content" v-for="(item,idx) in queryDetails" :key="idx">
                    <div class="basic-box">
                        <el-row class="basic-info">
                            <el-col :span="12">
                                <p>测点名称 : {{queryDetails[idx].data.point_name}}</p>
                                <p>传感器类型 : {{queryDetails[idx].data.sensor_type}}</p>
                                                        
                            </el-col>
                            <el-col :span="12">
                                <p>设备名称 : {{queryDetails[idx].data.device_name}}</p> 
                            </el-col>
                        </el-row>
                        <el-row class="basic-info">
                            <el-col :span="24">
                                <!-- <p>采样时间 : {{JSON.stringify(clickData) != "{}"?item.sensor_info.create_time.substring(0,item.sensor_info.create_time.length-7):(item.sensor_info.update_time?item.sensor_info.update_time.substring(0,item.sensor_info.update_time.length-7):'')}}</p>   -->
                                <p>采样时间 : {{queryDetails[idx].data.update_date}}</p>
                            </el-col>
                            <el-col :span="24">
                                <p>诊断结果 : 正常</p>  
                            </el-col>
                        </el-row> 
                    </div>
                    <el-tabs  type="border-card" v-model="activeTab1" @tab-click="handleClick" class="chart-tabs" v-if="item.data.sensor_type=='UHF'">
                        <el-tab-pane label="特征图谱" name="common" disabled>                            
                        </el-tab-pane>
                        <el-tab-pane label="PRPS" name="prps">
                        </el-tab-pane>
                        <el-tab-pane label="PRPD" name="prpd" disabled>                            
                        </el-tab-pane>
                    </el-tabs>
                     <el-tabs  type="border-card" v-model="activeTab2" @tab-click="handleClick" class="chart-tabs"  v-if="item.data.sensor_type!=='UHF'">
                        <el-tab-pane label="特征图谱" name="common">                            
                        </el-tab-pane>                       
                    </el-tabs>
                    <div :id="item.data.point_id" class="chart-3d"></div> 
                               
                </div> 
                 
            </div>
                    
        </el-dialog>
   </div>
</template>

<script>
    import * as pdcharts  from '@/util/js/index.js'
    import * as device from '@/data/device.js'
    export default {
       name:'',
        props:{
           visible:{
               type:Boolean,
               default:false
           },
           dataDetails:{
               type:Array,
               default:()=>[]
           },
           clickData:{
               type:Object,
               default:()=>{}
           },
       },
       data(){
            return {
                dialogWidth:0,
                activeTab:['common'],
                activeTab1:'prps',
                activeTab2:'common',
                showClo:false,
                DataDetails: [],//区别于直接传过来的值，该值表示趋势详情的数组
                queryDetails: [],   //查询详情接口返回值的集合
                tempArr:[],//临时数组
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
           //this.DataDetails = this.dataDetails
        //    this.getSensorDetails();
          
           if(this.clickData){
               this.getTrendDetail();
           }
           this.getAllDetails();
           
            window.onresize = () => {
                return (() => {
                    this.setDialogWidth()
                })()
            }
       },

        methods: {
            getAllDetails() {
                let This = this;
                this.dataDetails.forEach((item, i) => {
                    this.tempArr[i]= device.sensorDetails({sensor_data_id:item.sensor_data_id,sensor_type:item.sensor_type})
                    // this.queryDetails.push(this.getSensorDetails(item));            
                })
                Promise.all([...this.tempArr]).then(res => {
                    This.queryDetails = res 
                    this.$nextTick(() => {               
                        if(this.dataDetails.length>6){
                            this.DataDetails =this.DataDetails.slice(0,6);
                            this.$message('最多同时展示六个');
                        }
                        this.initChart(This.queryDetails);
                    })                
                })
        },
            reset(){
                this.getAllDetails();
            },
            getSensorDetails(item) { 
                console.log(this.dataDetails);
                device.sensorDetails({sensor_data_id:item.sensor_data_id,sensor_type:item.sensor_type}).then(res => {
                    console.log(res);
                    this.DataDetails.push(res.data)
                })
            },
            getTrendDetail(){
                device.queryTrendDetail(this.clickData).then(res=>{
                    console.log(res,'结果');
                    this.DataDetails = res.data//[This[chart]._data]
                })
            },
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
            initChart(res){
                let This = this;               
                res.forEach((item,idx)=>{
                    //    let item = this.dataDetails[i];
                    item = item.data;
                    if(JSON.stringify(item.sensor_info)=='{}'){
                        throw Error();
                    }
                    let data ; 
                    This.activeTab[idx] = 'common'
                    let actualType = item.sensor_type.toLowerCase()             
                    if(item.sensor_type=='TEMP'){
                        data = JSON.parse(JSON.stringify(require('@/util/js/data/temperature.js').data));
                        actualType = 'temperature'
                        data.chartBody.series[0].dataList = Number(item.T);
                    }else if(item.sensor_type=='TEV'){
                        data = JSON.parse(JSON.stringify(require('@/util/js/data/tev.js').data));
                            data.chartBody.axisInfo.value = item.amp;
                    }else if(item.sensor_type=='AE'){
                        data = JSON.parse(JSON.stringify(require('@/util/js/data/ae.js').data));
                        let maxvalue = item.maxvalue;
                        data.chartBody.series[0].dataList[0].value = Number(maxvalue).toFixed(2);//最大放电幅值
                        data.chartBody.series[1].dataList[0].value = Number(item.rmsvalue).toFixed(2);//有效放电幅值
                        data.chartBody.series[2].dataList[0].value = Number(item.harmonic1).toFixed(2);//频率分量1
                        data.chartBody.series[3].dataList[0].value = Number(item.harmonic2).toFixed(2);//频率分量2
                    }
                    else if(item.sensor_type=='UHF'){
                        This.activeTab[idx] =  'prps'
                        data = JSON.parse(JSON.stringify(require('@/util/js/data/prps.js').data));
                        data.chartBody.axisInfo.zMaxValue = "最大放电幅值："+item.ampmax+'dBm'
                        actualType = 'prps3d';
                        var  _data = item.prps;
                        var  temp = data.chartBody.series[0].dataList
                        for(var i=0;i<_data.length;i++){
                            temp[i][2] = _data[i];
                        }
                    }else{
                        return;
                    }
                    
                    pdcharts.draw(document.getElementById(item.point_id), {
                        width: '352px',
                        height: '352px',
                        type: pdcharts.chartType[actualType],
                        // type:14,
                        data: data.chartBody,
                        background: "#141414",
                        //  autoCycle:true
                    });
                })           
            }
        }
   }
</script>

<style lang="less" scoped>
/deep/.el-dialog{
    // margin-top: 0 !important;
}
.chart-3d{
   height: 346px;position: relative !important;
   border:solid 1px #DCDFE6;bottom:0 !important;
   border-top: 0;;
}
/deep/.chart-3d>div{
    width:100% !important;height:100% !important
}
 /deep/.el-dialog__header{
    padding: 0;
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
    border-width:0 1px;
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
/deep/.chart-tabs .el-tabs__item{
    height:32px;line-height: 32px;;
}
/deep/.chart-tabs .el-tabs__item.is-active{
    color:#000;
}
.refresh{
    transition:transform;
    animation: rotate 3s linear infinite;
}
@keyframes rotate{from{transform: rotate(0deg)}
    to{transform: rotate(359deg)}
}
</style>

