<template>
    <div v-if="dialogVisible">
        <el-dialog :visible.sync="dialogVisible" :width="dialogWidth" :showClose="showClo"
            :close-on-click-modal="false">
            <!-- <div class="refresh" style="width:25px;height:25px;cursor:pointer;margin-left:5px;display:inline-block" @click="dialogVisible=false">
               <i class="el-icon-refresh-left" style="font-size:25px;font-weight:bold;color:#CA5051;"></i>
           </div> -->
            <div style="width:100%;height:25px;cursor:pointer;">
                <i class="el-icon-video-play" style="font-size:25px;color:#CA5051;float:left" @click="reset"
                    v-if="isDefaultIcon && queryDetails.length === 1"></i>
                <i class="el-icon-video-pause" style="font-size:25px;color:#CA5051;float:left"
                    v-if="!isDefaultIcon"></i>
                <i class="el-icon-error" style="font-size:25px;color:#CA5051;float:right"
                    @click="dialogVisible = false"></i>
            </div>
            <div style="display:flex;flex-wrap: wrap;flex: 0 0 33%;justify-content: start;">
                <div class="body-content" v-for="(item, idx) in queryDetails" :key="idx">
                    <div class="basic-box">
                        <el-row class="basic-info">
                            <el-col :span="12">
                                <p>测点名称 : {{ queryDetails[idx].data.point_name }}</p>
                                <p>传感器类型 : {{ queryDetails[idx].data.sensor_type }}</p>

                            </el-col>
                            <el-col :span="12">
                                <p>设备名称 : {{ queryDetails[idx].data.equipment_name }}</p>
                            </el-col>
                        </el-row>
                        <el-row class="basic-info">
                            <el-col :span="24">
                                <!-- <p>采样时间 : {{JSON.stringify(clickData) != "{}"?item.sensor_info.create_time.substring(0,item.sensor_info.create_time.length-7):(item.sensor_info.update_time?item.sensor_info.update_time.substring(0,item.sensor_info.update_time.length-7):'')}}</p>   -->
                                <p>采样时间 : {{ queryDetails[idx].data.update_date }}</p>
                            </el-col>
                            <el-col :span="24">
                                <p>诊断结果 : 正常</p>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- <el-tabs type="border-card" v-model="activeTab[idx]" @tab-click="handleClick" class="chart-tabs">
                        <el-tab-pane label="测点名称" name="point">
                            
                        </el-tab-pane>
                        <el-tab-pane label="PRPS&PRPD" name="prps" v-if="['DEVTEMP','OZONE','ENVTEMP','ENVTH'].indexOf(item.data.sensor_type)==-1">
                        </el-tab-pane>
                        <el-tab-pane label="特征图谱" name="prpd">
                        </el-tab-pane>
                    </el-tabs> -->
                    <ul class="tabs-ul">
                        <li
                            v-for="(ite) in currentTabs(item)"
                            :key="ite.value" 
                            :class="{active: queryDetails[idx].data.tabSelect == ite.value}"
                            @click="changetabs(ite.value,idx)">
                            {{ ite.label }}
                        </li> <!-- :class="{active: activeTab[idx] == ite.value}" -->
                    </ul>                    
                    <div v-show="queryDetails[idx].data.tabSelect === 'point'" class="basic-point-info">
                        <p>电池电量: {{queryDetails[idx].data.battery+'%'}}</p>
                        <div v-if="['DEVTEMP','OZONE','ENVTEMP','ENVTH'].indexOf(queryDetails[idx].data.sensor_type)==-1">
                            <p>报警等级: {{alarmLevel[queryDetails[idx].data.alarm_level]}}</p>
                            <p>放电类型: {{PDType[queryDetails[idx].data.alarm_level]}}</p>
                            <p>放电频次: {{(queryDetails[idx].data.DenoisingN||'0') +'次/s'}}</p>
                            <p>放电类型概率: {{getLabel(queryDetails[idx].data.PD_type_probability)}}</p>
                            <p>最大放电幅值: {{(queryDetails[idx].data.max_limit||'0') +sensorType[queryDetails[idx].data.unit]}}</p>
                            <p>50Hz相关性: {{(queryDetails[idx].data.F50)*100+'%'}}</p>
                            <p>100Hz相关性: {{queryDetails[idx].data.F100*100+'%'}}</p>
                        </div>
                        

                    </div>
                    
                    <div v-show="queryDetails[idx].data.tabSelect ==='prps'"><!-- ||queryDetails[idx].data.tabSelect ==='chart' -->
                        <div :id="item.data.point_id" class="chart-3d" ></div>
                    </div>
                    <div v-show="queryDetails[idx].data.tabSelect ==='chart'">
                        <div :id="item.data.point_id+'1'" class="chart-3d" ></div>
                    </div>
                </div>

            </div>

        </el-dialog>
    </div>
