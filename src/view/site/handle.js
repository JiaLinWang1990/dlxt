/* 处理数据并画图，用原生echarts */
import * as echarts from 'echarts';
var trangle = [
    [,],[45,45],[0,0],[90,90]
]
function dealData(data, n) {
    console.log(new Date());
    let bgColor = '';//data.bgColor
    const prps = data.prps
    const prpd = data.prpd
    /* const np = data.uhf_powerFrequencyCycles
    const gpp = data.uhf_phaseWindows || 1
    const qal = data.uhf_quantizedAmplitude || 1
    const rangemax = data.uhf_maxLimit
    const rangemin = data.uhf_minLimit
    const ampmax = data.uhf_peak */
    const qal = data.quantized_amplitude //50 || 1   //幅值
    const np = data.power_frequency_cycles//data.np   //周期
    const gpp = data.phase_windows //data.gpp || 1    //相位
    const rangemax = data.max_limit  // data.rangemax
    const rangemin = data.min_limit //data.rangemin
    const ampmax = data.ampmax||0
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
    draw(cdata, rangemax, rangemin, ampmax, np, unit, dData, lData, bgColor,id)
}
function draw(data, max, min, ampmax, np, unit, data2, data3, bgColor,id) {
    const option = {
        animation:false,
        // backgroundColor:bgColor,
        title: {
            // text: 'PRPS&PRPD图谱',
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
            },
           
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
            },
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
            },           
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
            },
           /*  viewControl: {
                beta: n?trangle[n][0]:40,
                alpha:n?trangle[n][1]:20,
            }, */
            
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
                data: data2.map(function (item,i) {
                    return [item[1], item[0], item[2]-1, item[3]]
                }),
                itemStyle: {
                    mormal: {
                        color: function () { 
                            return 'blue'
                        }
                    }
                }
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
    let myChart1 =  echarts.init(document.getElementById(id))
    myChart1.setOption(option);
}


export { dealData }