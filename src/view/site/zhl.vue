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
            console.log(this.dataInfo, 456);
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
                    trigger: 'axis'
                },
                legend: {},
                grid: {
                    top: '20px',
                    right: '20px',
                    left: '80px',
                    bottom: '20px' 
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel:{show:false},
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
                        data: [],
                        type: 'line',
                        smooth: true
                    },{
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
            },
        };
    },
    mounted() {
        // this.init();
    },

    methods: {
        init() {
            this.initSwitchChart();
        },
        initSwitchChart() { 
            this.switchChart = echarts.init(this.$refs.switch);
            let _option = JSON.parse(JSON.stringify(this.option))
            // _option.series[0].data = this.zhlData.Mech_CT_A_V.wave;
            _option.series[1].data = this.zhlData.Mech_CT_B_V.wave;
            _option.series[2].data = this.zhlData.Mech_CT_C_V.wave;
            this.switchChart.setOption(_option);
        },
    },
};
</script>

<style lang='less' scoped>
    .switch, .dis ,.current{
        height:33%;width:100%;
    }
</style>
