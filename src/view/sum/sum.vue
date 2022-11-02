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
                                <el-table-column prop="date" label="报警时间" width="100"></el-table-column>
                                <el-table-column prop="deviceName" width="170" label="设备名称"></el-table-column>
                                <el-table-column prop="siteName" label="站点名称"></el-table-column>
                                <el-table-column prop="pointName" label="测点名称"></el-table-column>
                                <el-table-column prop="deviceType" width="110" label="传感器类型"></el-table-column>
                                <el-table-column prop="state" label="报警状态"></el-table-column>
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
                                        <td>0 / 4</td>
                                        <td>3 / 10</td>
                                        <td>12 / 24</td>
                                    </tr>
                                     <tr style="text-align:center;">
                                        <td colspan="3">14 / 38</td>                                        
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
               tableData: [{
                    date: '2021-10-02',
                    deviceName: '长沙出线间隔A相刀闸',
                    siteName:'站点1',
                    pointName: '测点1',
                    deviceType:'AE',
                    state:'告警'
                    }, {
                    date: '2021-10-04',
                    deviceName: '长沙出线间隔A相刀闸',
                    siteName:'站点1',
                    pointName: '测点1',
                    deviceType:'TEV',
                    state:'告警'
                    }, {
                    date: '2021-10-05',
                    deviceName: '长沙出线间隔A相刀闸',
                    siteName:'站点1',
                    pointName: '测点1',
                    deviceType:'UHF',
                    state:'预警'
                    }],
                treeData:[],
           }
       },
       mounted(){
            this.initCharts();
            this.getTreeData();
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
                })
            },
           clickNode(v) { 
               if (v.type == "customer") {
                   this.customerStatus(v.id)
                   map.abnormalRatio({customer_id:v.id}).then(res => { 
                    console.log(res,'公司异常电力设备异常趋势率');
                   })
                   map.customerAbnormal({customer_id:v.id}).then(res => { 
                    console.log(res,'公司异常情况处理统计');
                   })
                }else if (v.type == "site") {
                   this.siteStatus(v.id)
                  /*  map.latestAlarms().then(res => { 
                    console.log(res,'最新三条');
                   }) */
                   map.siteAbnormal({site_id:v.id}).then(res => { 
                    console.log(res,'站点异常情况处理统计');
                   })
                    
                }  
           },
           customerStatus(id) { 
               map.companyStatus({ customer_id: id, data:{is_refresh: true} }).then(res => { 
                console.log(res,'公司状态');
               })
           },
           siteStatus(id) { 
               map.siteStatus({ site_id: id, data:{is_refresh: true} }).then(res => { 
                console.log(res,'站点状态');
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
                        value: 20,
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
                        value: 40,
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
                        value: 60,
                        name: '一次设备',
                        title: {
                            offsetCenter: ['35%', '-15%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['35%', '-35%']
                        }
                    },{
                        value: 60,
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
                            radius:'125',
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
                            data: ['站点一', '站点二', '站点三', '站点四', '站点五'],
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
                            data: [320, 332, 301, 334, 390]
                        },
                        {
                            name: '正常',
                            type: 'bar',
                            data: [220, 182, 191, 234, 290]
                        },
                        {
                            name: '预警',
                            type: 'bar',
                            data: [150, 232, 201, 154, 190]
                        },
                        {
                            name: '告警',
                            type: 'bar',
                            data: [98, 77, 101, 99, 40]
                        }
                    ]
                    };
                this.myChart.setOption(option);
           },
           initCharts3(){
               var data=[
                    [ "2000-06-05", 116 ],
                    [ "2000-06-06", 129 ],
                    [ "2000-06-07", 135 ],
                    [ "2000-06-08", 86 ],
                    [ "2000-06-09", 73 ],
                    [ "2000-06-10", 85 ],
                    ["2000-06-11", 73 ], [ "2000-06-12", 68 ], [ "2000-06-13", 92 ], [ "2000-06-14", 130 ], [ "2000-06-15", 245 ], [ "2000-06-16", 139 ], [ "2000-06-17", 115 ], [ "2000-06-18", 111 ], [ "2000-06-19", 309 ], [ "2000-06-20", 206 ], [ "2000-06-21", 137 ], [ "2000-06-22", 128 ], [ "2000-06-23", 85 ], [ "2000-06-24", 94 ], [ "2000-06-25", 71 ], [ "2000-06-26", 106 ], [ "2000-06-27", 84 ], [ "2000-06-28", 93 ], [ "2000-06-29", 85 ], [ "2000-06-30", 73 ], [ "2000-07-01", 83 ], [ "2000-07-02", 125 ], [ "2000-07-03", 107 ], [ "2000-07-04", 82 ], [ "2000-07-05", 44 ], [ "2000-07-06", 72 ], [ "2000-07-07", 106 ], [ "2000-07-08", 107 ], [ "2000-07-09", 66 ], [ "2000-07-10", 91 ], [ "2000-07-11", 92 ], [ "2000-07-12", 113 ], [ "2000-07-13", 107 ], [ "2000-07-14", 131 ], [ "2000-07-15", 111 ],
                ];
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
                            radius: [10, 60],
                            center: ['25%', '25%'],
                            roseType: 'radius',
                            label: {
                                show: false
                            },
                            data: [
                                { value: 40, name: '总数' },
                                { value: 23, name: '正常' },
                                { value: 12, name: '预警' },
                                { value: 5, name: '告警' },
                            ]
                        },
                        {
                            name: '温度传感器',
                            type: 'pie',
                            radius: [10, 60],
                            center: ['75%', '25%'],
                            roseType: 'area',  
                            label: {
                                show: false
                            },                      
                            data: [
                                { value: 30, name: '总数' },
                                { value: 20, name: '正常' },
                                { value: 8, name: '预警' },
                                { value: 2, name: '告警' }
                            ]
                        },
                         {
                            name: '电压传感器',
                            type: 'pie',
                            radius: [10, 60],
                            center: ['25%', '75%'],
                            roseType: 'area',    
                            label: {
                                show: false
                            },                      
                            data: [
                                { value: 40, name: '总数' },
                                { value: 28, name: '正常' },                            
                                { value: 10, name: '预警' },
                                { value: 2, name: '告警' }
                            ]
                        },
                         {
                            name: '超声波传感器',
                            type: 'pie',
                            radius: [10, 60],
                            center: ['75%', '75%'],
                            roseType: 'area',   
                            label: {
                                show: false
                            },                        
                            data: [
                               
                                { value: 62, name: '总数' },
                                { value: 28, name: '正常' },
                                { value: 18, name: '预警' },
                                { value: 16, name: '告警' }
                            ]
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
