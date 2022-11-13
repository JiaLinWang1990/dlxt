<template>
    <div>
        <div class="pane-content">
            <div class="content-chart">
                <div id="switch" ref="switch" class="switch"></div>
                <div id="dis" ref="dis" class="dis"></div>
                <div id="current" ref="current" class="current"></div>
            </div>
            <div class="content-params">eeee</div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: "",
    props:{      
        dataDetails:{
            type:Object,
            default:()=>{}
        },   
    },
    data() {
        return {
            switchChart: null,
            disChart: null,
            currentChart: null,
            option :{
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
                },
                series: [
                    {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true
                    }
                ]
            }
        };
    },
    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.initSwitchChart();
            this.initDisChart();
            this.initCurrentChart();
        },
        initSwitchChart() { 
            this.switchChart = echarts.init(this.$refs.switch);
            this.option.yAxis.name = '开关量';
            this.switchChart.setOption(this.option);
        },
        initDisChart() { 
            this.disChart = echarts.init(this.$refs.dis);
            this.option.yAxis.name = '行程(mm)'
            this.disChart.setOption(this.option);
        },
        initCurrentChart() {
            this.currentChart = echarts.init(this.$refs.current);
            let _option = JSON.parse(JSON.stringify(this.option))
            _option.yAxis.name = '线圈电流(A)'
            _option.xAxis.axisLabel.show = true;
            this.currentChart.setOption(_option);
        },
    },
};
</script>

<style lang='less' scoped>
    .switch, .dis ,.current{
        height:33%;width:100%;
    }
</style>
