<template>
    <div style="display:flex;height:100%;">
        <div class="left-tree">
            <div style="background:#4A4C4F;padding:10px 5px;">
                <span>站点导航</span>
                <i class="el-icon-search" @click="showSearch" style="padding-left:15px;" v-if="!isFold"></i>
                <span style="display:inline-block;float:right" @click="toggle">
                    <i :class="[isFoldClass]"></i>
                </span>
            </div>
            <el-input v-if="showSearchBox" clearable
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input>
            <div class="tree-div" style="">
                <tree :type="'site'" :data="treeData" @clickNode="clickNode" ref="trees"></tree>
            </div>            
        </div>
        <div class="main-area">
            <div class="sub-tabs site-tabs">
                <div>
                    <button class="small-btn" @click="showDialog(2)">实时</button>
                    <button class="small-btn" @click="showDialog(1)">趋势</button>
                    <button class="small-btn" @click="selectAll(3)">全选</button>
                </div>
                <el-tabs v-model="activeTab" class="site-tabs-ul">
                    <el-tab-pane label="一次接线图" name="chart"></el-tab-pane>
                    <el-tab-pane label="测点列表" name="list"></el-tab-pane>
                </el-tabs>
            </div>
            <div v-if="activeTab == 'list'" style="height:calc(100% - 50px);">
                <div class="search-content">
                <el-form ref="form" :model="form" label-width="80px" class="site-form">
                    <el-col :span="18">
                        <el-col :span="12">
                            <el-form-item label="测点名称">
                                <el-input v-model="form.point_name"  clearable style="width:217px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="报警状态" >
                                <el-select v-model="form.status" placeholder="请选择" clearable  popper-class="dark-style">
                                    <el-option label="正常" value="1"></el-option>
                                    <el-option label="预警" value="2"></el-option>
                                    <el-option label="报警" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="连接状态">
                                <el-select v-model="form.connectStatus" placeholder="请选择" clearable popper-class="dark-style">
                                    <el-option label="连接" value="1"></el-option>
                                    <el-option label="断开" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数据类型">
                                <el-select v-model="form.type" placeholder="请选择" clearable popper-class="dark-style">
                                    <el-option label="AE" value="AE"></el-option>
                                    <el-option label="TEV" value="TEV"></el-option>
                                    <el-option label="Temp" value="Temp"></el-option>
                                    <el-option label="UHF" value="UHF"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item size="large">                           
                            <el-button class="small-btn" @click="queryData">查询</el-button>
                            <el-button class="small-btn" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
            <div class="table-content">
                <el-table :data="tableData" style="width: 100%" @select="handleSelect" @select-all="selectAll"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)" ref="multipleTable">
                    <el-table-column
                        header-align="center"
                        align="center"
                        type="selection"
                        width="55"
                    ></el-table-column>
                    <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
                    <el-table-column prop="device_name" align="center"  label="设备名称" width="150"></el-table-column>
                    <el-table-column prop="point_name" align="center" label="测点名称" width="150"></el-table-column>
                    <el-table-column prop="type" align="center" label="数据类型"></el-table-column>
                    <el-table-column align="center" label="报警状态">正常</el-table-column>
                    <el-table-column prop="sensor_info" align="center" label="电池电量" >
                        <template slot-scope="props">
                            <span>{{props.row.sensor_info.params?props.row.sensor_info.params.status.battery:'/'}}</span>        
                        </template>
                    </el-table-column>                    
                    <el-table-column align="center" label="连接状态">连接</el-table-column>
                    <el-table-column prop="sensor_info" align="center" label="RSSI">
                        <template slot-scope="props">
                            <span v-if="props.row.type=='Temp'">/</span>   
                            <span v-else>{{props.row.sensor_info.params?props.row.sensor_info.params.status.rssi:'/'}}</span>     
                        </template>
                    </el-table-column>
                    <el-table-column prop="params" align="center" label="SNR">
                         <template slot-scope="props">
                            <span v-if="props.row.type=='Temp'">/</span>   
                            <span v-else>{{props.row.sensor_info.params?props.row.sensor_info.params.status.snr:'/'}}</span>     
                        </template>
                    </el-table-column>
                    <el-table-column prop="sensor_info" align="center" width="150" label="更新时间">
                        <template slot-scope="props">  
                            <span>{{props.row.sensor_info.update_time?props.row.sensor_info.update_time.substring(0,props.row.sensor_info.update_time.length-7):'/'}}</span>     
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" class="table-btn" @click="details(scope.row)"><a>查看</a></el-button>                           
                        </template>
                    
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5,10, 20, 50]"
                    prev-text="上一页" next-text="下一页"
                    :page-size="size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
            </div>
            <div v-if="activeTab == 'chart'" id="bigimg" style="text-align:center;position:relative;">    
                <img ref="bigImage" src="../../assets/3.svg"  @mousewheel="bagimg(this)"  @mousedown="move($event)"  alt="" style="position:relative;"> 
                <!-- <embed type="image/svg+xml" src="../../assets/1.svg" id="my-embed"/>            -->
            </div>
        </div>
        <div  v-if="showChart">
             <chart :visible.sync="showChart" :tableData="tableData" :selectData="selectData"></chart>
        </div>
        <div  v-if="showChartDetails" >
            <chartDetails  :visible.sync="showChartDetails" :dataDetails="dataDetails"></chartDetails>
        </div>        
    </div>
