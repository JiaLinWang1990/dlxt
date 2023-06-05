<template>
   <div style="height:100%;position: relative;" :gutter="20">
        <div class="refresh" @click="refreshData"><i class="el-icon-refresh"></i></div>
        <el-row style="height:100%;">
            <el-col class="grid-content" :span="6">
                <div class="bg-purple content-box">
                    <div class="property-box cape-header ">
                        <div ref="property" id="property" class="property">
                            <div class="notify-title"><img src="../../assets/u212.png" />资产统计</div>
                            <div class="property-content">
                                <div class="content-title">{{ currentNode.label }}</div>
                                <div class="b-content-box">
                                    <div class="content-item" v-if="currentNode.type=='customer'">
                                        <div><img src="../../assets/bdz.png" /></div>
                                        <div>
                                            <p>站点</p>
                                            <p>{{customerInfos.asset_info.site_num}}个</p>
                                        </div>
                                    </div>
                                    <div class="content-item">
                                        <div><img src="../../assets/dlsb.png" /></div>
                                        <div>
                                            <p>一次设备</p>
                                            <p>{{customerInfos.asset_info.equipment_num}}个</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="b-content-box">
                                    <div class="content-item">
                                        <div><img src="../../assets/cd.png" /></div>
                                        <div>
                                            <p>测点</p>
                                            <p>{{customerInfos.asset_info.point_num}}个</p>
                                        </div>
                                    </div>
                                    <div class="content-item">
                                        <div><img src="../../assets/cgq.png" /></div>
                                        <div>
                                            <p>传感器</p>
                                            <p>{{customerInfos.asset_info.sensor_num}}个</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cape-footer"></div>
                    </div>
                    <div class="state-box cape-header ">
                        <div ref="state" id="state" class="state"></div>
                        <div class="cape-footer"></div>
                    </div>
                    <div class="unusual-box cape-header ">
                        <div ref="unusual" id="unusual" class="unusual"></div>
                        <div class="cape-footer"></div>
                    </div>
                </div>
            </el-col>
            <el-col class="grid-content content-box" :span="12">
                <div class="content-box">
                    <div style="height: calc(100% - 170px);" class="map-box cape-header">                        
                        <div class="map-tree">
                            <div class="map-tree-title">
                                <span>地图导航</span>    
                                <span style="display:inline-block;float:right" @click="toggleFold">
                                    <i :class="[isFoldClass]"></i>
                                </span>                                
                            </div>
                            <tree :type="'site'" :data="treeData" @clickNode="clickNode" @doubleClick="doubleClick" ref="trees" v-if="treeData.length"></tree>
                        </div>
                        <amap class="map" :mapData="mapData"></amap>
                        <div class="cape-footer"></div>
                    </div>                    
                    <!-- <div  ref="map" class="map"></div> -->
                    <div class="notify  cape-header">
                        <div class="notify-title"><img src="../../assets/u233.png" />最新异常通知</div>
                        <div class="notify-table">
                            <el-table :data="tableData" style="width: 100%">
                                <el-table-column prop="create_date" label="报警时间" width="140"></el-table-column>
                                <el-table-column prop="equipment_name"  label="设备名称"></el-table-column>
                                <el-table-column prop="site_name"   width="150" label="站点名称"></el-table-column>
                                <!--<el-table-column prop="pointName" label="测点名称"></el-table-column>-->
                                <el-table-column prop="sensor_type" width="90" label="传感器类型"></el-table-column>                                
                                <el-table-column align="center" label="报警状态" >
                                    <template slot-scope="props">
                                        <p>{{alarmLevel[props.row.alarm_level]}}</p>   
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="mini" @click="handle(scope.row)">查看</el-button>                       
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="cape-footer"></div>
                    </div>
                </div>
            </el-col>
            <el-col class="grid-content content-box" :span="6">
                <div class="content-box">
                    <div class="point-box cape-header ">
                        <div ref="point" class="point"></div>
                        <div class="cape-footer"></div>
                    </div>
                    <div class="online-box cape-header ">
                        <div ref="online" class="online"></div>
                        <div class="cape-footer"></div>
                    </div>
                    <div ref="unusual-deal" class="unusual-deal  cape-header">
                        <div class="notify-title"><img src="../../assets/u236.png" />异常情况处理统计</div>
                        <div class="deal-box">
                            <div class="deal-describ">
                                <span><i class="el-icon-message-solid"></i></span>
                                <p>处理数/异常数</p>
                                <p>累计总数</p>
                            </div>
                            <div class="deal-num">
                                <table style="width:80%;margin-top:2px;">
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
                        <div class="cape-footer"></div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div v-if="showDetails">
            <Details :visible.sync="showDetails" :detailsInfo="detailsInfo" @clickNode="clickNode"></Details>
        </div>
   </div>
