<template>
   <div style="overflow: auto;height: 100%" class="tree-box">
       <el-tree ref="tree" :default-expanded-keys="defaultKeys" :data="data" :props="defaultProps" @node-click="handleNodeClick"
       @node-contextmenu="rightClick" :expand-on-click-node="false" node-key='id' highlight-current :filter-node-method="filterNode">
            <span class="span-ellipis" slot-scope="{node,data}">
                <span :title="node.label">{{node.label }}</span>  <!-- v-if="data.type=='site'&&data.unprocessed_num" -->
                <span v-if="data.unprocessed_num" style="margin-left:15px;display:inline-block;width:18px;height:18px;text-align:center;line-height:18px;border-radius:50%;color:#fff;background:#f00;">{{(data.unprocessed_num?data.unprocessed_num:'')}}</span>
            </span>            
       </el-tree>
       <div id="menu" v-show="showMenu" @mouseleave="showMenu =!showMenu" >
            <el-card class="box-card">
                <div class="text item" v-for='item in operateList' :key="item.code">
                    <div @click="operate(item.code)">{{item.label}}</div>
                </div>                
            </el-card>
       </div>
   </div>
</template>

<script>
   export default {
       name:'',
       props:{
           data:Array,   
           type:String,      
       },

       data(){
           return {              
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                showMenu:false,
                currentType:'',
                operateList:[],
                defaultKeys:[],

           }
       },
       mounted(){  
            if (this.data.length) {
                   this.data.forEach(item => { 
                       if (item.children.length) {
                           let temp=0;
                           item.children.forEach(i => {
                                temp+=Number(i.unprocessed_num)
                           })
                           item.unprocessed_num = temp;
                        }
                   })
                   console.log(this.data,'树');
                }
           this.$nextTick(()=>{
                this.defaultKeys = this.data.length? [this.data[0].id]:[];
               this.data[0] && this.data[0].children && this.$refs.tree.setCurrentKey(this.data[0].children[0].id);               
           })       
       },

       methods: {
           filterData(val){
               this.$refs.tree.filter(val);
           },

            filterNode(value,data,node) {
                if(!value){
                    return true;
                }
                let _array = [];//这里使用数组存储 只是为了存储值。
                this.getReturnNode(node,_array,value);
                let result = false;
                _array.forEach((item)=>{
                    result = result || item;
                });
                return result;
            },
            getReturnNode(node,_array,value){
                let isPass = node.data &&  node.data.label && node.data.label.indexOf(value) !== -1;
                isPass?_array.push(isPass):'';
                this.index++;
                if(!isPass && node.parent){
                    this.getReturnNode(node.parent,_array,value);
                }
            },
           handleNodeClick(obj,node,e){
               this.$emit('clickNode',obj)
           },
           rightClick(MouseEvent, object, Node, element){
               console.log( object, Node)
               if(this.type == 'site'){
                    this.operateList=[]
                    return;
               }
                if(this.type=='device'){
                   if(object.type == "gateway"){
                        this.operateList=[
                            {code:'del',label:'删除'},
                        ]
                    }else{
                        this.operateList=[]
                        return;
                    }               
               } else{
                   if(object.type!='point'){
                        this.operateList=[
                            {code:'add',label:'添加同级'},
                            {code:'addChild',label:'添加下级'},
                            {code:'edit',label:'修改'},
                            {code:'del',label:'删除'},
                        ]
                    }else{
                        this.operateList=[
                            {code:'add',label:'添加同级'},
                            {code:'edit',label:'修改'},
                            {code:'del',label:'删除'},
                        ]
                    }     
               }   
                
                 
               this.currentType = object
               this.showMenu = true;
               let menu = document.querySelector("#menu");
                menu.style.cssText = "position: fixed; left: " + (MouseEvent.clientX - 10) + 'px' + "; top: " + (MouseEvent.clientY - 95) + 'px; z-index: 999; cursor:pointer;';
           },
           operate(val){
               this.$emit(val,this.currentType)
           }
       }
   }
</script>

<style lang='less' scoped>
/deep/.el-card__body{
    padding:10px 0;
}
.item{
    height:36px;line-height: 36px;
    width:100px;text-align: center;
}
.el-tree{
    // padding :0 10px;
}
.item:not(:last-child){border-bottom:solid 1px #ccc;}
.span-ellipis{
    font-size: 14px;
}
/deep/.el-tree-node:focus>.el-tree-node__content{
    background-color:transparent !important;
}
</style>
