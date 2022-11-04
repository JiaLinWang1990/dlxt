<template>
   <div style="height:100%" :gutter="20">
        <el-row style="height:100%;">
            <el-col class="grid-content" :span="6">
                <div class="bg-purple content-box">
                    <div ref="property" id="property" class="property"></div>
                    <div ref="state" id="state" class="state"></div>
                    <div ref="unusual" id="unusual" class="unusual"></div>
                </div>
            </el-col>
            <el-col class="grid-content content-box" :span="12">
                <div class="content-box">
                    <div style="height: calc(100% - 170px);">
                        <div class="map-tree">
                            <tree :type="'site'" :data="treeData" @clickNode="clickNode" ref="trees" v-if="treeData.length"></tree>
                        </div>
                        <amap class="map"></amap>
                    </div>                    
                    <!-- <div  ref="map" class="map"></div> -->
                    <div class="notify">
                        <div class="notify-title">最新异常通知</div>
                        <div class="notify-table">
                            <el-table :data="tableData" style="width: 100%">
                                <el-table-column prop="create_date" label="报警时间" width="140"></el-table-column>
                                <el-table-column prop="equipment_name" width="170" label="设备名称"></el-table-column>
                                <el-table-column prop="site_name" label="站点名称"></el-table-column>
                                <!--<el-table-column prop="pointName" label="测点名称"></el-table-column>-->
                                <el-table-column prop="sensor_type" width="110" label="传感器类型"></el-table-column>
                                <el-table-column prop="alarm_level" label="报警状态"></el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col class="grid-content content-box" :span="6">
                <div class="content-box">
                    <div ref="point" class="point"></div>
                    <div ref="online" class="online"></div>
                    <div ref="unusual-deal" class="unusual-deal">
                        <div class="notify-title">异常情况处理统计</div>
                        <div class="deal-box">
                            <div class="deal-describ">
                                <span><i class="el-icon-message-solid"></i></span>
                                <p>处理数/异常数</p>
                                <p>累计总数</p>
                            </div>
                            <div class="deal-num">
                                <table style="width:80%;margin-top:20px;">
                                    <tr>
                                        <td>本日</td>
                                        <td>本周</td>
                                        <td>本月</td>
                                    </tr>
                                     <tr>
                                        <td>{{countAbnormal.dayProcessedNum+' / '+countAbnormal.dayAlarmNum}}</td>
                                        <td>{{countAbnormal.weekProcessedNum+' / '+countAbnormal.weekAlarmNum}}</td>
                                        <td>{{countAbnormal.monthProcessedNum+' / '+countAbnormal.monthAlarmNum}}</td>
                                    </tr>
                                     <tr style="text-align:center;">
                                        <td colspan="3">{{countAbnormal.sumProcessedNum+' / '+countAbnormal.sumAlarmNum}}</td>                                        
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
   </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap'
import  amap  from './map.vue';
 import tree from '@/components/tree.vue'