</template>

<script>
import * as echarts from 'echarts';
// import 'echarts/extension/bmap/bmap'
import  amap  from './map.vue';
 import tree from '@/components/tree.vue'
import * as device from '@/data/device.js'
import * as map from '@/data/map.js'
import  Details  from '../warning/details.vue';
import Bus from "@/util/Bus.js";
   export default {
       name:'',
       components:{amap,tree,Details},
       data(){
           return {
               myChart:null,
               tableData: [],
                treeData:[],
               customerInfos: {
                   asset_info: {}
                },
                abnormalInfos:{},
               countAbnormal: {},
               mapData:[],
               currentNode: {},
               alarmLevel: ['正常', '预警', '报警'],
               showDetails: false,
               isFoldClass: 'el-icon-s-fold',
               isFold:false
           }
       },
       mounted(){
            // this.initCharts();
            this.$nextTick(()=>{
                this.getTreeData();
            })
           
        //     window.onresize = ()=>{
        //         this.initCharts();
        //    }
           Bus.$on('wsData', target => {
                target = JSON.parse(target);
                this.touchWsData(target.message.data)         
           })
            setInterval(this.clickNode,3600000)
       },

    methods: {        
        touchWsData(obj ) {
            let type = this.currentNode.type;
            this.setCountAbnormal(obj.abnormal_count_info[type + '_abnormal_info'], type);   //异常情况处理统计
            if (obj.latest3_alarm) {//最新三条报警
                //还需要判断下报警的这条是否在当前公司或站点下

                this.tableData.pop();
                this.tableData.unshift(obj.alarm_data);
            }                
        },
        toggleFold() { 
            this.isFold = !this.isFold;
            let style = this.isFold ? { width: '35px' } : { width: '200px' }
            let heightStyle = this.isFold ? { height: '110px' } : { height:'300px','max-height': 'calc(100% - 200px)' }
            let titleHeight = this.isFold ? { height: '110px','line-height':'normal' } : { height: '38px','line-height':'38px' }
            let treeStyle = this.isFold ? { height: 0 } : { height: "100%" }
            this.isFoldClass = this.isFold?'el-icon-s-unfold':'el-icon-s-fold'

            $('.map-tree').css(heightStyle).animate(style);
            $('.map-tree-title').css(titleHeight)
            $('.tree-box').css(treeStyle)  
        },
        doubleClick(obj) { 
            console.log(obj, '双击');
            this.$router.replace({ name: 'site', params: {obj:obj} });                                        

        },
            refreshData(){
                this.clickNode(this.currentNode,true);
            },
            getTreeData(){
                let This = this;
                device.queryTrees().then(res=>{
                    if(!res) return;
                    This.treeData = res.data;
                    if (res.data.length && res.data[0]) {
                        This.clickNode(res.data[0]);
                        this.currentNode = res.data[0]
                    }
                    // res.data.length && res.data[0] && This.clickNode(res.data[0])
                    this.mapData = res.data[0].children;
                })
            },
        clickNode(v,is_refresh) { 
            if (!v||!v.type) {
                v = this.currentNode
            }
            this.currentNode = v;
            console.log(this.currentNode,'currentNode');
               if (v.type == "customer") {
                   this.mapData = v.children;
                   this.customerStatus(v.id,v.type,is_refresh)
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
                       this.setCountAbnormal(tmp,'customer')                    
                    console.log(res,'公司异常情况处理统计');
                   })
                }else if (v.type == "site") {
                   this.siteStatus(v.id,v.type,is_refresh)
                   map.siteLatestAlarms({site_id:v.id}).then(res => { 
                    this.tableData = res.data;
                    console.log(res,'站点最新三条');
                   }) 
                   map.siteAbnormalRatio({site_id:v.id}).then(res => { 
                    console.log(res,'站点异常电力设备异常趋势率');
                    this.abnormalInfos = res.data;
                    this.initCharts3();
                   })
                   map.siteAbnormal({site_id:v.id}).then(res => { 
                    console.log(res,'站点异常情况处理统计');
                       let tmp = res.data;
                       this.setCountAbnormal(tmp,'site')                                      
                   })
                    
                }  
        },
            setCountAbnormal(obj, type) { 
                this.countAbnormal = {
                    dayProcessedNum:obj[type+'_day_abnormal_info'].processed_num,
                    dayAlarmNum:obj[type+'_day_abnormal_info'].alarm_num,
                    weekProcessedNum:obj[type+'_week_abnormal_info'].processed_num,
                    weekAlarmNum:obj[type+'_week_abnormal_info'].alarm_num,
                    monthProcessedNum:obj[type+'_month_abnormal_info'].processed_num,
                    monthAlarmNum:obj[type+'_month_abnormal_info'].alarm_num,
                    sumProcessedNum:obj[type+'_month_abnormal_info'].processed_num+obj[type+'_week_abnormal_info'].processed_num+obj[type+'_day_abnormal_info'].processed_num,
                    sumAlarmNum:obj[type+'_month_abnormal_info'].alarm_num+obj[type+'_week_abnormal_info'].alarm_num+obj[type+'_day_abnormal_info'].alarm_num
                };
            },
           customerStatus(id,type,is_refresh=false) { 
               map.companyStatus({ customer_id: id, data:{is_refresh: is_refresh} }).then(res => { 
                this.customerInfos = res.data;
                // this.initCharts1();
                this.initCharts2();
                this.initCharts4();
                this.initCharts5();
               })
           },
           siteStatus(id,type,is_refresh=false) { 
               map.siteStatus({ site_id: id, data:{is_refresh: is_refresh} }).then(res => { 
                this.customerInfos = res.data;
                // this.initCharts1(type);
                this.initCharts2();
                this.initCharts4();
               })
           },
           initCharts(){
                // this.initCharts1();
                this.initCharts2();
                this.initCharts3();
                this.initCharts4();
                this.initCharts5();
                
           },
           initCharts1(type){
           },
           initCharts2(){
                let statusList = this.customerInfos.equipment_status_info;
                let alarmList=[],normalList=[],warningList=[],sumList=[],siteNameList=[];
                statusList.forEach(item=>{
                    alarmList.push(item.alarm_num)
                    normalList.push(item.normal_num)
                    warningList.push(item.warning_num)
                    sumList.push(item.total)
                    siteNameList.push(item.site_name?item.site_name:item.device_type)
                })

               this.myChart = echarts.init(this.$refs.state);
               let _title=this.currentNode.type=="customer"?"{A|     各站点状态统计}":"{A|     各设备状态统计}"
                var option = {
                    title: {
                        text: _title,
                        textStyle: {
                            color: '#fff',
                            rich: {
                                A: {
                                    //添加背景图片并且设置宽高，会自适应显示
                                    width:20,
                                    height: 20,
                                    fontSize: 16,
                                    backgroundColor: {
                                        image: require("../../assets/u231.png")
                                    }
                                }
                            }
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
                            type: 'value',                            
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
                       text: "{A|     电力设备异常率趋势}",
                        top:4,
                        textStyle: {
                            color: '#fff',
                            rich: {
                                A: {
                                    width:20,
                                    height: 20,
                                    fontSize: 16,
                                    backgroundColor: {
                                        image: require("../../assets/u232.png")
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            console.log(params,'params');
                            console.log(params[0].name,'name');
                            // return params[0].name

                            return params[0].name.split('T')[0]+'<br/>'+params[0].value
                        }
                    },
                     grid: {
                        left: '16%',
                        right: '30%',
                        bottom: '10%'
                    },
                    xAxis: {
                        data: data.map(function (item) {
                            return item[0];
                        }),
                        axisLabel:{
                            color: '#fff',
                            formatter: function (value) { 
                                let arr = value.split('T')
                                return arr[0]
                            }
                        }
                    },
                    yAxis: {
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color:'#fff',
                            formatter: function (value) { 
                                console.log(value,'value');
                                return value *100 +'%'
                            }
                        }
                    }, 
                    visualMap: {
                        top: 10,
                        right: 10,
                        textStyle:{
                            color:'#fff'
                        },
                        pieces: [
                        {
                            gt: 1,
                            color: 'red'
                        }, {
                            lt: 0,
                            color: '#096'
                            }
                        ],
                        /* pieces: [{
                            gt: 0,
                            lte: 20,
                            color: '#096'
                        }, {
                            gt: 20,
                            lte: 40,
                            color: '#ffde33'
                        }, {
                            gt: 40,
                            lte: 60,
                            color: '#ff9933'
                        }, {
                            gt: 60,
                            lte: 80,
                            color: '#cc0033'
                        }, {
                            gt: 80,
                            lte: 100,
                            color: '#660099'
                        }, {
                            gt: 100,
                            color: '#7e0023'
                        }], */
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
                            // silent: true,
                            symbol: 'none',
                            label: {
                                show:false,
                            },
                            data: [{
                                yAxis: 0.2
                            }, {
                                yAxis: 0.4
                            }, {
                                yAxis: 0.6
                            }, {
                                yAxis: 0.8
                            }, {
                                yAxis: 1
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
                            text: "{A|     各监测类型测点状态分布}",
                            top:4,
                            textStyle: {
                                color: '#fff',
                                rich: {
                                    A: {
                                        width:20,
                                        height: 20,
                                        fontSize: 16,
                                        backgroundColor: {
                                            image: require("../../assets/u234.png")
                                        }
                                    }
                                }
                            }                                                   
                        },
                        {                       
                            text: '特高频传感器',
                            left:'10%',//居中显示
                            top:'28%',//底部显示
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                         {                       
                            text: '温度传感器',
                            left:'62%',//居中显示
                            top:'28%',//底部显示
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                        {                       
                            text: '暂态地电压',
                            left:'10%',//居中显示
                            top:'56%',//底部显示
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                        {                       
                            text: '超声波传感器',
                            left:'62%',//居中显示
                            top:'56%',//底部显示
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                        {                       
                            text: '机械特性传感器',
                            left:'10%',//居中显示
                            top:'86%',//底部显示
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
                        data: ['总数','正常','预警','告警', ]
                    },                
                    series: [
                        {
                            name: '特高频传感器',
                            type: 'pie',
                            radius: [30, 40],
                            center: ['20%', '20%'],
                            roseType: 'area',
                            label: {
                                show: false,
                            }, 
                            itemStyle: {
                                borderRadius: 5
                            },
                            data: obj.UHF
                        },
                        {
                            name: '温度传感器',
                            type: 'pie',
                            radius: [30, 40],
                            center: ['70%', '20%'],
                            roseType: 'area',  
                            label: {
                                show: false,
                                fontSize: 10,
                                edgeDistance: 5,
                            },   
                            itemStyle: {
                                borderRadius: 5
                            },                   
                            data: obj.TEMP
                        },
                        {
                            name: '电压传感器',
                            type: 'pie',
                            radius: [30, 40],
                            center: ['20%', '50%'],
                            roseType: 'area',    
                             label: {
                                show: false,
                                fontSize: 10,
                                edgeDistance: 5,
                             },     
                             itemStyle: {
                                borderRadius: 5
                            },                 
                            data: obj.TEV
                        },
                         {
                            name: '超声波传感器',
                            type: 'pie',
                            radius: [30, 40],
                            center: ['70%', '50%'],
                            roseType: 'area',   
                             label: {
                                show: false,
                                fontSize: 10,
                                edgeDistance: 5,
                             },   
                             itemStyle: {
                                borderRadius: 5
                            },                     
                            data:obj.AE
                        }
                        , {
                            name: '机械特性传感器',
                            type: 'pie',
                            radius: [30, 40],
                            center: ['20%', '76%'],
                            roseType: 'area',   
                             label: {
                                show: false,
                                fontSize: 10,
                                edgeDistance: 50,
                            },                        
                            data:obj.MECH
                        } 
                    ]
                    };
                this.myChart.setOption(option);
           },
        initCharts5() {
            console.log(this.customerInfos,'customerInfos');
                this.myChart = echarts.init(this.$refs.online);
                // var base = +new Date(2021, 9, 3);
                // var oneDay = 24 * 3600 * 1000;
                // var date = [];

                // var data = [Math.random() * 1];

                // for (var i = 1; i < 2000; i++) {
                //     var now = new Date(base += oneDay);
                //     date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
                //     data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
                // }

                // var option = {
                //     tooltip: {
                //         trigger: 'axis',
                //         position: function (pt) {
                //             return [pt[0], '10%'];
                //         }
                //     },
                //     title: {
                //         left: 'center',
                //         text: '传感器在线率',
                //         textStyle:{
                //             color:'#fff'
                //         }
                //     },                   
                //     xAxis: {
                //         type: 'category',
                //         boundaryGap: false,
                //         data: date
                //     },
                //     yAxis: {
                //         type: 'value',
                //         boundaryGap: [0, '100%']
                //     },
                    
                //     series: [
                //         {
                //             name: '模拟数据',
                //             type: 'line',
                //             smooth: true,
                //             symbol: 'none',
                //             sampling: 'average',
                //             itemStyle: {
                //                 color: 'rgb(255, 70, 131)'
                //             },
                //             areaStyle: {
                //                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //                     offset: 0,
                //                     color: 'rgb(255, 158, 68)'
                //                 }, {
                //                     offset: 1,
                //                     color: 'rgb(255, 70, 131)'
                //                 }])
                //             },
                //             data: data
                //         }
                //     ]
                // };
                let gaugeData = [
                    {
                        value: this.customerInfos.sensor_online_ratio[0].AE*100||0,
                        name: '超声波传感器',
                        title: {
                            offsetCenter: ['-35%', '-30%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['-35%', '-45%']
                        }
                    },
                    {
                        value: this.customerInfos.sensor_online_ratio[1].TEV*100||0,
                        name: '电压传感器',
                        title: {
                            offsetCenter: ['-35%', '25%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['-35%', '10%']
                        }
                    },
                    {
                        value: this.customerInfos.sensor_online_ratio[2].TEMP*100||0,
                        name: '温度传感器',
                        title: {
                            offsetCenter: ['35%', '-30%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['35%', '-45%']
                        }
                    },{
                        value: (this.customerInfos.sensor_online_ratio[3].UHF*100)||0,
                        name: '特高频',
                        title: {
                            offsetCenter: ['35%', '25%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['35%', '10%']
                        }
                    },{
                        value: (this.customerInfos.sensor_online_ratio[4].MECH*100)||0,
                        name: '机械特性',
                        title: {
                            offsetCenter: ['0%', '65%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '50%']
                        }
                    }
            ];
                console.log(gaugeData,'gaugeData');
               let option = {
                   title: {
                       text: "{A|     传感器在线率}",
                        top:4,
                        textStyle: {
                            color: '#fff',
                            rich: {
                                A: {
                                    width:20,
                                    height: 20,
                                    fontSize: 16,
                                    backgroundColor: {
                                        image: require("../../assets/u235.png")
                                    }
                                }
                            }
                        }
                    },
                    series: [
                        {
                            type: 'gauge',
                            radius:'90%',
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
                                formatter: '{value} %'
                            }
                        }
                    ]
                };
                this.myChart.setOption(option);
        },
        handle(row) {
            this.detailsInfo = row;
            this.showDetails = true;
        },
          
       }
   }
</script>

<style lang="less" scoped>
 .refresh{
        width:24px;height:24px;
        position: absolute;top:-20px;right:0;
        i{font-size: 24px;color:#fff;}
    }
.grid-content{
    height:100%;display:flex;
     .content-box{
         height:100%;width:100%;
         display:flex;flex:1;flex-flow: column;position:relative;
         /deep/.ec-extension-bmap{
            // height:calc(100% - 10px) !important
         }
         .map-tree{  
            height:300px;                     
            position:absolute;max-height:calc(100% - 200px); background: #2C2F32;
            width:200px;background: #ccc;z-index: 1000;
            .map-tree-title{
                height:38px;background:#4A4C4F;line-height:38px;
                color:#fff;padding:0 10px;
               
            }
            .tree-box{
                    background: #2C2F32;
                }
            /deep/.el-tree{
                background:#2C2F32;color:#fff;
                overflow:hidden;white-space: nowrap;text-overflow: ellipsis;
                .span-ellipis{
                    overflow:hidden;white-space: nowrap;text-overflow: ellipsis;
                }
            }
         }
     }
    .property-box,.state-box,.unusual-box,.map-box,.notify,.point-box,.online-box,.unusual-deal{
       background:#17191A;margin:10px;position: relative;
    }
    .property-box,.state-box,.unusual-box{
        height:33%;background:#17191A;margin:10px;

    }
    .property,.state,.unusual{
        height:100%;
    }
    .map{height:100%;}
    .notify{height:170px;}
    .point{height:150%;position: relative;}
    .point-box{height:45%;position: relative;overflow-y: auto;overflow-x: hidden;}
    .cape-header::before{
        position: absolute;width:30px;height:15px;content: '';
        left:0px;top:0px;
        border-top:solid 2px #73D1EB;
        border-left:solid 1px #73D1EB;z-index: 1000;
    }
    .cape-header::after{
        position: absolute;height:30px;width:15px;content: '';
        right:0px;top:0px;
        border-top:solid 1px #73D1EB;
        border-right:solid 2px #73D1EB;
    }
    .cape-footer{
        position: relative;
    }
    .cape-footer::before{
        position: absolute;height:30px;width:15px;content: '';
        left:0px;bottom: 0px;
        border-bottom:solid 2px #73D1EB;
        border-left:solid 1px #73D1EB;
    }
    .cape-footer::after{
        position: absolute;width:30px;height:15px;content: '';
        right:0px;bottom:0px;
        border-bottom:solid 1px #73D1EB;
        border-right:solid 2px #73D1EB;
    }
    .notify .cape-footer::before{
        position: absolute;height:30px;width:15px;content: '';
        left:-1px;bottom:-12px;
        border-bottom:solid 2px #73D1EB;
        border-left:solid 1px #73D1EB;
    }
    .notify .cape-footer::after{
        position: absolute;width:30px;height:15px;content: '';
        right:-1px;bottom:-12px;
        border-bottom:solid 1px #73D1EB;
        border-right:solid 2px #73D1EB;
    }
    .unusual-deal .cape-footer::before{
        position: absolute;height:30px;width:15px;content: '';
        left:-1px;bottom:-12px;
        border-bottom:solid 2px #73D1EB;
        border-left:solid 1px #73D1EB;
    }
    .unusual-deal .cape-footer::after{
        position: absolute;width:30px;height:15px;content: '';
        right:-1px;bottom:-12px;
        border-bottom:solid 1px #73D1EB;
        border-right:solid 2px #73D1EB;
    }
    .map-box.cape-header::before{
        position: absolute;width:70px;height:70px;content: '';
        left:-6px;top:-6px;
        border-top:solid 6px #fff;
        border-left:solid 6px #fff;
    }
    .map-box.cape-header::after{
        position: absolute;height:30px;width:30px;content: '';
        right:-6px;top:-6px;
        border-top:solid 6px #fff;
        border-right:solid 6px #fff;
    }
    .map-box .cape-footer::before{
        position: absolute;height:30px;width:30px;content: '';
        left:-6px;bottom:-6px;
        border-bottom:solid 6px #fff;
        border-left:solid 6px #fff;
    }
    .map-box .cape-footer::after{
        position: absolute;width:70px;height:70px;content: '';
        right:-6px;bottom:-6px;
        border-bottom:solid 6px #fff;
        border-right:solid 6px #fff;
    }
    .online-box{height:35%}
    .online{height:100%}
    .unusual-deal{height:20%}
    
    .notify-title{
        height:36px;line-height:36px;padding-left:5px;color:#fff;font-size: 16px;
        img{
            width:20px;height:20px;margin-top: 6px;float:left;margin-right:5px;
        }
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
            padding:0px;color:#fff;text-align: center;font-size: 12px;;
        }
        /deep/.el-table th{
            background:#2C2E30
        }
        /deep/.el-table th.el-table__cell.is-leaf{
            height:30px;
        }
    }
    .deal-box{
        display:flex;height:calc(100% - 46px);color:#fff;
    }
    .deal-describ{
        width:40%;height:100%;text-align: center;
        span{
            display: block;height:40px;line-height:40px;;
        }
        p{
            height:30px;line-height: 30px;;
        }
    }
    .el-icon-message-solid{
        color:#72DBFF;font-size:46px;
    }
    .deal-num{
        width:60%;
        table td{
            width:33%;text-align: center;
            height:32px;
        }
    }
   
}
.property-content{
    width:calc(100% - 60px);
    height:calc(100% - 60px);margin:auto;
    border:solid 2px #EBF3FA;padding:10px;
    .content-title{
        width:100%;text-align: center;color:#fff;
    }
    .b-content-box{
        display:flex;
        justify-content: center;
        margin-top: 15px;;
        .content-item{
            width:120px;
            color:#fff;
            display:flex;
            p{text-align:center;padding-left:5px;}
            img{
                width:50px;height:50px;
            }
        }
    }
}
/deep/.map-tree{
    .tree-box .el-tree-node__content:hover {
        background-color: #F5F7FA;
        color:#409EFF;
    }
}

</style>
