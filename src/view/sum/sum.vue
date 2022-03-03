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
                    <div  ref="map" class="map"></div>
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
   export default {
       name:'',
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
                    }]
           }
       },
       mounted(){
            this.initCharts();
            window.onresize = ()=>{
                this.initCharts();
            }
       },

       methods: {
           initCharts(){
                this.initCharts1();
                this.initCharts2();
                this.initCharts3();
                this.initCharts4();
                this.initCharts5();
                this.initCharts6();
                
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
           initCharts6(){
                this.myChart = echarts.init(this.$refs.map);
                var data = [
  { name: '海门', value: 9 },
  { name: '鄂尔多斯', value: 12 },
  { name: '招远', value: 12 },
  { name: '舟山', value: 12 },
  { name: '齐齐哈尔', value: 14 },
  { name: '盐城', value: 15 },
  { name: '赤峰', value: 16 },
  { name: '青岛', value: 18 },
  { name: '乳山', value: 18 },
  { name: '金昌', value: 19 },
  { name: '泉州', value: 21 },
  { name: '莱西', value: 21 },
  { name: '日照', value: 21 },
  { name: '胶南', value: 22 },
  { name: '南通', value: 23 },
  { name: '拉萨', value: 24 },
  { name: '云浮', value: 24 },
  { name: '梅州', value: 25 },
  { name: '文登', value: 25 },
  { name: '上海', value: 25 },
  { name: '攀枝花', value: 25 },
  { name: '威海', value: 25 },
  { name: '承德', value: 25 },
  { name: '厦门', value: 26 },
  { name: '汕尾', value: 26 },
  { name: '潮州', value: 26 },
  { name: '丹东', value: 27 },
  { name: '太仓', value: 27 },
  { name: '曲靖', value: 27 },
  { name: '烟台', value: 28 },
  { name: '福州', value: 29 },
  { name: '瓦房店', value: 30 },
  { name: '即墨', value: 30 },
  { name: '抚顺', value: 31 },
  { name: '玉溪', value: 31 },
  { name: '张家口', value: 31 },
  { name: '阳泉', value: 31 },
  { name: '莱州', value: 32 },
  { name: '湖州', value: 32 },
  { name: '汕头', value: 32 },
  { name: '昆山', value: 33 },
  { name: '宁波', value: 33 },
  { name: '湛江', value: 33 },
  { name: '揭阳', value: 34 },
  { name: '荣成', value: 34 },
  { name: '连云港', value: 35 },
  { name: '葫芦岛', value: 35 },
  { name: '常熟', value: 36 },
  { name: '东莞', value: 36 },
  { name: '河源', value: 36 },
  { name: '淮安', value: 36 },
  { name: '泰州', value: 36 },
  { name: '南宁', value: 37 },
  { name: '营口', value: 37 },
  { name: '惠州', value: 37 },
  { name: '江阴', value: 37 },
  { name: '蓬莱', value: 37 },
  { name: '韶关', value: 38 },
  { name: '嘉峪关', value: 38 },
  { name: '广州', value: 38 },
  { name: '延安', value: 38 },
  { name: '太原', value: 39 },
  { name: '清远', value: 39 },
  { name: '中山', value: 39 },
  { name: '昆明', value: 39 },
  { name: '寿光', value: 40 },
  { name: '盘锦', value: 40 },
  { name: '长治', value: 41 },
  { name: '深圳', value: 41 },
  { name: '珠海', value: 42 },
  { name: '宿迁', value: 43 },
  { name: '咸阳', value: 43 },
  { name: '铜川', value: 44 },
  { name: '平度', value: 44 },
  { name: '佛山', value: 44 },
  { name: '海口', value: 44 },
  { name: '江门', value: 45 },
  { name: '章丘', value: 45 },
  { name: '肇庆', value: 46 },
  { name: '大连', value: 47 },
  { name: '临汾', value: 47 },
  { name: '吴江', value: 47 },
  { name: '石嘴山', value: 49 },
  { name: '沈阳', value: 50 },
  { name: '苏州', value: 50 },
  { name: '茂名', value: 50 },
  { name: '嘉兴', value: 51 },
  { name: '长春', value: 51 },
  { name: '胶州', value: 52 },
  { name: '银川', value: 52 },
  { name: '张家港', value: 52 },
  { name: '三门峡', value: 53 },
  { name: '锦州', value: 54 },
  { name: '南昌', value: 54 },
  { name: '柳州', value: 54 },
  { name: '三亚', value: 54 },
  { name: '自贡', value: 56 },
  { name: '吉林', value: 56 },
  { name: '阳江', value: 57 },
  { name: '泸州', value: 57 },
  { name: '西宁', value: 57 },
  { name: '宜宾', value: 58 },
  { name: '呼和浩特', value: 58 },
  { name: '成都', value: 58 },
  { name: '大同', value: 58 },
  { name: '镇江', value: 59 },
  { name: '桂林', value: 59 },
  { name: '张家界', value: 59 },
  { name: '宜兴', value: 59 },
  { name: '北海', value: 60 },
  { name: '西安', value: 61 },
  { name: '金坛', value: 62 },
  { name: '东营', value: 62 },
  { name: '牡丹江', value: 63 },
  { name: '遵义', value: 63 },
  { name: '绍兴', value: 63 },
  { name: '扬州', value: 64 },
  { name: '常州', value: 64 },
  { name: '潍坊', value: 65 },
  { name: '重庆', value: 66 },
  { name: '台州', value: 67 },
  { name: '南京', value: 67 },
  { name: '滨州', value: 70 },
  { name: '贵阳', value: 71 },
  { name: '无锡', value: 71 },
  { name: '本溪', value: 71 },
  { name: '克拉玛依', value: 72 },
  { name: '渭南', value: 72 },
  { name: '马鞍山', value: 72 },
  { name: '宝鸡', value: 72 },
  { name: '焦作', value: 75 },
  { name: '句容', value: 75 },
  { name: '北京', value: 79 },
  { name: '徐州', value: 79 },
  { name: '衡水', value: 80 },
  { name: '包头', value: 80 },
  { name: '绵阳', value: 80 },
  { name: '乌鲁木齐', value: 84 },
  { name: '枣庄', value: 84 },
  { name: '杭州', value: 84 },
  { name: '淄博', value: 85 },
  { name: '鞍山', value: 86 },
  { name: '溧阳', value: 86 },
  { name: '库尔勒', value: 86 },
  { name: '安阳', value: 90 },
  { name: '开封', value: 90 },
  { name: '济南', value: 92 },
  { name: '德阳', value: 93 },
  { name: '温州', value: 95 },
  { name: '九江', value: 96 },
  { name: '邯郸', value: 98 },
  { name: '临安', value: 99 },
  { name: '兰州', value: 99 },
  { name: '沧州', value: 100 },
  { name: '临沂', value: 103 },
  { name: '南充', value: 104 },
  { name: '天津', value: 105 },
  { name: '富阳', value: 106 },
  { name: '泰安', value: 112 },
  { name: '诸暨', value: 112 },
  { name: '郑州', value: 113 },
  { name: '哈尔滨', value: 114 },
  { name: '聊城', value: 116 },
  { name: '芜湖', value: 117 },
  { name: '唐山', value: 119 },
  { name: '平顶山', value: 119 },
  { name: '邢台', value: 119 },
  { name: '德州', value: 120 },
  { name: '济宁', value: 120 },
  { name: '荆州', value: 127 },
  { name: '宜昌', value: 130 },
  { name: '义乌', value: 132 },
  { name: '丽水', value: 133 },
  { name: '洛阳', value: 134 },
  { name: '秦皇岛', value: 136 },
  { name: '株洲', value: 143 },
  { name: '石家庄', value: 147 },
  { name: '莱芜', value: 148 },
  { name: '常德', value: 152 },
  { name: '保定', value: 153 },
  { name: '湘潭', value: 154 },
  { name: '金华', value: 157 },
  { name: '岳阳', value: 169 },
  { name: '长沙', value: 175 },
  { name: '衢州', value: 177 },
  { name: '廊坊', value: 193 },
  { name: '菏泽', value: 194 },
  { name: '合肥', value: 229 },
  { name: '武汉', value: 273 },
  { name: '大庆', value: 279 }
                ];
                var geoCoordMap = {
                海门: [121.15, 31.89],
                鄂尔多斯: [109.781327, 39.608266],
                招远: [120.38, 37.35],
                舟山: [122.207216, 29.985295],
                齐齐哈尔: [123.97, 47.33],
                盐城: [120.13, 33.38],
                赤峰: [118.87, 42.28],
                青岛: [120.33, 36.07],
                乳山: [121.52, 36.89],
                金昌: [102.188043, 38.520089],
                泉州: [118.58, 24.93],
                莱西: [120.53, 36.86],
                日照: [119.46, 35.42],
                胶南: [119.97, 35.88],
                南通: [121.05, 32.08],
                拉萨: [91.11, 29.97],
                云浮: [112.02, 22.93],
                梅州: [116.1, 24.55],
                文登: [122.05, 37.2],
                上海: [121.48, 31.22],
                攀枝花: [101.718637, 26.582347],
                威海: [122.1, 37.5],
                承德: [117.93, 40.97],
                厦门: [118.1, 24.46],
                汕尾: [115.375279, 22.786211],
                潮州: [116.63, 23.68],
                丹东: [124.37, 40.13],
                太仓: [121.1, 31.45],
                曲靖: [103.79, 25.51],
                烟台: [121.39, 37.52],
                福州: [119.3, 26.08],
                瓦房店: [121.979603, 39.627114],
                即墨: [120.45, 36.38],
                抚顺: [123.97, 41.97],
                玉溪: [102.52, 24.35],
                张家口: [114.87, 40.82],
                阳泉: [113.57, 37.85],
                莱州: [119.942327, 37.177017],
                湖州: [120.1, 30.86],
                汕头: [116.69, 23.39],
                昆山: [120.95, 31.39],
                宁波: [121.56, 29.86],
                湛江: [110.359377, 21.270708],
                揭阳: [116.35, 23.55],
                荣成: [122.41, 37.16],
                连云港: [119.16, 34.59],
                葫芦岛: [120.836932, 40.711052],
                常熟: [120.74, 31.64],
                东莞: [113.75, 23.04],
                河源: [114.68, 23.73],
                淮安: [119.15, 33.5],
                泰州: [119.9, 32.49],
                南宁: [108.33, 22.84],
                营口: [122.18, 40.65],
                惠州: [114.4, 23.09],
                江阴: [120.26, 31.91],
                蓬莱: [120.75, 37.8],
                韶关: [113.62, 24.84],
                嘉峪关: [98.289152, 39.77313],
                广州: [113.23, 23.16],
                延安: [109.47, 36.6],
                太原: [112.53, 37.87],
                清远: [113.01, 23.7],
                中山: [113.38, 22.52],
                昆明: [102.73, 25.04],
                寿光: [118.73, 36.86],
                盘锦: [122.070714, 41.119997],
                长治: [113.08, 36.18],
                深圳: [114.07, 22.62],
                珠海: [113.52, 22.3],
                宿迁: [118.3, 33.96],
                咸阳: [108.72, 34.36],
                铜川: [109.11, 35.09],
                平度: [119.97, 36.77],
                佛山: [113.11, 23.05],
                海口: [110.35, 20.02],
                江门: [113.06, 22.61],
                章丘: [117.53, 36.72],
                肇庆: [112.44, 23.05],
                大连: [121.62, 38.92],
                临汾: [111.5, 36.08],
                吴江: [120.63, 31.16],
                石嘴山: [106.39, 39.04],
                沈阳: [123.38, 41.8],
                苏州: [120.62, 31.32],
                茂名: [110.88, 21.68],
                嘉兴: [120.76, 30.77],
                长春: [125.35, 43.88],
                胶州: [120.03336, 36.264622],
                银川: [106.27, 38.47],
                张家港: [120.555821, 31.875428],
                三门峡: [111.19, 34.76],
                锦州: [121.15, 41.13],
                南昌: [115.89, 28.68],
                柳州: [109.4, 24.33],
                三亚: [109.511909, 18.252847],
                自贡: [104.778442, 29.33903],
                吉林: [126.57, 43.87],
                阳江: [111.95, 21.85],
                泸州: [105.39, 28.91],
                西宁: [101.74, 36.56],
                宜宾: [104.56, 29.77],
                呼和浩特: [111.65, 40.82],
                成都: [104.06, 30.67],
                大同: [113.3, 40.12],
                镇江: [119.44, 32.2],
                桂林: [110.28, 25.29],
                张家界: [110.479191, 29.117096],
                宜兴: [119.82, 31.36],
                北海: [109.12, 21.49],
                西安: [108.95, 34.27],
                金坛: [119.56, 31.74],
                东营: [118.49, 37.46],
                牡丹江: [129.58, 44.6],
                遵义: [106.9, 27.7],
                绍兴: [120.58, 30.01],
                扬州: [119.42, 32.39],
                常州: [119.95, 31.79],
                潍坊: [119.1, 36.62],
                重庆: [106.54, 29.59],
                台州: [121.420757, 28.656386],
                南京: [118.78, 32.04],
                滨州: [118.03, 37.36],
                贵阳: [106.71, 26.57],
                无锡: [120.29, 31.59],
                本溪: [123.73, 41.3],
                克拉玛依: [84.77, 45.59],
                渭南: [109.5, 34.52],
                马鞍山: [118.48, 31.56],
                宝鸡: [107.15, 34.38],
                焦作: [113.21, 35.24],
                句容: [119.16, 31.95],
                北京: [116.46, 39.92],
                徐州: [117.2, 34.26],
                衡水: [115.72, 37.72],
                包头: [110, 40.58],
                绵阳: [104.73, 31.48],
                乌鲁木齐: [87.68, 43.77],
                枣庄: [117.57, 34.86],
                杭州: [120.19, 30.26],
                淄博: [118.05, 36.78],
                鞍山: [122.85, 41.12],
                溧阳: [119.48, 31.43],
                库尔勒: [86.06, 41.68],
                安阳: [114.35, 36.1],
                开封: [114.35, 34.79],
                济南: [117, 36.65],
                德阳: [104.37, 31.13],
                温州: [120.65, 28.01],
                九江: [115.97, 29.71],
                邯郸: [114.47, 36.6],
                临安: [119.72, 30.23],
                兰州: [103.73, 36.03],
                沧州: [116.83, 38.33],
                临沂: [118.35, 35.05],
                南充: [106.110698, 30.837793],
                天津: [117.2, 39.13],
                富阳: [119.95, 30.07],
                泰安: [117.13, 36.18],
                诸暨: [120.23, 29.71],
                郑州: [113.65, 34.76],
                哈尔滨: [126.63, 45.75],
                聊城: [115.97, 36.45],
                芜湖: [118.38, 31.33],
                唐山: [118.02, 39.63],
                平顶山: [113.29, 33.75],
                邢台: [114.48, 37.05],
                德州: [116.29, 37.45],
                济宁: [116.59, 35.38],
                荆州: [112.239741, 30.335165],
                宜昌: [111.3, 30.7],
                义乌: [120.06, 29.32],
                丽水: [119.92, 28.45],
                洛阳: [112.44, 34.7],
                秦皇岛: [119.57, 39.95],
                株洲: [113.16, 27.83],
                石家庄: [114.48, 38.03],
                莱芜: [117.67, 36.19],
                常德: [111.69, 29.05],
                保定: [115.48, 38.85],
                湘潭: [112.91, 27.87],
                金华: [119.64, 29.12],
                岳阳: [113.09, 29.37],
                长沙: [113, 28.21],
                衢州: [118.88, 28.97],
                廊坊: [116.7, 39.53],
                菏泽: [115.480656, 35.23375],
                合肥: [117.27, 31.86],
                武汉: [114.31, 30.52],
                大庆: [125.03, 46.58]
                };
                var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                    }
                }
                return res;
                };
                function renderItem(params, api) {
                var coords = [
                    [116.7, 39.53],
                    [103.73, 36.03],
                    [112.91, 27.87],
                    [120.65, 28.01],
                    [119.57, 39.95]
                ];
                var points = [];
                for (var i = 0; i < coords.length; i++) {
                    points.push(api.coord(coords[i]));
                }
                var color = api.visual('color');
                return {
                    type: 'polygon',
                    shape: {
                    points: echarts.graphic.clipPointsByRect(points, {
                        x: params.coordSys.x,
                        y: params.coordSys.y,
                        width: params.coordSys.width,
                        height: params.coordSys.height
                    })
                    },
                    style: api.style({
                    fill: color,
                    stroke: echarts.color.lift(color)
                    })
                };
                }
                let option = {
                backgroundColor: 'transparent',
                title: {
                    left: 'center',
                    textStyle: {
                    color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                bmap: {
                    center: [104.114129, 37.550339],
                    zoom: 5,
                    roam: true,
                    mapStyle: {
                    styleJson: [
                        {
                        featureType: 'water',
                        elementType: 'all',
                        stylers: {
                            color: '#044161'
                        }
                        },
                        {
                        featureType: 'land',
                        elementType: 'all',
                        stylers: {
                            color: '#004981'
                        }
                        },
                        {
                        featureType: 'boundary',
                        elementType: 'geometry',
                        stylers: {
                            color: '#064f85'
                        }
                        },
                        {
                        featureType: 'railway',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'highway',
                        elementType: 'geometry',
                        stylers: {
                            color: '#004981'
                        }
                        },
                        {
                        featureType: 'highway',
                        elementType: 'geometry.fill',
                        stylers: {
                            color: '#005b96',
                            lightness: 1
                        }
                        },
                        {
                        featureType: 'highway',
                        elementType: 'labels',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'arterial',
                        elementType: 'geometry',
                        stylers: {
                            color: '#004981'
                        }
                        },
                        {
                        featureType: 'arterial',
                        elementType: 'geometry.fill',
                        stylers: {
                            color: '#00508b'
                        }
                        },
                        {
                        featureType: 'poi',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'green',
                        elementType: 'all',
                        stylers: {
                            color: '#056197',
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'subway',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'manmade',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'local',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'arterial',
                        elementType: 'labels',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'boundary',
                        elementType: 'geometry.fill',
                        stylers: {
                            color: '#029fd4'
                        }
                        },
                        {
                        featureType: 'building',
                        elementType: 'all',
                        stylers: {
                            color: '#1a5787'
                        }
                        },
                        {
                        featureType: 'label',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        }
                    ]
                    }
                },
                series: [
                    {
                    name: 'pm2.5',
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data),
                    encode: {
                        value: 2
                    },
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right'
                    },
                    itemStyle: {
                        color: '#ddb926'
                    },
                    emphasis: {
                        label: {
                        show: true
                        }
                    }
                    },
                    {
                    name: 'Top 5',
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: convertData(
                        data
                        .sort(function (a, b) {
                            return b.value - a.value;
                        })
                        .slice(0, 6)
                    ),
                    encode: {
                        value: 2
                    },
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    showEffectOn: 'emphasis',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    },
                    itemStyle: {
                        color: '#f4e925',
                        shadowBlur: 10,
                        shadowColor: '#333'
                    },
                    zlevel: 1
                    },
                    {
                    type: 'custom',
                    coordinateSystem: 'bmap',
                    renderItem: renderItem,
                    itemStyle: {
                        opacity: 0.5
                    },
                    animation: false,
                    silent: true,
                    data: [0],
                    z: -10
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
         display:flex;flex:1;flex-flow: column;
     }
    .property,.state,.unusual,.map,.notify,.point,.online,.unusual-deal{
       background:#17191A;margin:10px;
    }
    .property,.state,.unusual{
        height:33%;background:#17191A;margin:10px;
    }
    .map{height:80%;}
    .notify{height:20%;}
    .point{height:50%}
    .online{height:25%}
    .unusual-deal{height:25%}
    
    .notify-title{
        height:36px;line-height:36px;padding-left:20px;color:#fff;font-size: 14px;;
    }
    .notify-table{
        
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
