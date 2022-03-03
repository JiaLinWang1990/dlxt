<template>
   <div>
       <el-dialog :visible.sync="dialogVisible"  width="80%" >
            <div class="body-content">
                <div class="select-box">
                    <div class="time-box">
                        <div class="box-title">时间</div>
                        <el-radio-group v-model="timeSelect" @change="handleTimeSelect">
                            <el-radio :label="1">最近一天</el-radio>
                            <el-radio :label="2">最近一周</el-radio>
                            <el-radio :label="3">最近一月</el-radio>
                            <el-radio :label="4">最近一年</el-radio>
                            <el-radio :label="5">选择范围</el-radio>
                            <el-date-picker  v-model="dataRange"     
                                @change="selectDate"                        
                                type="daterange" 
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-radio-group>
                    </div>
                    <div class="point-box">
                        <div class="box-title">测点</div>
                        <div>                            
                            <el-checkbox-group v-model="checkedCities" @change="handleChecked">  
                                <div  v-for="(point,i) in tableData" :key="point.id" class="point-line">
                                    <div class="point-color"><span :style="{background:color[i]}" class="line-color"></span></div>
                                    <el-checkbox :label="point.point_id"> {{point.point_name}} </el-checkbox>
                                </div>                                                                      
                            </el-checkbox-group>                                
                        </div>
                    </div>
                    <div class="param-box">
                        <div class="box-title">参数</div>
                        <el-checkbox-group v-model="checkedCities" @change="handleChecked1">  
                            <el-checkbox v-for="param in params" :key="param.id">{{param.label}}</el-checkbox>                                                                                              
                        </el-checkbox-group>  
                    </div>
                </div>
                <div class="chart-box">
                    <div style="height:33.33%;"  ref="state0"></div>
                    <div style="height:33.33%;"  ref="state1"></div>
                    <div style="height:33.33%;"  ref="state2"></div>
                </div>
            </div>            
        </el-dialog>
        <div  v-if="showChartDetails" >
            <chartDetails  :visible.sync="showChartDetails" :dataDetails="dataDetails"></chartDetails>
        </div> 
   </div>
</template>

