<template>
   <div>
       <el-dialog :visible.sync="dialogVisible" :showClose="showClo"  width="80%" :close-on-click-modal="false">
           <div style="width:25px;height:25px;cursor:pointer;padding-left:calc(100% - 30px)">
               <i class="el-icon-error" style="font-size:25px;color:#CA5051;" @click="dialogVisible=false"></i>
           </div>
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
            <chartDetails  :visible.sync="showChartDetails" :dataDetails="dataDetails" :clickData="clickData"></chartDetails>
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
           },
           selectData:{
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
               showClo:false,
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
                        bottom: '18%',
                        top:'13%',
                        containLabel: true
                    },
                    dataZoom: [
                       {
                            // type: 'inside',
                            // start: 0,
                        },
                        {
                            type: 'inside',
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        // axisLabel:{
                        //     color:'#ccc',
                        //     interval:50,
                        //     formatter:function(val){
                        //         return val.substring(0,16)
                        //     }
                        // },                                           
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
                           {name: '',type: 'line', symbol:'true',data:[]},                                      
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
                        bottom: '18%',
                        top:'13%',
                        containLabel: true
                    },
                    dataZoom: [
                       {
                            // type: 'inside',
                            // start: 0,
                        },
                        {
                            type: 'inside',
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        // axisLabel:{
                        //     color:'#ccc',
                        //     interval:5,
                        //     formatter:function(val){
                        //         return val.substring(0,16)
                        //     }
                        // },                                           
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
                        bottom: '18%',
                        top:'13%',
                        containLabel: true
                    },
                    dataZoom: [
                       {
                            // type: 'inside',
                            // start: 0,
                        },
                        {
                            type: 'inside',
                        }
                    ],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        // axisLabel:{
                        //     color:'#ccc',
                        //     interval:5,
                        //     formatter:function(val){
                        //         return val.substring(0,16)
                        //     }
                        // },                                           
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
                currentSelectData:[],
                clickData:{}
           }
       },
       mounted(){
           let This = this;
           this.currentSelectData = this.selectData
           this.checkedCities = this.getSelectedChecked()
           if(this.checkedCities.length>3){
                this.$message('最多同时展示三个图表');
                this.checkedCities = this.checkedCities.slice(0,3)               
            }      
            this.queryPointTrend();      
           this.$nextTick(()=>{
                // this.$refs.state.style.height = this.checkedCities.length==1?'100%':(this.checkedCities.length==2?'50%':'33.33%')              
               this.initCharts();              
           })
           
       },
       methods: {
           bindClick(chart){
               let This = this;
               this[chart].on('click',(params)=> {
                    // 参数 params
                    console.log(this.checkedCities,params.name,This.selectData,'选中值');
                    // device.queryTrendDetail({
                    //     point_ids:this.checkedCities,
                    //     start_date:params.name
                    // }).then(res=>{
                    //     console.log(res,'结果');
                    //     This.showChartDetails = true;
                    //     This.dataDetails = res.data//[This[chart]._data]
                    // })
                    This.showChartDetails = true;
                    This.dataDetails = This.selectData//[This[chart]._data]
                    This.clickData = {
                        point_ids:this.checkedCities,
                        start_date:params.name
                    }
                });
           },
           getSelectedChecked(){
               let arr = [];
               this.selectData.forEach(item=>{
                   arr.push(item.point_id)
                })
                return arr;
           },
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
                this.clearCharts()
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
           clearCharts(){
                this.myChart0&&this.myChart0.clear();
                this.myChart1&&this.myChart1.clear();
                this.myChart2&&this.myChart2.clear();
           },
           handleChecked(val){
               if(val.length>3){
                   this.$message('最多同时展示三个图表');
                   return;
               }
               this.getSelectTableData(val)
               this.queryPointTrend();
           },
           getSelectTableData(val){
              this.currentSelectData = this.tableData.filter(item=>val.indexOf(item.point_id)!=-1)
           },
           handleChecked1(val){

           },
           redrawCharts(arr){
            //    this.chartsOption0.xAxis.data.splice(0,this.chartsOption0.xAxis.data.length);
            //    this.chartsOption0.series.splice(0,this.chartsOption0.series.length)
                let templateObj = {name: '',type: 'line',stack: 'Total', symbol:'true',data:[]};
                                
                let currentIndex;
                let currentChartData = [];
                arr.forEach((obj,index)=>{
                    let xAxisData = [];
                    currentIndex = index;
                    let name = ''
                    let tempData = [{name: 'Temp',type: 'line', symbol:'true',data:[]}];
                    let aeData = [
                        {name: '最大放电幅值',type: 'line', symbol:'true',data:[]},
                        {name: '有效放电幅值',type: 'line', symbol:'true',data:[]},
                        {name: '频率分量1',type: 'line', symbol:'true',data:[]},
                        {name: '频率分量2',type: 'line', symbol:'true',data:[]}
                    ]
                    let tevData =[{name: 'TEV',type: 'line', symbol:'true',data:[]}]
                    let uhfData =[
                        {name: '最大放电幅值',type: 'line', symbol:'true',data:[]},
                        {name: '平均放电幅值',type: 'line', symbol:'true',data:[]}, 
                    ];
                    obj.point_data.forEach((item,idx)=>{
                        xAxisData.push(item.create_time.substring(0,item.create_time.length-7));
                        if(item.sensor_type=='Temp'){
                            currentChartData = tempData
                            currentChartData[0].data.push(item.T)
                        }else if(item.sensor_type=='AE'){
                            currentChartData = aeData
                            currentChartData[0].data.push(item.maxvalue)
                            currentChartData[1].data.push(item.rmsvalue)
                            currentChartData[2].data.push(item.harmonic1)
                            currentChartData[3].data.push(item.harmonic2) 
                        }else if(item.sensor_type == 'TEV'){
                            currentChartData = tevData
                            currentChartData[0].data.push(item.amp)
                        }else if(item.sensor_type == 'UHF'){
                            currentChartData = uhfData
                            currentChartData[0].data.push(item.ampmax)
                            currentChartData[1].data.push(Number(item.ampmean).toFixed(2))
                        }
                    })
                    this['chartsOption'+currentIndex].xAxis.data =xAxisData;
                    this['chartsOption'+currentIndex].series = currentChartData
                    this.initCharts(currentIndex);
                })                         
           },
           initCharts(index){
               
               if(index==undefined)return;
                this['myChart'+index] = echarts.init(this.$refs['state'+index]);
                this['myChart'+index]._data = this.currentSelectData[index]
                 this['myChart'+index].resize();
                 this.bindClick('myChart'+index)
               this['myChart'+index].setOption(this['chartsOption'+index],true);               
           },
           clearAllCharts(){

           }
           
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
           i{

           }
       }
       .el-dialog__headerbtn .el-dialog__close{
           color:#fff;
       }
    }
    /deep/.el-dialog__body{
        padding:0;
        background: #141E38;
    }
    .body-content{
        display: flex;height:750px;padding:10px 8px;
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
    /deep/.el-date-editor--daterange{width:250px !important;margin-top:10px;
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