import * as device from '@/data/device.js'
import * as map from '@/data/map.js'
   export default {
       name:'',
       components:{amap,tree},
       data(){
           return {
               myChart:null,
               tableData: [],
                treeData:[],
                customerInfos:{},
                abnormalInfos:{},
                countAbnormal:{}
           }
       },
       mounted(){
            // this.initCharts();
            this.$nextTick(()=>{
                this.getTreeData();
            })
           
            window.onresize = ()=>{
                this.initCharts();
            }
       },

       methods: {
            getTreeData(){
                let This = this;
                device.queryTrees().then(res=>{
                    if(!res) return;
                    This.treeData = res.data;
                    res.data.length && res.data[0] && This.clickNode(res.data[0])
                })
            },
           clickNode(v) { 
               if (v.type == "customer") {
                   this.customerStatus(v.id)
                   map.abnormalRatio({customer_id:v.id}).then(res => { 
                    console.log(res,'公司异常电力设备异常趋势率');
                    this.abnormalInfos = res.data;
                    this.initCharts3();
                   })
                   map.customerLatestAlarms({customer_id:v.id}).then(res => { 
                    this.tableData = res.data;
                    console.log(res,'公司最新三条');
                   }) 
                   map.customerAbnormal({customer_id:v.id}).then(res => { 
                    let tmp = res.data
                    this.countAbnormal = {
                        dayProcessedNum:tmp.customer_day_abnormal_info.processed_num,
                        dayAlarmNum:tmp.customer_day_abnormal_info.alarm_num,
                        weekProcessedNum:tmp.customer_week_abnormal_info.processed_num,
                        weekAlarmNum:tmp.customer_week_abnormal_info.alarm_num,
                        monthProcessedNum:tmp.customer_month_abnormal_info.processed_num,
                        monthAlarmNum:tmp.customer_month_abnormal_info.alarm_num,
                        sumProcessedNum:tmp.customer_month_abnormal_info.processed_num+tmp.customer_week_abnormal_info.processed_num+tmp.customer_day_abnormal_info.processed_num,
                        sumAlarmNum:tmp.customer_month_abnormal_info.alarm_num+tmp.customer_week_abnormal_info.alarm_num+tmp.customer_day_abnormal_info.alarm_num
                    };
                    console.log(res,'公司异常情况处理统计');
                   })
                }else if (v.type == "site") {
                   this.siteStatus(v.id)
                   map.siteLatestAlarms({site_id:v.id}).then(res => { 
                    this.tableData = res.data;
                    console.log(res,'站点最新三条');
                   }) 
                   map.siteAbnormal({site_id:v.id}).then(res => { 
                    console.log(res,'站点异常情况处理统计');
                    let tmp = res.data
                    this.countAbnormal = {
                        dayProcessedNum:tmp.site_day_abnormal_info.processed_num,
                        dayAlarmNum:tmp.site_day_abnormal_info.alarm_num,
                        weekProcessedNum:tmp.site_week_abnormal_info.processed_num,
                        weekAlarmNum:tmp.site_week_abnormal_info.alarm_num,
                        monthProcessedNum:tmp.site_month_abnormal_info.processed_num,
                        monthAlarmNum:tmp.site_month_abnormal_info.alarm_num,
                        sumProcessedNum:tmp.site_month_abnormal_info.processed_num+tmp.site_week_abnormal_info.processed_num+tmp.site_day_abnormal_info.processed_num,
                        sumAlarmNum:tmp.site_month_abnormal_info.alarm_num+tmp.site_week_abnormal_info.alarm_num+tmp.site_day_abnormal_info.alarm_num
                    };
                    // this.initCharts5();
                   })
                    
                }  
           },
           customerStatus(id) { 
               map.companyStatus({ customer_id: id, data:{is_refresh: true} }).then(res => { 
                this.customerInfos = res.data;
                this.initCharts1();
                this.initCharts2();
                this.initCharts4();
               })
           },
           siteStatus(id) { 
               map.siteStatus({ site_id: id, data:{is_refresh: true} }).then(res => { 
               })
           },
           initCharts(){
                this.initCharts1();
                this.initCharts2();
                this.initCharts3();
                this.initCharts4();
                this.initCharts5();
                
           },
           initCharts1(){
               this.myChart = echarts.init(this.$refs.property);
               const gaugeData = [
                    {
                        value: this.customerInfos.asset_info.site_num,
                        name: '站点',
                        title: {
                            offsetCenter: ['-35%', '-15%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['-35%', '-35%']
                        }
                    },
                    {
                        value: this.customerInfos.asset_info.point_num,
                        name: '测点',
                        title: {
                            offsetCenter: ['-35%', '35%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['-35%', '15%']
                        }
                    },
                    {
                        value: this.customerInfos.asset_info.equipment_num,
                        name: '一次设备',
                        title: {
                            offsetCenter: ['35%', '-15%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['35%', '-35%']
                        }
                    },{
                        value: this.customerInfos.asset_info.sensor_num,
                        name: '传感器',
                        title: {
                            offsetCenter: ['35%', '35%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['35%', '15%']
                        }
                    }
                ];
               let option = {
                    title: {
                        text: '资产统计',
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    series: [
                        {
                            type: 'gauge',
                            radius:'100%',
                            startAngle: 90,
                            endAngle: -270,
                            pointer: {
                                show: false
                            },
                            progress: {
                                show: true,
                                overlap: false,
                                roundCap: true,
                                clip: false,
                                itemStyle: {
                                borderWidth: 0,
                                    borderColor: '#464646'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                width: 15,
                                color:[[1,'#36344D']]
                                }
                            },
                            splitLine: {
                                show: false,
                                distance: 0,
                                length: 10
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                show: false,
                                distance: 50
                            },
                            data: gaugeData,
                            title: {
                                fontSize: 12,
                                color:'#fff'
                            },
                            detail: {
                                width: 40,
                                height: 8,
                                fontSize: 12,
                                color: 'auto',
                                borderColor: 'auto',
                                borderRadius: 20,
                                borderWidth: 0.5,
                                formatter: '{value}'
                            }
                        }
                    ]
                };
                this.myChart.setOption(option);
           },
           initCharts2(){
                let statusList = this.customerInfos.equipment_status_info;
                let alarmList=[],normalList=[],warningList=[],sumList=[],siteNameList=[];
                statusList.forEach(item=>{
                    alarmList.push(item.alarm_num)
                    normalList.push(item.normal_num)
                    warningList.push(item.warning_num)
                    sumList.push(item.total)
                    siteNameList.push(item.site_name)
                })

               this.myChart = echarts.init(this.$refs.state);
                var option = {
                     title: {
                        text: '各站点状态统计',
                        textStyle:{
                            color:'#fff'
                        }
                    },
                      grid: {
                        left: '10%',
                        right: '5%',
                        bottom: '10%'
                    },
                    color: ['#5E90FF', '#98FFAE', '#F1E579', '#F06D77'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['测点总数', '正常', '预警', '告警'],
                        padding:[30,0,0,0],
                        textStyle:{
                            color:'#fff',
                        }
                    },                   
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {show: false},
                            data: siteNameList,
                            axisLabel:{
                                color:'#fff'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '测点总数',
                            type: 'bar',
                            barGap: 0,
                            data: sumList
                        },
                        {
                            name: '正常',
                            type: 'bar',
                            data: normalList
                        },
                        {
                            name: '预警',
                            type: 'bar',
                            data: warningList
                        },
                        {
                            name: '告警',
                            type: 'bar',
                            data: alarmList
                        }
                    ]
                    };
                this.myChart.setOption(option);
           },
           initCharts3(){
               var data=this.abnormalInfos;
               this.myChart = echarts.init(this.$refs.unusual);
                var option = {
                    title: {
                        text: '电力设备异常率趋势',
                         textStyle:{
                            color:'#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                     grid: {
                        left: '10%',
                        right: '30%',
                        bottom: '10%'
                    },
                    xAxis: {
                        data: data.map(function (item) {
                            return item[0];
                        }),
                        axisLabel:{
                            color:'#fff'
                        }
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        axisLabel:{
                            color:'#fff'
                        }
                    }, 
                    visualMap: {
                        top: 10,
                        right: 10,
                        textStyle:{
                            color:'#fff'
                        },
                        pieces: [{
                            gt: 0,
                            lte: 50,
                            color: '#096'
                        }, {
                            gt: 50,
                            lte: 100,
                            color: '#ffde33'
                        }, {
                            gt: 100,
                            lte: 150,
                            color: '#ff9933'
                        }, {
                            gt: 150,
                            lte: 200,
                            color: '#cc0033'
                        }, {
                            gt: 200,
                            lte: 300,
                            color: '#660099'
                        }, {
                            gt: 300,
                            color: '#7e0023'
                        }],
                        outOfRange: {
                            color: '#999'
                        }
                    },
                    series: {
                        type: 'line',
                        data: data.map(function (item) {
                            return item[1];
                        }),
                        markLine: {
                            silent: true,
                            data: [{
                                yAxis: 50
                            }, {
                                yAxis: 100
                            }, {
                                yAxis: 150
                            }, {
                                yAxis: 200
                            }, {
                                yAxis: 300
                            }]
                        }
                    }
                };
                this.myChart.setOption(option);
           },
           initCharts4(){
                let tmp = this.customerInfos.point_distribution_info;
                let obj = {};
                tmp.forEach(item=>{
                    obj[item.sensor_type] = [
                        { value: item.alarm_num+item.normal_num+item.warning_num, name: '总数' },
                        { value: item.normal_num, name: '正常' },
                        { value: item.warning_num, name: '预警' },
                        { value: item.alarm_num, name: '告警' },
                    ]
                })
                this.myChart = echarts.init(this.$refs.point);
                var option = {
                    title:[
                         {
                            text: '各监测类型测点状态分布',
                            left: 'center',
                            textStyle:{
                                color:'#fff'
                            }
                        },
                        {                       
                            text: '特高频传感器',
                            left:'18%',//居中显示
                            top:'45%',//底部显示
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                         {                       
                            text: '温度传感器',
                            left:'68%',//居中显示
                            top:'45%',//底部显示
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                        {                       
                            text: '电压传感器',
                            left:'18%',//居中显示
                            top:'90%',//底部显示
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                        {                       
                            text: '超声波传感器',
                            left:'68%',//居中显示
                            top:'90%',//底部显示
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                    ],
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                         textStyle:{
                            color:'#fff',
                        },
                        left: 'center',
                        top: 'bottom',
                        data: [
                        '总数',
                        '正常',
                        '预警',
                        '告警',
                        ]
                    },                
                    series: [
                        {
                            name: '特高频传感器',
                            type: 'pie',
                            radius: [10, 40],
                            center: ['25%', '25%'],
                            roseType: 'radius',
                            label: {
                                show: false
                            },
                            data: obj.UHF
                        },
                        {
                            name: '温度传感器',
                            type: 'pie',
                            radius: [10, 40],
                            center: ['75%', '25%'],
                            roseType: 'area',  
                            label: {
                                show: false
                            },                      
                            data: obj.TEMP
                        },
                         {
                            name: '电压传感器',
                            type: 'pie',
                            radius: [10, 40],
                            center: ['25%', '75%'],
                            roseType: 'area',    
                            label: {
                                show: false
                            },                      
                            data: obj.TEV
                        },
                         {
                            name: '超声波传感器',
                            type: 'pie',
                            radius: [10, 40],
                            center: ['75%', '75%'],
                            roseType: 'area',   
                            label: {
                                show: false
                            },                        
                            data:obj.AE
                        }
                    ]
                    };
                this.myChart.setOption(option);
           },
           initCharts5(){
                this.myChart = echarts.init(this.$refs.online);
                var base = +new Date(2021, 9, 3);
                var oneDay = 24 * 3600 * 1000;
                var date = [];

                var data = [Math.random() * 1];

                for (var i = 1; i < 2000; i++) {
                    var now = new Date(base += oneDay);
                    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
                    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
                }

                var option = {
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        }
                    },
                    title: {
                        left: 'center',
                        text: '传感器在线率',
                        textStyle:{
                            color:'#fff'
                        }
                    },                   
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: date
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, '100%']
                    },
                    
                    series: [
                        {
                            name: '模拟数据',
                            type: 'line',
                            smooth: true,
                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                color: 'rgb(255, 70, 131)'
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }])
                            },
                            data: data
                        }
                    ]
                };
                this.myChart.setOption(option);
           },
          
       }
   }
