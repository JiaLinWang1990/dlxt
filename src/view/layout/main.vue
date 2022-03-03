<template>
  <div style="padding:20px;height: calc(100% - 70px)">
    <component :is="currentView"></component>
  </div>
</template>

<script>
import file from '../file/file.vue'
import device from '../device/device.vue'
import user from '../user/user.vue'
import system from '../system/system.vue'
export default {
  name: "",
  components:{
    file,
    device,user,system
  },
  props:{
    viewComponent:String
  },
  watch:{
    'viewComponent':{
      deep: true,
      handler(val) {
          //设置默认菜单
          this.currentView = val
      }
    }
  },
  data(){
    return {
      currentView:'file'
    }
  },
  methods:{
    onSubmit(){}
  }
}
</script>

<style scoped>

</style>