<script>
import * as echarts from 'echarts';
import * as device from '@/data/device.js'
   export default {
       name:'',
       components:{
        chartDetails:resolve => {require(['./chartDetails.vue'], resolve)},
    },
       props:{
           visible:{
               type:Boolean,
               default:false
           },
           tableData:{
                type:Array,
                default:()=>[]
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
       data(){
           let This = this;
           return {
               myChart0:null,
               myChart1:null,
               myChart2:null,
               title:'图谱详情',
               dataRange:[],
               timeSelect:1,
               checkedCities:[],
               color:['#D9001B','#F59A23','#FFFF00','#95F204','#00FFFF','#0000FF','8400FF', '#6D000E','#7B4D12','#808000','#4B7902', '#00BFBF','#000080','#420080','#000000','#555555', '#AAAAAA','#F2F2F2','#FFFFFF','#C280FF'],
               params:[
                   {id:1,label:'最大放电峰值'},
                   {id:5,label:'频率分量1'},
                   {id:2,label:'平均放电幅值'},
                   {id:6,label:'频率分量1'},
                   {id:3,label:'放电次数'},
                   {id:7,label:'温度值'},
                   {id:4,label:'有效放电幅值'},
               ],
               nowDate:new Date(),
               timeVal:{
                   start_date:This.formatDate(new Date(new Date().getTime() - 24*60*60*1000)),
                   end_date:This.formatDate(new Date()),
               },
               timeArr:[],
               chartsOption0:{
                    title: {
                        text: '趋势分析',
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        confine: true
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        top:'10%',
                        containLabel: true
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            start: 0,
                            end: 100
                        },
                        {
                            start: 0,
                            end: 20
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLabel:{
                            color:'#ccc',
                            interval:5,
                            formatter:function(val){
                                return val.substring(0,16)
                            }
                        },                                           
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel:{
                            color:'#ccc'
                        },  
                         splitLine: {  
                            show:true,   //X网格线
                            lineStyle:{   //x网格线
                                color: '#27243C'
                            }
                        }                         
                    },
                    series: [
                           {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]},                                      
                    ]
                },
                chartsOption1:{
                    title: {
                        text: '趋势分析',
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        confine: true
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        top:'10%',
                        containLabel: true
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            start: 0,
                            end: 100
                        },
                        {
                            start: 0,
                            end: 20
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLabel:{
                            color:'#ccc',
                            interval:5,
                            formatter:function(val){
                                return val.substring(0,16)
                            }
                        },                                           
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel:{
                            color:'#ccc'
                        },  
                         splitLine: {  
                            show:true,   //X网格线
                            lineStyle:{   //x网格线
                                color: '#27243C'
                            }
                        }                         
                    },
                    series: [
                           {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]},                                      
                    ]
                },
                chartsOption2:{
                    title: {
                        text: '趋势分析',
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        confine: true
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        top:'10%',
                        containLabel: true
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            start: 0,
                            end: 100
                        },
                        {
                            start: 0,
                            end: 20
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLabel:{
                            color:'#ccc',
                            interval:5,
                            formatter:function(val){
                                return val.substring(0,16)
                            }
                        },                                           
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel:{
                            color:'#ccc'
                        },  
                         splitLine: {  
                            show:true,   //X网格线
                            lineStyle:{   //x网格线
                                color: '#27243C'
                            }
                        }                         
                    },
                    series: [
                           {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]},                                      
                    ]
                },
                showChartDetails:false,
                dataDetails:[],
           }
       },
       mounted(){
           let This = this;
           this.$nextTick(()=>{
                // this.$refs.state.style.height = this.checkedCities.length==1?'100%':(this.checkedCities.length==2?'50%':'33.33%')              
               this.initCharts();
            //    this.myChart&&this.myChart.on('click', function (params) {
            //         // 参数 params
            //         console.log(params);
            //         if (params.componentType === 'series') {
            //                 This.showChartDetails = true;
            //                 This.dataDetails  =This.filterArr(This.tableData,This.checkedCities)
            //             // 点击到了 series 上
            //         }

            //     });
           })
           
       },
       methods: {
           filterArr(arrA,arrB){//从A数组中找到B数组中有的值
                let resultArr = [];
                for(var i=0;i<arrB.length;i++){
                    let result = arrA.find(item=>{
                        return arrB[i] == item.point_id
                    });
                    if(result){
                        resultArr.push(result)
                    }
                }            
                return resultArr;
           },
           selectDate(){
               this.timeSelect = 5;
                this.timeVal.start_date = this.formatDate(this.dataRange[0])
                this.timeVal.end_date = this.formatDate(this.dataRange[1]);
                 this.queryPointTrend();
           },
           queryPointTrend(){
               if(!this.checkedCities.length) return;
               let params = Object.assign(this.timeVal,{point_ids:this.checkedCities})
               device.queryPointTrend(params).then(res=>{
                   this.redrawCharts(res.data)
               })
           },
           handleTimeSelect(val){
                this.timeVal.end_date = this.formatDate(this.nowDate);
                if(val==1){
                    let temp = new Date(this.nowDate.getTime() - 24*60*60*1000)
                    this.timeArr = this.createTimeArr(this.nowDate.getTime() - 24*60*60*1000);
                    this.timeVal.start_date = this.formatDate(temp);                   
                }else if(val==2){
                    let temp = new Date(this.nowDate.getTime() - 7*24*60*60*1000)
                    this.timeArr = this.createTimeArr(this.nowDate.getTime() - 7*24*60*60*1000);
                    this.timeVal.start_date = this.formatDate(temp);
                }else if(val==3){
                    let temp = new Date(this.nowDate.getTime() - 30*24*60*60*1000)
                    this.timeArr = this.createTimeArr(this.nowDate.getTime() - 30*24*60*60*1000);
                    this.timeVal.start_date = this.formatDate(temp);
                }else if(val==4){
                    let temp = new Date(this.nowDate.getTime() - 365*24*60*60*1000)
                    this.timeVal.start_date = this.formatDate(temp);
                }else{

                }
                this.queryPointTrend();
           },
           createTimeArr(val){
               let timeArr = [];
               for(var i=val;i<this.nowDate.getTime();){
                   timeArr.push(this.formatDate(new Date(val)))
                   i+=60000;
               }
               return timeArr
           },
           formatDate(date){
            //    if(!data) return;
               return date.getFullYear()+'-'+this.timeFormat(date.getMonth()+1)+'-'+this.timeFormat(date.getDate())+' '+this.timeFormat(date.getHours())+':'+this.timeFormat(date.getMinutes())+':'+this.timeFormat(date.getSeconds());
           },
           timeFormat(v){
               return v<10?'0'+v:v
           },
           handleChecked(val){
               if(val.length>3){
                   this.$message('最多同时展示三个图表');
                   return;
               }
               this.queryPointTrend();
           },
           handleChecked1(val){

           },
           redrawCharts(arr){
            //    this.chartsOption0.xAxis.data.splice(0,this.chartsOption0.xAxis.data.length);
            //    this.chartsOption0.series.splice(0,this.chartsOption0.series.length)
                let templateObj = {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]};
                let chartData = [templateObj];
                let chartData1 = [
                    {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]},
                    {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]},
                    {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]},
                    {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]}
                ]
                let chartData2 =[templateObj]
                let chartData3 =[
                    {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]},
                    {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]}
                ];
                let c = false
                let c1 = false
                let c2 = false
                let c3 = false
                let xAxisData = [];

                let currentIndex;
                let currentChartData = [];
                arr.forEach((obj,index)=>{
                    currentIndex = index;
                    let name = ''
                    obj.point_data.forEach((item,idx)=>{
                        xAxisData.push(item.create_time.substring(0,item.create_time.length-7));
                        if(item.sensor_type=='Temp'){
                            c=true;   
                            currentChartData = chartData                      
                            chartData[0].name = 'Temp'
                            chartData[0].data.push(item.T)
                        }else if(item.sensor_type=='AE'){
                            c1=true;
                            currentChartData = chartData1
                            chartData1[0].name =  '最大放电幅值'
                            chartData1[0].data.push(item.maxvalue)
                            chartData1[1].name =  '有效放电幅值';
                            chartData1[1].data.push(item.rmsvalue)
                            chartData1[2].name = '频率分量1'
                            chartData1[2].data.push(item.harmonic1)
                            chartData1[3].name =  '频率分量2'
                            chartData1[3].data.push(item.harmonic2) 
                        }else if(item.sensor_type == 'TEV'){
                            c2=true;
                            currentChartData = chartData2
                            chartData2[0].name = 'TEV'
                            chartData2[0].data.push(item.amp)
                        }else if(item.sensor_type == 'UHF'){
                            c3=true;
                            currentChartData = chartData3
                            chartData3[0].name = '最大放电幅值'
                            chartData3[0].data.push(item.ampmax)

                            chartData3[1].name = '平均放电幅值'
                            chartData3[1].data.push(Number(item.ampmean).toFixed(2))
                        }
                    })
                })
               
                // this.chartsOption.xAxis.data =this.timeArr // xAxisData;
                this['chartsOption'+currentIndex].xAxis.data =xAxisData;
                this['chartsOption'+currentIndex].series = currentChartData//[].concat(c?chartData:[],c1?chartData1:[],c2?chartData2:[],c3?chartData3:[]);
                
                
                // this.chartsOption.series[0].data = new Array(this.timeArr.length).fill(0);
                // for(var i=0;i<this.timeArr.length;i++){
                //     for(var j=0;j<xAxisData.length;j++){
                //         if(xAxisData[j] == this.timeArr[i]){
                //              this.chartsOption.series[0].data[i] = chartData[j];
                //         }
                //     }
                // }
                this.initCharts(currentIndex);
           },
           initCharts(index){
               if(index==undefined)return;
                this['myChart'+index] = echarts.init(this.$refs['state'+index]);
               this['myChart'+index].setOption(this['chartsOption'+index]);
                //  this.myChart1 = echarts.init(this.$refs.state1);
                // this.myChart1.setOption(this.chartsOption1);
                //  this.myChart2 = echarts.init(this.$refs.state2);
                // this.myChart2.setOption(this.chartsOption2);
           },
           clearAllCharts(){

           }
           
       }
   }
