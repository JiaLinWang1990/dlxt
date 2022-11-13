<template>
    <div>
        <div class="pane-content">
            <div class="content-chart">
                <div id="switch" ref="switch" class="switch"></div>
            </div>
            <div class="content-params">eeee</div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: "",
    data() {
        return {
            switchChart: null,
            option :{
                xAxis: {
                    // show:false,
                    type: 'category',
                    name: '时间(s)',   
                    nameLocation: "center",  
                    nameGap: 42,           
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    // axisLabel:{show:false},
                    axisTick: {
                        show: false
                    },
                
                },
                yAxis: {
                    type: 'value',
                    name: '电机电流(A)',
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
        this.initChart();
    },

    methods: {
        initChart() { 
            this.switchChart = echarts.init(this.$refs.switch);
            this.switchChart.setOption(this.option);
        },
    },
};
</script>

<style lang='less' scoped>
 .switch{
        height:50%;width:100%;
    }
</style>
