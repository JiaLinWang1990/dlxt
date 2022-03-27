import Chart from './chart';
import { merge } from '../utils';


/**
 * 铁芯接地电流图谱类
 */
class TEV extends Chart {
    constructor(...args) {
        super(...args);
    }
    /**
     * 生成铁芯接地电流配置项
     * @param {*自定义配置} custom 
     */
    option() {
        let opts = this.opts;
        let chartBody = this.chartBody;
        let subtext = `${chartBody.axisInfo.desc} ${chartBody.axisInfo.value} ${chartBody.axisInfo.unit}`;
        let fontStyle = {
            fill: chartBody.axisInfo.color || opts.color,
            font: `${opts.fontSize * 2}px sans-serif`,
            textVerticalAlign: 'middle',
            textAlign: "center"
        }
        let chartOption = {
            title: {
                textAlign: 'center',
                left: "50%",
                text: chartBody.title,
                top: 10,
            },          
            legend: { show: false },
            xAxis: [{ show: false }],
            yAxis: [{ show: false }],
            // series: {
            //     type: "custom",
            //     renderItem: ({ coordSys }, api) => {
            //         let {
            //             x,
            //             y,
            //             width,
            //             height
            //         } = coordSys;
            //         return {
            //             type: 'group',
            //             children: [{
            //                 type: 'text',
            //                 position: [x, y],
            //                 style: {
            //                     x: width / 2,
            //                     y: height / 2,
            //                     textAlign: 'center',
            //                     text: subtext,
            //                     ...fontStyle
            //                 }
            //             }]
            //         }
            //     },
            //     data: [0],
            //     silent: true
            // }
            series: [
                {
                  type: 'gauge',
                  min: 0, 
                  max: 60,
                  axisLine: {
                    lineStyle: {
                      width: 10,
                      color: [
                        [0.3, '#67e0e3'],
                        [0.7, '#37a2da'],
                        [1, '#fd666d']
                      ]
                    }
                  },
                  pointer: {
                    itemStyle: {
                      color: 'auto'
                    }
                  },
                  axisTick: {
                    distance: -10,
                    length: 8,
                    lineStyle: {
                      color: '#fff',
                      width: 2
                    }
                  },
                  splitLine: {
                    distance: -10,
                    length: 10,
                    lineStyle: {
                      color: '#fff',
                      width: 4
                    }
                  },
                  axisLabel: {
                    color: 'auto',
                    distance: 20,
                    fontSize: 20
                  },
                  detail: {
                    valueAnimation: true,
                    formatter: function (value) {
                      return value.toFixed(2)+"dBmV";
                    },
                    color: 'auto'
                  },
                  data: [
                    {
                        value: chartBody.axisInfo.value,
                    }
                  ]
                }
              ]
        };
        return merge(chartOption, this.baseOption());
    }

}

export default TEV;