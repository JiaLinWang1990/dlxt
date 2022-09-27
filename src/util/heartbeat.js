// import Store from '@/store'

/**
 * websocket 心跳
 */
class Heartbeat{
  constructor(opt){
    this._opt = opt
    let {url,timeout=10*1000} = this._opt
    this.lockReconnect = false     //避免重复连接，因为onerror之后会立即触发 onclose
    this.tt ;
    this.createWebSocket(url)
    //1分钟跳一次
    this.timeout=timeout
    this.timeoutObj=null
    this.serverTimeoutObj=null
    this.testText = '~!@__heart-check'
  }
  /**
   * 心跳检查开始
   */
  heartCheckStart(){
    var self = this;
    if(this.timeoutObj === 'destroyed' || this.serverTimeoutObj === 'destroyed' || this.tt === 'destroyed'){
      return false
    }
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(function(){
      self.websocket.send(self.testText)  // 根据后台要求发送
      self.serverTimeoutObj = setTimeout(function() {
        self.websocket.close()   //如果  1分钟跳一次 之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
      },self.timeout)
    },this.timeout)
  }

  createWebSocket(url){
    if(this.timeoutObj === 'destroyed' || this.serverTimeoutObj === 'destroyed' || this.tt === 'destroyed'){
      return false
    }
    try {
      this.websocket = new WebSocket(url); 
      this.init()
    }catch(e){
      // console.log('url',e);
      this.reconnect(url);
    }
  }
 

  init(){
    if(this.timeoutObj === 'destroyed' || this.serverTimeoutObj === 'destroyed' || this.tt === 'destroyed'){ 
      return false
    }
    let that = this
    this.websocket.onopen = function(e){   //连接成功
      that.websocketonopen(e,that)
    }
    this.websocket.onerror =function(e){  //连接报错
      that.websocketonerror(e,that)
    }
	this.websocket.onmessage = function(e){   //收到数据
      that.websocketonmessage(e,that)
    }
    this.websocket.onclose = function(e){  //连接关闭
      that.websocketclose(e,that)
    }
  }

  reconnect(url){
    if(this.timeoutObj === 'destroyed' || this.serverTimeoutObj === 'destroyed' || this.tt === 'destroyed'){
      return false
    }
    if(this.lockReconnect){  //这里很关键，因为连接失败之后会相继触发 连接关闭，不然会连接上两个 WebSocket
      return false
    }
    this.lockReconnect = true
    this.tt && clearTimeout(this.tt)
    let that = this
    this.tt=setTimeout(()=>{
      that.createWebSocket(url)   //socket重连
      that.lockReconnect=false
    },60000)
  }

  destroyed(){
    //this.websocket
    this.websocket.close()   //离开路由之后断开websocket连接
    this.timeoutObj && clearTimeout(this.timeoutObj);  //离开清除 timeout
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj); 
    this.tt && clearTimeout(this.tt)
    this.timeoutObj = 'destroyed'
    this.serverTimeoutObj = 'destroyed'
    this.tt = 'destroyed'
  }

  websocketonopen(e,self){
    //心跳检测重置
    self.heartCheckStart();
    let {handleOpen} = self._opt
    if(typeof handleOpen === 'function'){
      handleOpen(e)
    }
  }

  websocketonerror(e,self){
    let {url,handleError} = self._opt
    self.reconnect(url);
    if(typeof handleError === 'function'){
      handleError(e)
    }
  }

  websocketonmessage(e,self){	
	if(e.data !== '~!@__heart-check'){
		//无论报警故障离线或者正常都接收消息存起来,设备详情页的设备状态要取用
		// Store.dispatch('saveDate',e.data)
	}
    //拿到任何消息都说明当前连接是正常的
    self.heartCheckStart();    //收到消息会刷新心跳检测，如果一直收到消息，就推迟心跳发送
    let {handleMessage,message} = self._opt
    let data = e.data
    if(data !== this.testText){
      if(data !== '连接成功!' && typeof message === 'function'){
        try{
          let v = JSON.parse(data)
          message(v)
        }catch(ec){
          // console.log(data,ec)
        }
      }else{
        if(typeof handleMessage === 'function'){
          handleMessage(data)
        }
      }   
    }
  }

  websocketclose(e,self){
    let {url,handleClose} = self._opt
    self.reconnect(url);
    if(typeof handleClose === 'function'){
      handleClose(e)
    }
  }
}

export default Heartbeat