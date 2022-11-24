<template>
    <div>
        <div class="pane-content">
            <div class="content-chart">
                <div id="switch" ref="switch" class="switch"></div>
            </div>
            <div class="content-params" v-if="cndjInfo.Mech_Results&&cndjInfo.Mech_Results.Motor">
                <div class="title"><h3>特征参数</h3></div>
                <div class="details">
                    <div class="details-item">
                        <div class="item-label">电机启动电流</div> <div class="item-value">{{cndjInfo.Mech_Results.Motor.MO_FI}}</div> A
                    </div>
                    <div class="details-item">
                        <div class="item-label">电机最大电流</div> <div class="item-value">{{cndjInfo.Mech_Results.Motor.MO_MAXI}}</div> A
                    </div>
                    <div class="details-item">
                        <div class="item-label">电机运行时间</div> <div class="item-value">{{cndjInfo.Mech_Results.Motor.MO_dt}}</div>  s
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import * as device from '@/data/device.js'
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
            option: {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '20px',
                    right: '20px',
                    left: '80px',
                    bottom: '60px' 
                },
                xAxis: {
                    // show:false,
                    type: 'category',
                    name: '时间(s)',   
                    nameLocation: "center",  
                    nameGap: 42,            
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisLabel: {
                        formatter: function (value, index) {
                            console.log(value,index,555);
                        if (index===2) {
                            return '';
                        } else {
                            return value;
                        }
                        // return value;
                    },
                    },
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
                        name:'电机电流',
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        smooth: true
                    }
                ]
            },
            cndjInfo:{}
        };
    },
    mounted() {
        console.log(this.dataDetails,'dataDetails');
        this.getCNDJInfo();
        // this.initChart();
    },

    methods: {
        initChart() { 
            this.switchChart = echarts.init(this.$refs.switch);
            let _option = JSON.parse(JSON.stringify(this.option))
            _option.xAxis.data = this.setxAxisData(this.cndjInfo.Mech_Motor_I.wave.length, this.cndjInfo.Mech_Motor_I.samplingperiod);

            _option.series[0].data = this.cndjInfo.Mech_Motor_I.wave;
            this.switchChart.setOption(_option);
        },
        getCNDJInfo(){
            device.getCNDJInfo({sensor_number:this.dataDetails.sensor_number}).then(res=>{
                console.log(JSON.parse(res.data),'CNDJ');
                this.cndjInfo = JSON.parse(res.data)
                this.initChart();
            })
        },
        setxAxisData(len, period) { 
            let arr = [];
            for (let i = 0; i < len; i++){
                arr.push(i*period/1000/1000)
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
