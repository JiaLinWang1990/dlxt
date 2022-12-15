<template>
    <div>
        <div class="pane-content">
            <div class="content-chart">
                <div id="switch" ref="switch" class="switch"></div>
                <div id="dis" ref="dis" class="dis"></div>
                <div id="current" ref="current" class="current"></div>
            </div>
            <div class="content-params" v-if="dlqData.Mech_Results&&dlqData.Mech_Results.CoilA">
                <div class="title"><h3>特征参数</h3></div>
                <div class="details">
                    <div class="details-item">
                        <div class="item-label">开关分合位置</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.ON_OFF_STATE}}</div>
                    </div>
                    <div class="details-item">
                        <div class="item-label">操作时间</div> <div class="item-value"></div>
                    </div>
                    <div class="details-item">
                        <el-row>
                            <el-col :span="12" style="display: flex;"><div class="item-label-m">合闸时间</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.ON_T1}}</div>ms</el-col>
                            <el-col :span="12" style="display: flex;"><div class="item-label-m">分闸时间</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.OFF_T2}}</div>ms</el-col>
                        </el-row>                                             
                    </div>
                    <div class="details-item">
                        <el-row>
                            <el-col :span="12" style="display: flex;"><div class="item-label-m">合闸同期性</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.ON_dt}}</div>ms</el-col>
                            <el-col :span="12" style="display: flex;"><div class="item-label-m">分闸同期性</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.OFF_dt}}</div>ms</el-col>
                        </el-row>                                             
                    </div>
                    <div class="details-item">
                        <el-row>
                            <el-col :span="12" style="display: flex;"><div class="item-label-m">合闸速度</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.ON_V}}</div>m/s</el-col>
                            <el-col :span="12" style="display: flex;"><div class="item-label-m">分闸速度</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.OFF_V}}</div>m/s</el-col>
                        </el-row>                                             
                    </div>
                    <div class="details-item">
                        <div class="item-label">线圈最大电流</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.t6_A}}</div>m/s
                    </div>
                    <div class="details-item">
                        <div class="item-label">掣子脱扣时间</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.t4}}</div>ms
                    </div>

                    <div class="details-item">
                        <div class="item-label">线圈通电时间</div> <div class="item-value">{{dlqData.Mech_Results.CoilA.t7}}</div>ms
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: "",
    props:{      
        dataInfo:{
            type:Object,
            default:()=>{}
        },   
    },
    watch: {
        dataInfo(val) {
            this.dlqData = this.dataInfo;
            this.init();
        }
    },
    data() {
        return {
            dlqData: {},
            switchChart: null,
            disChart: null,
            currentChart: null,
            option: {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '20px',
                    right: '20px',
                    left: '80px',
                    bottom: '20px' 
                },
                legend: {
                    textStyle: {
                        color: '#ffffff'//字体颜色
                    }
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel:{show:false},
                    axisTick: {
                        // show: false
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '',
                    nameLocation: "center",
                    nameTextStyle: {
                        color:'#fff'
                    },
                    nameGap: 42,
                    axisLine: {
                        show: true,
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
            },
            seriesItem:{
                data: [],
                type: 'line',
                smooth: true
            }
        };
    },
    mounted() {
        this.$nextTick(()=>{
            this.init();      
        })  
    },

    methods: {
        init() {
            this.initSwitchChart();
            this.initDisChart();
            this.initCurrentChart();
        },
        initSwitchChart() { 
            this.switchChart = echarts.init(this.$refs.switch);
            let _option = JSON.parse(JSON.stringify(this.option))
            _option.yAxis.name = '开关量';
            let obj = this.dataInfo.Mech_CT_A_SW;
            _option.xAxis.data = this.setxAxisData(obj.wave.length, obj.samplingperiod);
            _option.series[1] = JSON.parse(JSON.stringify(this.seriesItem));
            _option.series[2] = JSON.parse(JSON.stringify(this.seriesItem));
            _option.series[0].data = this.dataInfo.Mech_CT_A_SW.wave;
            _option.series[0].name = '线路一';
            _option.series[1].name = '线路二';
            _option.series[2].name = '线路三';
            _option.series[1].data = this.dataInfo.Mech_CT_B_SW.wave;
            _option.series[2].data = this.dataInfo.Mech_CT_C_SW.wave;
            this.switchChart.setOption(_option);
        },
        initDisChart() { 
            this.disChart = echarts.init(this.$refs.dis);
            let _option = JSON.parse(JSON.stringify(this.option))
            _option.yAxis.name = '行程(mm)';
            _option.series[0].data = this.dataInfo.Mech_DIS_I.wave[0];
            this.disChart.setOption(_option);
        },
        initCurrentChart() {
            this.currentChart = echarts.init(this.$refs.current);
            let _option = JSON.parse(JSON.stringify(this.option))
            _option.yAxis.name = '线圈电流(A)'
            // _option.xAxis.axisLabel.show = true;
            _option.series[1] = JSON.parse(JSON.stringify(this.seriesItem));
            _option.series[0].data = this.dataInfo.Mech_Off_Coil_I.wave;
            _option.series[1].data = this.dataInfo.Mech_On_Coil_I.wave;
            this.currentChart.setOption(_option);
        },
        setxAxisData(len, period) { 
            let arr = [];
            for (let i = 0; i < len; i++){
                arr.push(i*period)
            }
            return arr;
        }
    },
};
</script>

<style lang='less' scoped>
    .switch, .dis ,.current{
        height:33%;width:100%;
    }
    .content-params{
        .title{
            width:100%;text-align: center;
        }
        .details{
            width:100%;text-align:center;
            .details-item{
                display: flex; line-height: 30px;
                // justify-content: space-evenly;
                margin-top:15px;
                .item-label{
                    width:100px;
                } 
                .item-label-m{
                    width:7 px;
                }
                .item-value{
                    width:50px;height:30px;
                    border:solid 1px #000;
                }            
            }

        }
    }
</style>
