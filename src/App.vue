<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import Bus from "@/util/Bus.js";
import chartDetails from "@/view/site/chartDetails.vue";
export default {
    name: 'App',
    data() { 
        return {
            userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
            socket:null,
            lockReconnect:false,
            wsCfg: {
                url:'ws://114.116.8.127:7084/ws/cloud-user-id/'
            },                    
        }
    },
    mounted() { 
        // this.userInfo && this.createWebSocket();
        Bus.$on('wsData', target => {
            target = JSON.parse(target);
            this.test(target.message.data);
        })
        Bus.$on('logined', target => {
            console.log('已经登录');
            this.createWebSocket();
        })
    },

    methods: {
        createWebSocket() {
            try {
                // 创建Web Socket 连接
                this.socket = new WebSocket(this.wsCfg.url+this.userInfo.id+'/');
                // 初始化事件
                this.initEventHandle(this.socket);
            } catch (e) {
                // 出错时重新连接
                this.reconnect(this.wsCfg.url);
            }
        },
        initEventHandle(socket) {
            // 连接关闭时触发
            this.socket.onclose = () => {
                console.log("连接关闭");
            };
            // 通信发生错误时触发
            this.socket.onerror = () => {
                // 重新创建长连接
                this.reconnect();
            };
            // 连接建立时触发
            this.socket.onopen = () => {
                console.log("连接成功");
                // setTimeout(this.test,5000)
                // this.test();
            };
            // 客户端接收服务端数据时触发
            this.socket.onmessage = msg => {
                // 业务逻辑处理
                console.log(msg.data, "ws:data");
                Bus.$emit('wsData',msg.data);
            };
        },
        reconnect() {
            if (this.lockReconnect) {
                return;
            }
            this.lockReconnect = true;
            // 没连接上会一直重连，设置延迟避免请求过多
            setTimeout(() => {
                this.lockReconnect = false;
                this.createWebSocket(this.wsCfg.url+this.userInfo.id+'/');
            }, 5000);
        },
        test(testObj) {
            let This = this;
            if (!testObj.alarm_broadcast) return;   //只有测点报警才需要显示报警播报
            const h = this.$createElement;
            let msgText = '有新的测点报警，传感器编号为：' + testObj.alarm_data.client_number + ' ,类型为' + testObj.alarm_data.sensor_type + ',' +
                ' , 状态描述为： '+testObj.alarm_data.alarm_describe
            let msg = Message({
                message: h('div', {}, [
                            h('div', {
                                style: {width: '650px',display:'flex'}
                            }, [
                                h('span', {                                    
                                    style: {width: '520px','line-height':'26px','-webkit-line-clamp': 2,float:'left',overflow: 'hidden','box-orient': 'vertical',display: '-webkit-box'}  
                                }, msgText),
                                h('span', {
                                    style: {
                                        width:'80px',
                                        height :'26px','line-height':'26px',
                                        margin: '0px 10px',
                                        cursor: 'pointer',
                                        'font-size': '15px',
                                        display: 'inline-block',
                                        padding: '2px 6px',
                                        'background-color': '#ed561c',
                                        color: '#fff',
                                        'border-radius': '5px',
                                        'text-align':'center',
                                        'margin-top' :'15px'
                                    },
                                    on: {
                                        click() {                                           
                                            sessionStorage.setItem('activeTab', JSON.stringify({ id: 'site', number: 1 }))
                                            This.$router.replace({ name: 'site', params: {data:testObj.sensor_data} });                                        
                                            msg.close()
                                        }
                                    }
                                }, '立即查看!'),
                                h('i', {
                                    class: 'el-icon-circle-close', style: {cursor: 'pointer',float:'right','margin-left':'10px','padding-top': '5px','line-height':'42px'}, on: {
                                        click() {
                                            // Store.dispatch('removeWarning', item)
                                             msg.close()
                                        }
                                    }
                                })
                            ]),
                        ]),
                type: 'warning',
                duration:0
            })
        }
        
    }
}
</script>

<style>
*{
  margin:0;padding:0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%;height:100%;
}
</style>
