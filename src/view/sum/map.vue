<template>
    <div ref="map" id="map">

    </div>
</template>
<script>
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap'
export default {
   data() {
      return {
         myChart:null,
          option: null,
          dataList: [],
          geoCoordMap:{}
      }
    },
    props: {
        mapData:Array,       
    },
    watch: {
        mapData(val) {
            this.dataList = [];
            this.geoCoordMap = {};
            val.forEach(item => {
                this.dataList.push({ name: item.label, value: item.sensor_num  })   //
                this.geoCoordMap[item.label] = item.site_location
            })
            console.log(this.dataList,this.geoCoordMap);
            this.initCharts()
        }
   },
   created(){
   },
    mounted() {
        console.log(this.mapData,258);
      this.initCharts()
   },
   methods:{
      initCharts(){
                this.myChart = echarts.init(document.getElementById('map'));
                this.$nextTick(() => {
                    this.myChart.resize();
                });
                var data = this.dataList;
                var geoCoordMap = this.geoCoordMap;
                var convertData = function (data) {
                  var res = [];
                  for (var i = 0; i < data.length; i++) {
                     var geoCoord = geoCoordMap[data[i].name];
                     if (geoCoord) {
                     res.push({
                           name: data[i].name,
                           value: geoCoord.concat(data[i].value)
                     });
                     }
                  }
                  return res;
                };
                function renderItem(params, api) {
                  var coords = [
                     [116.7, 39.53],
                     [103.73, 36.03],
                     [112.91, 27.87],
                     [120.65, 28.01],
                     [119.57, 39.95]
                  ];
                  var points = [];
                  for (var i = 0; i < coords.length; i++) {
                     points.push(api.coord(coords[i]));
                  }
                  var color = api.visual('color');
                  return {
                     type: 'polygon',
                     shape: {
                     points: echarts.graphic.clipPointsByRect(points, {
                           x: params.coordSys.x,
                           y: params.coordSys.y,
                           width: params.coordSys.width,
                           height: params.coordSys.height
                     })
                     },
                     style: api.style({
                     fill: color,
                     stroke: echarts.color.lift(color)
                     })
                  };
                }
                this.option = {
                backgroundColor: 'transparent',
                title: {
                    left: 'center',
                    textStyle: {
                    color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                bmap: {
                    center: [104.114129, 37.550339],
                    zoom: 5,
                    roam: true,
                    mapStyle: {
                    styleJson: [
                        {
                        featureType: 'water',
                        elementType: 'all',
                        stylers: {
                            color: '#044161'
                        }
                        },
                        {
                        featureType: 'land',
                        elementType: 'all',
                        stylers: {
                            color: '#004981'
                        }
                        },
                        {
                        featureType: 'boundary',
                        elementType: 'geometry',
                        stylers: {
                            color: '#064f85'
                        }
                        },
                        {
                        featureType: 'railway',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'highway',
                        elementType: 'geometry',
                        stylers: {
                            color: '#004981'
                        }
                        },
                        {
                        featureType: 'highway',
                        elementType: 'geometry.fill',
                        stylers: {
                            color: '#005b96',
                            lightness: 1
                        }
                        },
                        {
                        featureType: 'highway',
                        elementType: 'labels',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'arterial',
                        elementType: 'geometry',
                        stylers: {
                            color: '#004981'
                        }
                        },
                        {
                        featureType: 'arterial',
                        elementType: 'geometry.fill',
                        stylers: {
                            color: '#00508b'
                        }
                        },
                        {
                        featureType: 'poi',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'green',
                        elementType: 'all',
                        stylers: {
                            color: '#056197',
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'subway',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'manmade',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'local',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'arterial',
                        elementType: 'labels',
                        stylers: {
                            visibility: 'off'
                        }
                        },
                        {
                        featureType: 'boundary',
                        elementType: 'geometry.fill',
                        stylers: {
                            color: '#029fd4'
                        }
                        },
                        {
                        featureType: 'building',
                        elementType: 'all',
                        stylers: {
                            color: '#1a5787'
                        }
                        },
                        {
                        featureType: 'label',
                        elementType: 'all',
                        stylers: {
                            visibility: 'off'
                        }
                        }
                    ]
                    }
                },
                series: [
                    {
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data),
                    symbolSize: function (val) {
                        return val[2]*4;
                    },
                    encode: {
                        value: 2
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        label: {
                        show: true
                        }
                    }
                    },
                    {
                    name: 'Top 5',
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: convertData(
                        data
                        .sort(function (a, b) {
                            return b.value - a.value;
                        })
                        .slice(0, 6)
                    ),
                    symbolSize: function (val) {
                        return val[2] / 10;
                    },
                    encode: {
                        value: 2
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    },
                    emphasis: {
                        scale: true
                    },
                    zlevel: 1
                    }
                ]               
                };
              

               this.myChart.setOption(this.option,true);
               setTimeout(() => {
                    window.addEventListener("resize", () => {
                        this.myChart.resize();
                    });
                });
           }
   },
}
</script>
<style lang="less" scoped>

</style>
