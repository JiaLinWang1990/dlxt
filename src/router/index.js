import Vue from 'vue'
import Router from 'vue-router'
import bms from '@/view/layout/bms.vue'
import site from '@/view/site/site.vue'
import warning from '@/view/warning/warning.vue'
import sum from '@/view/sum/sum.vue'
import login from '../view/login/login.vue'
import home from '../view/layout/home.vue'
import file from '@/view/file/file.vue'
import device from '@/view/device/device.vue'
import user from '@/view/user/user.vue'
import system from '@/view/system/system.vue'
import {Message,MessageBox} from 'element-ui';
Vue.use(Router)
function getCookieById(id){
  let arr = document.cookie?document.cookie.split(';'):[];
  let result=''
  arr.forEach(item=>{
    let _arr = item.split('=');
    if(_arr[0] === ' '+id){
      result = _arr[1]
    }
  })
  return result;
}

 let router = new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login,
      name: 'login',
      meta:{title:'登录'}
    },{
      path: '/home',
      name: 'home',
      component: home,
      children:[
        {
          path: '/site',
          component: site,
          name: 'site',
        }, {
          path: '/warning',
          component: warning,
          name: 'warning',
        }, {
          path: '/sum',
          component: sum,
          name: 'sum',
        }
      ]
    },{
      path: '/bms',
      name: 'bms',
      component: bms,
      children:[
        {
          path: '/file',
          name: 'file',
          component: file,
        },
        {
          path: '/device',
          name: 'device',
          component: device,
        },
        {
          path: '/user',
          name: 'user',
          component: user,
        },{
          path: '/system',
          name: 'system',
          component: system,
        }
      ]

    }
  ]
})


// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
router.beforeEach((to,from,next)=>{
  let token = getCookieById('cloud_token');
  let userinfo = JSON.parse(sessionStorage.getItem('userInfo'))
  if(!token){
    if(from.name =='login'||to.name=='login'){
      next()
      return;
    }
    MessageBox.alert('登录已失效，请重新登录','提示', {
          confirmButtonText: '确定',
          callback: function () {
            sessionStorage.removeItem('userInfo')
            next();
          }
      })   
    return;
  } 
  console.log(token,'token');
  
  if(!userinfo&&to.path!='/login'){
    sessionStorage.removeItem('userInfo')
    next({path:'/login'})
  }else{
    if(to.path=='/login'&&userinfo){
      next({path:'/site'})
    }else{
      next();
    }    
  }
  
})

export default router