</template>

<script>
import * as device from '@/data/device.js'
 import tree from '@/components/tree.vue'
export default {
    name: "",
    components:{
        tree,
        chart:resolve => {require(['../site/chart.vue'], resolve)},
        chartDetails:resolve => {require(['../site/chartDetails.vue'], resolve)},
    },
    data() {
        return {
            userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
            isFold:false,
            isFoldClass:'el-icon-s-fold',
             showChart:false,
             showChartDetails:false,
             treeData:[],
            tableData: [] ,
            selectData:[],
            originTableData:[],
            form: {
                point_name: '',
                status: '',
                connectStatus: '',
                type: '',
            },
            activeTab:'list',
            dataDetails:{},
            selectedData:[], // 表格中选中的数据
            params:{
                zoomVal:1,left:0,top:0,currentX:0,currentY:0,flag:false,
            },
            filterText:'',
            showSearchBox:false,
             currentPage:1,
            size:10,
            total:0,
            currentNode:{},//操作分页组件时需要知道之前点击的是哪个node
            loading:false,
        };
    },
    watch: {
      filterText(val) {
        this.$refs.trees.filterData(val);
      }
    },
    mounted() {
        this.getTreeData();
        // document.getElementById('my-embed').addEventListener('load', function(){
        // // Will get called after embed element was loaded
        // // svgPanZoom(document.getElementById('my-embed'));
        // })
    },

    methods: {
         handleSizeChange(val){
             this.size = val;
             this.clickNode(this.currentNode)
            // this.getUserList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getUserList();
        },
        showSearch(){
            this.showSearchBox = !this.showSearchBox ;
        },
        toggle(){
            this.isFold = !this.isFold;
            let style = this.isFold?{width:'25px'}:{width:'280px'}
            let heightStyle = this.isFold?{height:'120px'}:{height:'calc(100% - 160px)'}
            let treeStyle = this.isFold?{height:0}:{height:"calc(100% - 40px)"}
            this.isFoldClass = this.isFold?'el-icon-s-unfold':'el-icon-s-fold'
            $('.left-tree').css(heightStyle).animate(style);    
             $('.tree-div').css(treeStyle)      
            this.isFold?$('.main-area').css({width:'100%'}):$('.main-area').css({width:'calc(100% - 300px)'})
        },
        queryData(){
            let currentArr = JSON.parse(JSON.stringify(this.originTableData))
            if(this.form.type){
                currentArr = currentArr.filter(item=>item.type==this.form.type)
            }
            if(this.form.point_name){
                currentArr = currentArr.filter(item=>item.point_name.indexOf(this.form.point_name)>-1)
            }            
            this.tableData = currentArr;
        },
        reset(){
            this.form.point_name = '';
            this.form.status = '';
            this.form.connectStatus = '';
            this.form.type = '';
            this.tableData = this.originTableData;
        },
        selectAll(val){
            console.log(val.length,'val');
            this.selectedData = val;
            if(val===3){
                 this.tableData.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row,true);
                });
                 this.selectedData =  this.tableData
            }
        },
        handleSelect(val,row){
            this.selectedData = val;
            if(val){

            }
        },
        getTreeData(){
            let This = this;
            device.queryTree().then(res=>{
                if(!res) return;
                This.treeData = res.data;
                 res.data.length && this.getSiteSensor(res.data[0].children[0].id)
            })
        },
        getEquipmentSensor(id){
            let params = {equipments:id,page:this.currentPage,limit:this.size}
            device.queryEquipmentSensor(params).then(res=>{
                this.loading = false;
                if(!res) return;
                this.originTableData = JSON.parse(JSON.stringify(res.data.sensor_list))
                this.tableData = res.data.sensor_list; 
                 this.total = res.data.total;                         
            })
        },
         getSiteSensor(id){             
            let params = {sites:id,page:this.currentPage,limit:this.size}
            device.querySiteSensor(params).then(res=>{
                this.loading = false;
                if(!res) return;
                this.originTableData = JSON.parse(JSON.stringify(res.data.sensor_list))
                this.tableData = res.data.sensor_list;
                 this.total = res.data.total;     
            })
        },
        showDialog(val){
            if(val==1){
                if(!this.selectedData.length) {
                    this.$message({
                        message: '请先选择',
                        type: 'warning'
                    });
                    return;
                }
                this.selectData = this.selectedData
                this.showChart = true
            }else{
                if(!this.selectedData.length) {
                    this.$message({
                        message: '请先选择',
                        type: 'warning'
                    });
                    return;
                }
                this.dataDetails = this.selectedData;
                this.showChartDetails = true;
            }
        },
        clickNode(v){  
            this.currentNode = v;
            this.selectedData = [];            
            if(v.type=="site"){
                this.loading = true;
                this.getSiteSensor(v.id)
            }else if(v.type=="equipment"){
                this.loading = true;
                this.getEquipmentSensor(v.id);             
            }                        
        },
        getWantedList(data,label){
            let resultArr = [];
            for(var i=0;i<data.length;i++){
                let temp = data[i].children;
                temp.deviceName = label;
                temp.pointName = data[i].label
                resultArr.push(temp)
            }
            return resultArr
        },
        details(row){
            this.dataDetails = [row];
            this.showChartDetails = true;
            console.log(row,'row')
        },
       bagimg() {
            /* 获取当前页面的缩放比
                    若未设置zoom缩放比，则为默认100%，即1，原图大小
                */
            var zoom = parseInt(this.$refs.bigImage.style.zoom) || 100;
            /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom
                    wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
                */
            zoom += event.wheelDelta / 12;
            /* 最小范围 和 最大范围 的图片缩放尺度 */
            // if (zoom >= 100 && zoom <250) {
                this.$refs.bigImage.style.zoom = zoom + "%";
            // }
            return false;
        },
        move(e){
            let odiv = e.target;        //获取目标元素
            //阻止默认事件的方法,如果不阻止默认事件onmouseup会无法触发
             e.preventDefault();
            //算出鼠标相对元素的位置
            let disX = (e.clientX - odiv.offsetLeft);
            let disY = (e.clientY - odiv.offsetTop);
            document.onmousemove = (e)=>{  
                console.log("移动")
                 //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                //因为img居中对齐，所以还要减去目标元素距离body的偏移量
                let left = e.clientX - disX - odiv.offsetLeft;    
                let top = e.clientY - disY;
                //移动当前元素
                odiv.style.left = left + 'px';
                odiv.style.top = top + 'px';
            };
            document.onmouseup = (e) => {
                console.log("停止")
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    },
}
</script>