</script>

<style lang='less' scoped>
    /deep/.el-dialog__header{
       padding: 8px 0;
       background: #141E38;
       border:none;
       .el-dialog__headerbtn{
           top: 3px;
           i{

           }
       }
       .el-dialog__headerbtn .el-dialog__close{
           color:#fff;
       }
    }
    /deep/.el-dialog__body{
        padding:0;
    }
    .body-content{
        display: flex;height:750px;background: #141E38;padding:10px 8px;
    }
    .select-box{
        width:330px;color:#fff;     
    }
    .time-box,.point-box,.param-box{
         background: #1A284A;border-radius: 3px;border:solid 1px #fff;padding:10px;
    }
    .time-box{
        height:210px;
    }
    .point-box{height:340px;margin-top: 15px}
    .param-box{height:150px;margin-top: 15px}
    .chart-box{margin-left:10px;width:calc(100% - 340px);height:100%;
        border: solid 1px #fff;background: #100B2B
    }
    /deep/.el-radio{display:block;margin-top:10px;color:#fff;}
    /deep/.el-date-editor--daterange{width:250px;margin-top:10px;
        .el-range-separator{line-height: 24px;}
        .el-range__icon{line-height: 24px;}
    }
    .box-title{font-size: 16px;}
    .line-color{
        display:inline-block;width:25px;height:4px;border-radius: 2px;margin-right:10px;
    }
    /deep/.point-box .el-checkbox{color:#fff;margin-left:35px;}
    .point-line{
        padding:5px 0;position: relative;;
    }
    .point-color{
        display:inline-block;position:absolute;top: 11px;
    }
    .param-box .el-checkbox{
        width:calc(50% - 10px);margin-right:10px;padding:4px 0;color:#fff;
    }
    .param-box .el-checkbox:nth-child(odd){
        border-right:solid 1px #fff;
    }
    .chart-box{
        padding:15px;
    }
</style>
