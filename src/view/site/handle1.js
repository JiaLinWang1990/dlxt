/* 处理数据并画图，用原生echarts */
/* let trangle = [
    [,],[45,45],[0,0],[90,90]
] */
let abs = function (n) { 
    return n>0?n:-n
}
let setColor = function (val) {
    let colors = [ '0,0,255','48,128,20', '0,255,255','51,161,201','0,255,127',  '255,255,0',  '255,215,0', '250,128,114','255,128,0', '255,97,3','255,0,0']
    return 'rgb('+colors[parseInt(val/10)]+')'//'rgba('+colors[parseInt(val/10)]+','+val/100+')' 
}
let unitArr=[,
    "dB",
    "dBm",
    "dBmV",
    "dBμV",
    "V",
    "mV",
    "μV",
    "%",
    "A",
    "mA",
    "μA",
    "Ω",
    "mΩ",
    "μΩ",
    "m/s²",
    "mm",
    "℃",
    "℉",
    "Pa",
    "C",
    "mC",
    "μC",
    "nC",
    "pC",
    "𝑢/m³",
]
let bian = 20;
let firstIn = true;
let isChanged = false;
let dData = []
let bgColor,textColor,qal,np,gpp,rangemax,rangemin
function initChart(myChart,max, min, np, bgColor,textColor,unit) { 
    console.log(999999);
    const option = {
        animation:false,
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
        visualMap: [{
            inRange: {
                color: ['#f00', '#000'],
            },
            textStyle: {
                color: '#FFF'
            },
            right: 0,
            itemWidth:0,
            seriesIndex: 2
        }, {
            inRange: {
                color: ['#74add1', '#9e1068', '#135200', '#006d75', '#237804', '#ad8b00']
            },
            textStyle: {
                color: '#FFF'
            },
            itemWidth:0,
            right: 0,
            seriesIndex: [0]
        }, {
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
        }]  ,  
        xAxis3D: {
            type: 'value',
            name: '周期[T]',
            nameTextStyle: {
                color: '#FFF',
                fontSize:'14px',
            },
            axisLine: {
                lineStyle: {
                    color: '#000'
                }
            },
            min: 0,
            max:50,
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
                color: '#FFF',
                fontSize:'14px',
            },
            axisLine: {
                lineStyle: {
                    color: '#000',
                   
                }
            },
            min: 0,
            max: 360,
            interval:90,
            axisLabel: {
                formatter: (value) => {
                    return value
                }
            },
        },
        zAxis3D: {
            type: 'value',
            name: '幅值\n['+unit+']',
            nameTextStyle: {
                fontSize:'14px',
            },
            /* splitLine: {
                lineStyle: {
                    color:'#000'
                }
            }, */
            axisLine: {
                lineStyle: {
                    color: '#000'
                }
            },  
            axisLabel:{
            }        
        },
        grid3D: {
            bottom:'100px',
            
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
            viewControl: {
                projection: 'perspective',
                distance: 210,//圖形距离视口的距离，值越大图形越小
                beta: 90,
                alpha:45,
            },
            
        },
        series: [
            {
                type: 'bar3D',
                data: [],
                barSize: 0.4,
                shading: 'color',   
                // sampling:'average'
            },
            {
                type: 'scatter3D',
                symbolSize: 2.2,
                data: [],
                itemStyle: {
                    color: function (val) {
                        if (val.value[4] <= 0.32) {
                            return val.value[4]==0?'#e0e0e0':'rgb(0,'+Math.round(val.value[4]*796)+',255)'
                        } else if (val.value[4] > 0.32 && val.value[4] <= 0.64) {
                            return 'rgb(0,255,'+Math.round(255-(val.value[4]-0.32)*796)+')'
                        } else {
                            
                        }
                        return 'rgb('+Math.round(255-(val.value[4]-0.64)*796)+',255,0)'
                    },
                }
            },
             /*{
                type: 'scatter3D',
                symbolSize: 2,
                data: []
            } */
        ]
    }
    option.backgroundColor = bgColor||''
    option.tooltip = {
        formatter: (item) => {
            return max >= 0 ? (item['value'][2] ? (item['value'][2] + max + 1) : '--') : (item['value'][2] || '--')
        }
    }
    option.visualMap[0].max = option.visualMap[1].max = option.visualMap[2].max = max > 0 ? -1 : max
    option.visualMap[0].min = option.visualMap[1].min = option.visualMap[2].min = max > 0 ? min - max - 1 : min,
    option.visualMap[0].formatter = option.visualMap[1].formatter = option.visualMap[2].formatter = function (value) {
        return max >= 0 ? (value ? (value + max + 1) : '--') : (value || '--') // 范围标签显示内容。
    },
    option.xAxis3D.nameTextStyle.color = option.xAxis3D.axisLabel.color =  option.yAxis3D.nameTextStyle.color = option.yAxis3D.axisLabel.color =  option.zAxis3D.nameTextStyle.color = option.zAxis3D.axisLabel.color = textColor
    option.xAxis3D.max = np
    option.zAxis3D.max = () => {
        return max >= 0 ? -1 : max
    }
    option.zAxis3D.min = () => {
        return max >= 0 ? min - max - 1 : min
    }
    option.grid3D.axisLabel = {
        formatter: (value) => {
            return max >= 0 ? value + max + 1 : value
        }
    }
    myChart.setOption(option)
            
}
function dealData(myChart, data) {    
    let PI = 3.141592653589793
    if (bgColor && (bgColor !== data.bgColor  ||  qal !== data.QuantizedAmplitude ||
        np !== data.PowerFrequencyCycles || gpp !== data.PhaseWindows || rangemax !== data.RangMax || rangemin !== data.RangMin)) {
        isChanged = true;
        }
    bgColor = data.bgColor
    textColor = data.textColor || '#000'
    let prps = JSON.parse(JSON.stringify(data.PRPS))
    let prpd = JSON.parse(JSON.stringify(data.PRPD))
    qal = data.QuantizedAmplitude //50 || 1   //幅值
    np = data.PowerFrequencyCycles//data.np   //周期
    gpp = data.PhaseWindows //data.gpp || 1    //相位
    rangemax = data.RangMax  // data.rangemax
    rangemin = data.RangMin //data.rangemin
    ampmax = data.ampmax||0
    unit = unitArr[data.Unit] 
    span = 360 / gpp
    if (firstIn || isChanged) {
        this.initChart(myChart,rangemax, rangemin, np,  bgColor, textColor,unit)
        firstIn = false;
        isChanged = false;
    }
    
    let cdata = []
    const id = data.point_id
     if (rangemax >= 0) {
         for (let i = 0; i < prps.length; i++) {
            prps[i] = prps[i] - rangemax - 1    //HFCT  TEV
            //    prps[i] = prps[i]>rangemax?rangemax:prps[i]  //超出最大值取最大值   UHF
         }
     }
    let index = 0
    const _span = abs(rangemax - rangemin) / qal
    // np-周期;gpp-相位数;[y,x,z]
    if(prpd.length>10)
    {
       canRefresh = true;
       //console.log("canRefresh"+prpd.length);
    }
    else
    {
       canRefresh = false;
      // console.log("no refresh"+prpd.length);
    }
    let itemStyle={opacity:1};
    for (let i = 0; i < gpp; i++) {
        for (let j = 0; j < np; j++) {
            index = j * gpp + i
            /* if (j == 0) cdata.push([(i + 1) * span, j, prps[index] < rangemin ? prps[index] : rangemin])
            else cdata.push([(i + 1) * span, j, prps[index]]) */
        //  cdata.push([(i + 1) * span, j, prps[index]])  //第一行数据不为最小值时异常处
       /*      if(prps[index]>rangemin && prps[index]!=0) cdata.push([(i + 1) * span, j, prps[index]])
            else if((i<bian||i>gpp-bian || j<bian||j>np-bian) && prps[index]!=0){//保留最小值
                cdata.push([(i + 1) * span, j, prps[index]])
            } */
            if (prps[index] >= (rangemin-rangemax-1)) {
                if (j == 0) cdata.push([(i + 1) * span, j, prps[index] < rangemin ? prps[index] : rangemin])
                else cdata.push([(i + 1) * span, j, prps[index]])                
            }
            
            /* if(prps[index]>rangemin && prps[index]!=0) cdata.push([(i + 1) * span, j, prps[index]])
            else if((i<bian||i>gpp-bian || j<bian||j>np-bian) && prps[index]!=0){//保留最小值
                cdata.push([(i + 1) * span, j, prps[index]])
            } */
        }
    }
    
    let index1 = gpp
    const offset = rangemax > 0 ? abs(rangemax - rangemin) : abs(rangemin) - 1
    const offset2 = rangemax > 0 ? 1 : -rangemax
    // qal-量化幅值;gpp-相位数;[y,x,z]
    if (prpd && prpd.length) {
        for (let i = 1; i < qal; i++) {
            for (let j = 0; j < gpp; j++) {
                if (prpd[index1]>0) {
                    dData.push([j * span + span, 0, i * _span - offset, prpd[index1] - (rangemax > 0 ? abs(rangemax - rangemin) : abs(rangemin))+j,(prpd[index1]>0?prpd[index1]:0)])                
                }
                index1 += 1
                
            }
        }
    }
    // console.log(dData,'dData');
    let lData = []
    // qal-量化幅值;gpp-相位数;[y,x,z]
    /* for (let j = 0; j < 360; j++) {
        lData.push([j, 0, abs(rangemax - rangemin) * (Math.sin(j / 360 * 2 * PI) - 1) / 2 - offset2, 1])
    } */
    
    this.draw(myChart, cdata, dData, lData,gpp)
    cdata = dData = lData = [];
}
/* function draw(myChart, data, data2, data3) {  
    myChart.setOption(
        {
            series: [
                { data: data.map(function (item) { return { value: [item[1], item[0], item[2]] } }) },
                { data: data2.map(function (item) { return { value: [-1, item[0], item[2],item[3],item[4]] } }) },
                // { data: data3.map(function (item) {return { value: [item[1], item[0], item[2],item[3]] } })}
            ]
        }
    );  
    data = data2 = data3 =[]
} */
function draw(myChart, data, data2, data3,gpp) {
    if(canRefresh==true)
    {
        myChart.setOption(
            {
                series: [
                    { data: data.map(function (item) {
                 //   console.log("rangemin1"+rangemin);
                        if(item[2]==rangemin) {
                            return { value: [item[1], item[0], item[2]] ,itemStyle:{opacity:0}}//最小值透明
                        }
                         else {
    
                            return { value: [item[1], item[0], item[2]] ,itemStyle:{opacity:1}}
                           }
                        })
                    },
                    {
                        data: data2.map(function (item) {
                            return {
                                value: [0, item[0], item[2] - 0.5, item[3], item[4]]
                            }
                        })
                    },
                    // { data: data3.map(function (item) {return { value: [item[1], item[0], item[2],item[3]] } })}
                ]
            }
        );
        }
        else {
          myChart.setOption(
                {
                    series: [
                        {data: data.map(function (item,i) {
                            //console.log("rangemin2"+rangemin);
                                if(item[2]==rangemin) {
                                    return { value: [item[1], item[0], item[2]] ,itemStyle:{opacity:0}}
                                }
                                 else {
    
                                    return { value: [item[1], item[0], item[2]] ,itemStyle:{opacity:1}}
                                   }
                                })},
                    ]
                }
            );
        }
        data = data2 = data3 =[]
    }


    export { dealData }