<style lang='less' scoped>
.left-tree{
    background: #3d3f44;color:#fff;float:left;height:calc(100% - 160px);
    .el-input{
        text-align: center;
        padding:5px 0;
    }
    /deep/.el-input__inner{
        background-color: rgb(44,46,48);
    }
}
.site-tabs{
    position: relative;
    /deep/.el-tabs{
        width:220px;position: absolute;left:0;right:0;margin:auto;top:0;
    }
    /deep/.el-tabs__nav-wrap::after{
        height:0;
    }
    /deep/.el-tabs__active-bar{
        height: 0;;
    }   
}
 .small-btn{
        width:80px;height:36px;background:rgb(32, 52, 49);border:solid 1px rgb(121,121,121);color:#fff;
        border-radius: 5px;
        cursor: pointer;
    }
    /deep/.left-tree .el-tree{
    background: #2C2E30;color:#fff;user-select: none;
}
/deep/.site-tabs-ul .el-tabs__item{
    font-size: 18px;;
}
/deep/.el-table tbody tr:hover>td{
    background: #3d3f44 !important;
}
.table-btn{
    color:#f00;
    text-decoration: underline;
}
.main-area{
    width:calc(100% - 300px);
    float: right;
}
/deep/.el-button+.el-button{
    margin-left:0;
}
.table-content{
    height:calc(100% - 100px);
    position: relative;
    .device-name,.point-name{
        width:150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /deep/.cell {
        white-space: nowrap;
    }
}
/deep/.el-pagination {
    position: absolute;text-align: center;
    bottom: 0;left:0;right:0;margin:0 auto;
    .el-input__inner{
        background: #2C2E30;
        border:0;color:#fff;
    }
    .btn-prev,.btn-next{
        background: #2C2E30;
    }
    .el-pager li{
         background: #2C2E30;
    }
}
.tree-div{
    height:calc(100% - 40px)
}
/deep/.el-loading-text{color:#fff;}
</style>
