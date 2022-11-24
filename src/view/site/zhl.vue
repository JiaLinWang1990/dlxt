<template>
    <div>
        <div class="pane-content">
            <div class="content-chart">
                <div id="switch" ref="switch" class="switch"></div>
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
            console.log(this.dataInfo, 45678);
            this.zhlData = this.dataInfo;
            this.init();
        }
    },
    data() {
        return {
            zhlData: {},
            switchChart: null,
            disChart: null,
            currentChart: null,
            option: {
                title: {
                    text: '',
                    left:'center'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) { 
                    
                    }
                },
                legend: {},
                grid: {
                    top: '20px',
                    right: '20px',
                    left: '80px',
                    bottom: '60px' 
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    name:'时间(ms)',
                    nameGap:40,
                    nameLocation:'middle',
                    axisLabel:{show:true},
                    axisTick: {
                        show: false
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '',
                    nameLocation: "center",
                    nameGap: 42,
                    axisLine: {
                        show: true,
                    }
                },
                series: [
                    {
                        name:'回路A',
                        data: [],
                        type: 'line',
                        smooth: true
                    },{
                        name:'回路B',
                        data: [],
                        type: 'line',
                        smooth: true
                    },{
                        name:'回路C',
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
            },
        };
    },
    mounted() {
        this.$nextTick(()=>{
            this.initSwitchChart();
        })
        // this.init();
    },

    methods: {
        init() {
            this.initSwitchChart();
        },
        initSwitchChart() { 
            this.switchChart = echarts.init(this.$refs.switch);
            let _option = JSON.parse(JSON.stringify(this.option))
            _option.yAxis.name = '主回路电流(A)'
            // _option.series[0].data = this.zhlData.Mech_CT_A_V.wave;
            _option.xAxis.data = this.setxAxisData(this.dataInfo.Mech_CT_B_V.wave.length, this.dataInfo.Mech_CT_B_V.samplingperiod);
            _option.series[1].data = this.dataInfo.Mech_CT_B_V.wave;
            _option.series[2].data = this.dataInfo.Mech_CT_C_V.wave;
            this.switchChart.setOption(_option);
        },
        setxAxisData(len, period) { 
            let arr = [];
            for (let i = 0; i < len; i++){
                arr.push(i*period/1000)
            }
            return arr;
        }
    },
};
</script>

<style lang='less' scoped>
    .switch{
        height:50%;width:100%;
    }
</style>