</script>

<style lang="less" scoped>
.grid-content{
    height:100%;display:flex;
     .content-box{
         height:100%;width:100%;
         display:flex;flex:1;flex-flow: column;position:relative;
         .map-tree{            
            position:absolute;max-height:calc(100% - 200px); 
            width:200px;top:10px;left:10px;background: #ccc;z-index: 1000;
            /deep/.el-tree{
                background:#2C2F32;color:#fff;
                overflow:hidden;white-space: nowrap;text-overflow: ellipsis;
                .span-ellipis{
                    overflow:hidden;white-space: nowrap;text-overflow: ellipsis;
                }
            }
         }
     }
    .property,.state,.unusual,.map,.notify,.point,.online,.unusual-deal{
       background:#17191A;margin:10px;
    }
    .property,.state,.unusual{
        height:33%;background:#17191A;margin:10px;
    }
    .map{height:100%;width: calc(100% - 20px);}
    .notify{height:170px;}
    .point{height:50%}
    .online{height:25%}
    .unusual-deal{height:25%}
    
    .notify-title{
        height:36px;line-height:36px;padding-left:20px;color:#fff;font-size: 14px;;
    }
    .notify-table{
        /deep/.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
            background:#2C2E30
        }
        width:calc(100% - 60px);
        margin:0 auto;height:calc(100% - 50px);
        .el-table{
            height:100%;background:#212325;
            border-color:#2C2E30;
            
        }
        /deep/.el-table th, /deep/.el-table tr,/deep/.el-table td{
            background:#212325;border-color:#2C2E30;
            padding:2px;color:#fff;text-align: center;font-size: 12px;;
        }
        /deep/.el-table th{
            background:#2C2E30
        }
    }
    .deal-box{
        display:flex;height:calc(100% - 36px);color:#fff;margin-top: 20px;
    }
    .deal-describ{
        width:40%;height:100%;text-align: center;
        span{
            display: block;height:60px;line-height:60px;;
        }
        p{
            height:36px;line-height: 36px;;
        }
    }
    .el-icon-message-solid{
        color:#72DBFF;font-size:46px;
    }
    .deal-num{
        width:60%;
        table td{
            width:33%;text-align: center;
            height:36px;
        }
    }
}

</style>