</template>

<script>
import * as pdcharts from '@/util/js/index.js'
import * as device from '@/data/device.js'
import Bus from "@/util/Bus.js";
import * as echarts from 'echarts';
import { dealData } from './handle.js';
import {sensorType,sensorTypeOptions,alarmLevel,PDType} from "@/util/sensorType.js"

export default {
    name: '',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        dataDetails: {
            type: Array,
            default: () => []
        },
        clickData: {
            type: Object,
            default: () => { }
        },
    },
    data() {
        return {
            dialogWidth: 0,
            activeTab: ['point','point','point','point','point','point'],
            showClo: false,
            DataDetails: [],//区别于直接传过来的值，该值表示趋势详情的数组
            queryDetails: [],   //查询详情接口返回值的集合
            tempArr: [],//临时数组
            currentMode: 0, //当前传感器在线工作模式，默认关闭
            isDefaultIcon: true,
            timer: null,
            tabs: [
                { label: '特征数据', value: 'point' },
                { label: 'PRPS&PRPD', value: 'prps' },
                { label: '特征图谱', value: 'chart'},
            ],
            tabSelect: '',
            alarmLevel: alarmLevel,
            PDType: PDType,
            sensorType:sensorType
        }
    },
    computed: {
        dialogVisible: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        }
    },
    created() {
        this.setDialogWidth();

    },
    mounted() {
        //this.DataDetails = this.dataDetails
        //    this.getSensorDetails();

        if (this.clickData) {
            this.getTrendDetail();
        }
        // else {
        this.getAllDetails();
        // }
        window.onresize = () => {
            return (() => {
                this.setDialogWidth()
            })()
        }
        Bus.$on('wsData', target => {
            target = JSON.parse(target);
            this.updateDataByWs(target.message.data.alarm_data)
        })
    },

    methods: {
        currentTabs(item) { 
            if (['DEVTEMP','OZONE','ENVTEMP','ENVTH'].indexOf(item.data.sensor_type) == -1) {
                return this.tabs
            } else {
                return [
                    { label: '特征数据', value: 'point' },
                    { label: '特征图谱', value: 'chart'},
                ]
            }        
        },
        updateDataByWs(obj) {
            this.dataDetails = [obj];
            this.getAllDetails();
        },
        getAllDetails() {
            let This = this;
            this.dataDetails.forEach((item, i) => {
                this.tempArr[i] = device.sensorDetails({ sensor_data_id: item.sensor_data_id, sensor_type: item.sensor_type })
                // this.queryDetails.push(this.getSensorDetails(item));            
            })
            Promise.all([...this.tempArr]).then(res => {
                res.forEach(item => {
                    if (item.data.sensor_type == 'UHF') {
                        item.data.tabSelect = 'prps'
                    } else {
                        item.data.tabSelect = 'point'
                    }
                    
                })
                This.queryDetails = res
                console.log(This.queryDetails, 'This.queryDetails');
                this.$nextTick(() => {
                    if (this.dataDetails.length > 6) {
                        this.DataDetails = this.DataDetails.slice(0, 6);
                        this.$message('最多同时展示六个');
                    }
                    this.initChart(This.queryDetails);
                })
            })
        },
        reset(mode) {
            let params = {
                sensor_id: this.queryDetails[0].data.sensor_id,
                data: {
                    work_mode: mode === 'off' ? 0 : 1
                }
            }
            this.currentMode = mode === 'off' ? 0 : 1;
            let msg = mode === 'off' ? '传感器在线工作模式已关闭' : '传感器在线工作模式已开启'
            device.setWorkMode(params).then(res => {
                this.isDefaultIcon = false;
                this.$message({
                    message: msg,
                    type: 'success'
                });
            })
            // this.getAllDetails();
        },
        getSensorDetails(item) {
            console.log(this.dataDetails);
            device.sensorDetails({ sensor_data_id: item.sensor_data_id, sensor_type: item.sensor_type }).then(res => {
                console.log(res);
                this.DataDetails.push(res.data)
            })
        },
        getTrendDetail() {
            device.queryTrendDetail(this.clickData).then(res => {
                console.log(res, '结果');
                this.DataDetails = res.data//[This[chart]._data]
                this.queryDetails = [res];
                this.initChart(this.queryDetails);
            })
        },
        open() {
            this.$nextTick(() => {
                this.initChart();
            })
        },
        setDialogWidth() {
            let len = this.dataDetails.length;
            this.dialogWidth = (len == 1 ? 1 : (len > 4 ? 3 : 2)) * 353 + 'px';
        },
        changetabs(val,i) { 
            this.activeTab[i] = val;
            this.queryDetails[i].data.tabSelect = val
            console.log(this.activeTab[i]=='point');
        },
        handleClick(tab, i) {
            console.log(tab,i);
             if(tab.name=='common'){

             }
        },
        getLabel(arr) {
            if (!arr) return;
            let result = [];
            arr.forEach((n,i) => {
                result.push(PDType[i]+':'+n+'%')
            })
            return result.join('、')
         },
        initChart(res) {
            let This = this;
            res.forEach((item, idx) => {
                //    let item = this.dataDetails[i];
                item = item.data;
                if (Array.isArray(item)) {
                    item = item[0].sensor_info
                }
                if (JSON.stringify(item.sensor_info) == '{}') {
                    throw Error();
                }
                let data;
                This.activeTab[idx] = 'point'
                let actualType = item.sensor_type.toLowerCase()
                if (['DEVTEMP','OZONE','ENVTEMP','ENVTH'].indexOf(item.sensor_type)>-1) {
                    data = JSON.parse(JSON.stringify(require('@/util/js/data/temperature.js').data));
                    actualType = 'temperature'
                    
                    data.chartBody.title = sensorTypeOptions.filter(n=>n.type==item.sensor_type)[0].label
                    data.chartBody.axisInfo.unit = sensorType[item.unit];
                    data.chartBody.series[0].dataList = Number(item.amplitude);
                    data.chartBody.series[0].min = Number(item.min_limit)
                    data.chartBody.series[0].max = Number(item.max_limit)
                } else if (item.sensor_type == 'TEV') {
                    data = JSON.parse(JSON.stringify(require('@/util/js/data/tev.js').data));
                    data.chartBody.axisInfo.value = item.average||0;
                } else if (item.sensor_type == 'AE') {
                    data = JSON.parse(JSON.stringify(require('@/util/js/data/ae.js').data));
                    data.chartBody.series[0].dataList[0].value = Number(item.peak).toFixed(2);//最大放电幅值
                    data.chartBody.series[1].dataList[0].value = Number(item.average).toFixed(2);//有效放电幅值
                    data.chartBody.series[2].dataList[0].value = Number(item.F50).toFixed(2);//频率分量1
                    data.chartBody.series[3].dataList[0].value = Number(item.F100).toFixed(2);//频率分量2
                }
                else if (item.sensor_type == 'UHF') {
                    This.activeTab[idx] = 'prps'
                    // This.changetabs('prps',0)
                    data = JSON.parse(JSON.stringify(require('@/util/js/data/prps.js').data));
                    data.chartBody.axisInfo.zMaxValue = "最大放电幅值：" + item.ampmax + 'dBm'
                    actualType = 'prps3d';
                    var _data = item.prps;
                    dealData(item);
                    return
                }
                // else {
                    data = JSON.parse(JSON.stringify(require('@/util/js/data/prps.js').data));
                    data.chartBody.axisInfo.zMaxValue = "最大放电幅值：" + item.ampmax + 'dBm'
                    actualType = 'prps3d';
                    var _data = item.prps;
                    dealData(item);
                // }

                pdcharts.draw(document.getElementById(item.point_id+'1'), {
                    width: '350px',
                    height: '343px',
                    type: pdcharts.chartType[actualType],
                    // type:14,
                    data: data.chartBody,
                    background: "#141414",
                    //  autoCycle:true
                });
            })
        },
        processData(data) {
            const prps = data.prps || []
            const np = data.np
            const gpp = data.gpp || 1
            const rangemax = data.rangemax
            const rangemin = data.rangemin
            const ampmax = data.ampmax
            const span = 360 / gpp
            const cdata = []
            const id = data.point_id
            if (rangemax >= 0) {
                for (let i = 0; i < prps.length; i++) {
                    prps[i] = prps[i] - rangemax - 1
                }
            }
            let index = 0
            // np-周期;gpp-相位数;[y,x,z]
            for (let i = 0; i < gpp; i++) {
                for (let j = 0; j < np; j++) {
                    index = j * gpp + i
                    cdata.push([(i + 1) * span, j, prps[index]])
                }
            }
            let n = 0;
            let This = this;
            /* let timer = setInterval(function () { 
                if (n >= 60) {
                    clearInterval(timer);
                    return;
                }
                let temp = cdata.slice(n * 50, n * 50 + 50)
                This.draw(temp, rangemax, rangemin, ampmax, np,id)
                n++
            },20) */
            this.draw(cdata, rangemax, rangemin, ampmax, np, id)
        },
        draw(data, max, min, ampmax, np, id) {
            const option = {
                title: {
                    text: 'PRPS图谱',
                    subtext: 'Max=' + ampmax + 'dBm',
                    textStyle: {
                        color: '#FFF'
                    },
                    subtextStyle: {
                        color: '#FFF'
                    },
                    left: 'center'
                },
                tooltip: {
                    formatter: (item) => {
                        return max >= 0 ? (item['value'][2] ? (item['value'][2] + max + 1) : '--') : (item['value'][2] || '--')
                    }
                },
                visualMap: [{
            max: max > 0 ? -1 : max,
            min: max > 0 ? min - max - 1 : min,
            formatter: function (value) {
                return max >= 0 ? (value ? (value + max + 1) : '--') : (value || '--') // 范围标签显示内容。
            },
            inRange: {
                color: ['transparent', '#FFF']
            },
            textStyle: {
                color: '#FFF'
            },
            right: 0,
            itemWidth:0,
            seriesIndex: 2
        }, {
            max: max > 0 ? -1 : max,
            min: max > 0 ? min - max - 1 : min,
            formatter: function (value) {
                return max >= 0 ? (value ? (value + max + 1) : '--') : (value || '--') // 范围标签显示内容。
            },
            inRange: {
               color: ['transparent', '#9e1068', '#135200', '#006d75', '#237804', '#ad8b00']
            },
            textStyle: {
                color: '#FFF'
            },
            itemWidth:0,
            right: 10,
            seriesIndex: 1
            }, {            
            max: max > 0 ? -1 : max,
            min: max > 0 ? min - max - 1 : min,
            formatter: function (value) {
                return max >= 0 ? (value ? (value + max + 1) : '--') : (value || '--') // 范围标签显示内容。
            },
            inRange: {
                // color: [ '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                 color: ['#136911','#A8D225','#F2DD05', '#EF0000','#8f0e0e']
            },
            textStyle: {
                color: '#FFF'
            },
            itemWidth:20,
            right: 0,
            seriesIndex: 0
        }],
                /* visualMap: {
                    max: max > 0 ? -1 : max,
                    min: max > 0 ? min - max - 1 : min,
                    formatter: function (value) {
                        return max >= 0 ? (value ? (value + max + 1) : '--') : (value || '--') // 范围标签显示内容。
                    },
                    inRange: {
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    },
                    textStyle: {
                        color: '#FFF'
                    },
                    right: 0
                }, */
                xAxis3D: {
                    type: 'value',
                    name: '周期[T]',
                    nameTextStyle: {
                        color: '#FFF'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    min: 0,
                    max: np,
                    axisLabel: {
                        formatter: (value) => {
                            return value
                        }
                    }
                },
                yAxis3D: {
                    type: 'value',
                    name: '相位[°]',
                    nameTextStyle: {
                        color: '#FFF'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    min: 0,
                    max: 360,
                    axisLabel: {
                        formatter: (value) => {
                            return value
                        }
                    }
                },
                zAxis3D: {
                    type: 'value',
                    name: '幅值\n[dBm]',
                    nameTextStyle: {
                        color: '#FFF'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    max: () => {
                        return max >= 0 ? -1 : max
                    },
                    min: () => {
                        return max >= 0 ? min - max - 1 : min
                    }
                },
                grid3D: {
                    axisPointer: {
                        show: false
                    },
                    light: {
                        main: {
                            intensity: 1.2
                        },
                        ambient: {
                            intensity: 0.3
                        }
                    },
                    axisLabel: {
                        formatter: (value) => {
                            return max >= 0 ? value + max + 1 : value
                        }
                    }
                },
                series: [
                    {
                        type: 'bar3D',
                        data: data.map(function (item) {
                            return {
                                value: [item[1], item[0], item[2]]
                            }
                        }),
                        shading: 'color',
                        label: {
                            show: false,
                            fontSize: 16,
                            borderWidth: 1
                        },
                        emphasis: {
                            label: {
                                show: false
                            }
                        }
                    }
                ]
            }
            const myChart = echarts.init(document.getElementById(id))
            myChart.setOption(option)
        },
        dealData(data) {
            const prps = data.prps
            const prpd = data.prpd
            /* const np = data.uhf_powerFrequencyCycles
            const gpp = data.uhf_phaseWindows || 1
            const qal = data.uhf_quantizedAmplitude || 1
            const rangemax = data.uhf_maxLimit
            const rangemin = data.uhf_minLimit
            const ampmax = data.uhf_peak */
            const qal = 50 || 1
            const np = data.np
            const gpp = data.gpp || 1
            const rangemax = data.rangemax
            const rangemin = data.rangemin
            const ampmax = data.ampmax
            const unit = 'dBm' //unitArr[data.uhf_unit - 1] || 
            const span = 360 / gpp
            const cdata = []
            const id = data.point_id
            if (rangemax >= 0) {
                for (let i = 0; i < prps.length; i++) {
                    prps[i] = prps[i] - rangemax - 1
                }
            }
            let index = 0
            const _span = Math.abs(rangemax - rangemin) / qal
            // np-周期;gpp-相位数;[y,x,z]
            for (let i = 0; i < gpp; i++) {
                for (let j = 0; j < np; j++) {
                    index = j * gpp + i
                    if (j == 0) cdata.push([(i + 1) * span, j, prps[index] < rangemin ? prps[index] : rangemin])
                    else cdata.push([(i + 1) * span, j, prps[index]])
                }
            }
            const dData = []
            let index1 = 0
            const offset = rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin) - 1
            const offset2 = rangemax > 0 ? 1 : -rangemax
            // qal-量化幅值;gpp-相位数;[y,x,z]
            if (prpd && prpd.length) {
                for (let i = 0; i < qal; i++) {
                    for (let j = 0; j < gpp; j++) {
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? Math.abs(rangemax - rangemin) : Math.abs(rangemin))])
                        index1 += 1
                    }
                }
            }
            
            const lData = []
            // qal-量化幅值;gpp-相位数;[y,x,z]
            for (let j = 0; j < 360; j++) {
                lData.push([j, 0, Math.abs(rangemax - rangemin) * (Math.sin(j / 360 * 2 * Math.PI) - 1) / 2 - offset2, 1])
            }
            this.draw1(cdata, rangemax, rangemin, ampmax, np, unit, dData, lData, id)
        },
        draw1(data, max, min, ampmax, np, unit, data2, data3, id) {
            const option = {
                title: {
                    text: 'PRPS&PRPD图谱',
                    // subtext: 'Max=' + ampmax + unit,
                    textStyle: {
                        color: '#FFF'
                    },
                    subtextStyle: {
                        color: '#FFF'
                    },
                    left: 'center'
                },
                tooltip: {
                    formatter: (item) => {
                        return max >= 0 ? (item['value'][2] ? (item['value'][2] + max + 1) : '--') : (item['value'][2] || '--')
                    }
                },
                visualMap: [{
                    max: max > 0 ? -1 : max,
                    min: max > 0 ? min - max - 1 : min,
                    formatter: function (value) {
                        return max >= 0 ? (value ? (value + max + 1) : '--') : (value || '--') // 范围标签显示内容。
                    },
                    inRange: {
                        color: ['transparent', '#FFF']
                    },
                    textStyle: {
                        color: '#FFF'
                    },
                    right: 0,
                    seriesIndex: 2
                }, {
                    max: max > 0 ? -1 : max,
                    min: max > 0 ? min - max - 1 : min,
                    formatter: function (value) {
                        return max >= 0 ? (value ? (value + max + 1) : '--') : (value || '--') // 范围标签显示内容。
                    },
                    inRange: {
                        color: ['#8c8c8c', '#9e1068', '#135200', '#006d75', '#237804', '#ad8b00']
                    },
                    textStyle: {
                        color: '#FFF'
                    },
                    right: 0,
                    seriesIndex: 1
                }, {
                    max: max > 0 ? -1 : max,
                    min: max > 0 ? min - max - 1 : min,
                    formatter: function (value) {
                        return max >= 0 ? (value ? (value + max + 1) : '--') : (value || '--') // 范围标签显示内容。
                    },
                    inRange: {
                        color: [ '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                        // color: ['#136911', '#8f0e0e']
                    },
                    textStyle: {
                        color: '#FFF'
                    },
                    right: 0,
                    seriesIndex: 0
                }],
                xAxis3D: {
                    type: 'value',
                    name: '周期[T]',
                    nameTextStyle: {
                        color: '#FFF'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    min: 0,
                    max: np,
                    axisLabel: {
                        formatter: (value) => {
                            return value
                        }
                    }
                },
                yAxis3D: {
                    type: 'value',
                    name: '相位[°]',
                    nameTextStyle: {
                        color: '#FFF'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    min: 0,
                    max: 360,
                    axisLabel: {
                        formatter: (value) => {
                            return value
                        }
                    }
                },
                zAxis3D: {
                    type: 'value',
                    name: '幅值\n[' + unit + ']',
                    nameTextStyle: {
                        color: '#FFF'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#FFF'
                        }
                    },
                    max: () => {
                        return max >= 0 ? -1 : max
                    },
                    min: () => {
                        return max >= 0 ? min - max - 1 : min
                    }
                },
                grid3D: {
                    axisPointer: {
                        show: false
                    },
                    light: {
                        main: {
                            intensity: 1.2
                        },
                        ambient: {
                            intensity: 0.3
                        }
                    },
                    axisLabel: {
                        formatter: (value) => {
                            return max >= 0 ? value + max + 1 : value
                        }
                    }
                },
                series: [
                    {
                        type: 'bar3D',
                        data: data.map(function (item) {
                            return {
                                value: [item[1], item[0], item[2]]
                            }
                        }),
                        shading: 'color',
                        label: {
                            show: false,
                            fontSize: 16,
                            borderWidth: 1
                        },
                        emphasis: {
                            label: {
                                show: false
                            }
                        }
                    },
                    {
                        type: 'scatter3D',
                        symbolSize: 5,
                        data: data2.map(function (item) {
                            return [item[1], item[0], item[2], item[3]]
                        })
                    },
                    {
                        type: 'scatter3D',
                        symbolSize: 2,
                        data: data3.map(function (item) {
                            return [item[1], item[0], item[2], item[3]]
                        })
                    }
                ]
            }
            const myChart = echarts.init(document.getElementById(id))
            myChart.setOption(option)
        }
    },
    destroyed() {
        clearInterval(this.timer)
        if (this.currentMode) {
            this.reset('off')
        }
    }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog {
    // margin-top: 0 !important;
}

.chart-3d {
    height: 345px !important;
    width:  350px !important;
    position: relative !important;
    border: solid 1px #DCDFE6;
    bottom: 0 !important;
}

/deep/.chart-3d>div {
    width: 100% !important;
    height: 100% !important
}

/deep/.el-dialog__header {
    padding: 0;
    background: #141E38;
    border: none;

    .el-dialog__headerbtn {
        top: 0px;
        right: 0;
    }

    .el-dialog__headerbtn .el-dialog__close {
        color: #fff;
    }
}

/deep/.el-dialog__body {
    padding: 0;
    background: #2C2E30;
    color: #fff;
    box-sizing: border-box;
}

.basic-info {
    padding: 0 20px;
    width: 350px;

    p {
        height: 30px;
        line-height: 30px;
        ;
    }
}

.basic-box {
    border: solid 1px #ccc;
}

/deep/.el-tabs--border-card {
    background: transparent;
    border-width: 0 1px;
}

/deep/.chart-tabs .el-tabs__content {
    // height:350px;
    padding: 0;
}

/deep/.el-tabs__header {
    margin: 0;
    background: transparent !important;

    .el-tabs__nav-wrap::after {
        height: 0;
        ;
    }

    .el-tabs__item {
        border-radius: 6px;
        // background: #D7D7D7;
    }

    .el-tabs__item.is-active {
        background: #D7D7D7;
    }
}

/deep/.chart-tabs .el-tabs__item {
    height: 32px;
    line-height: 32px;
    ;
}

/deep/.chart-tabs .el-tabs__item.is-active {
    color: #000;
}

.refresh {
    transition: transform;
    animation: rotate 3s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg)
    }

    to {
        transform: rotate(359deg)
    }
}
ul,li{list-style: none;}
.tabs-ul{
    display: flex;
    justify-content: start;
    margin-top: 10px;
    li{
        padding:0 15px;
        border:solid 1px #ccc;
    }
    .active{
        background-color: #F4D759;
        color:#000;
    }
}
.basic-point-info{
    width: 350px;height: 345px;display: block;border: solid 1px #DCDFE6;
    padding:20px;
    p{
        padding:5px;
        color:lightblue;
    }
}
</style>

