<template>
   <div style="height:100%;display:flex;"> 
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
                <tree :type="'site'" :data="treeData" @clickNode="clickNode" ref="trees" v-if="treeData.length!=0"></tree>
            </div>            
        </div>
        <div class="main-area">
            <div class="sub-tabs warning-tabs">
                <el-tabs v-model="activeTab"  class="site-tabs-ul">
                    <el-tab-pane label="测点报警" name="chart"></el-tab-pane>
                    <el-tab-pane label="传感器报警" name="list"></el-tab-pane>
                </el-tabs>
            </div>
            <div v-if="activeTab == 'list'">
                <div class="search-content">
                    <el-form ref="form" :model="form" label-width="80px"  :inline="true" class="site-form">
                        <el-col :span="14">
                            <el-col :span="24">
                                <el-form-item label="时间范围" required>
                                    <el-date-picker  v-model="dataRange"     
                                        @change="selectDate"                        
                                        type="datetimerange" 
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                   <!--  <el-col :span="11">
                                    <el-form-item prop="date1">
                                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                    </el-col>
                                    <el-col class="line" :span="2">-</el-col>
                                    <el-col :span="11">
                                    <el-form-item prop="date2">
                                        <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                                    </el-form-item>
                                    </el-col> -->
                                </el-form-item>                       
                            </el-col>
                        </el-col>
                        <el-col :span="14">
                            <el-col :span="12">
                                <el-form-item label="报警状态">
                                    <el-select v-model="form.region" placeholder="请选择">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理情况">
                                <el-select v-model="form.region" placeholder="请选择">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>                        
                        </el-col>                
                        <el-form-item  class='btn-group'>
                            <el-button size="small" type="primary">查询</el-button>
                            <el-button size="small">重置</el-button>
                            <el-button size="small">批量确认</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-content">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
                        <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
                        <el-table-column align="center" prop="name"  width="200" label="设备名称" ></el-table-column>
                        <el-table-column prop="description" align="center" label="测点名称"></el-table-column>
                        <el-table-column align="center" prop="state" label="传感器类型" ></el-table-column>
                        <el-table-column prop="warningTime" align="center"  width="200"  label="报警时间"></el-table-column>
                        <el-table-column align="center" prop="state" label="报警状态" ></el-table-column>
                        <el-table-column prop="description" align="center" label="状态描述"></el-table-column>
                        <el-table-column prop="operator" align="center" label="处理情况"></el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="details">确认</el-button>                       
                                <el-button type="text" size="mini" @click="showChart">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div v-if="activeTab == 'chart'" style="font-size:30px;text-align:center;">
                <div class="search-content">
                    <el-form ref="form" :model="form" label-width="80px"  :inline="true" class="site-form">
                        <el-col :span="14">
                            <el-col :span="24">
                                <el-form-item label="活动时间" required>
                                    <el-col :span="11">
                                    <el-form-item prop="date1">
                                        <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                                    </el-form-item>
                                    </el-col>
                                    <el-col class="line" :span="2">-</el-col>
                                    <el-col :span="11">
                                    <el-form-item prop="date2">
                                        <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                                    </el-form-item>
                                    </el-col>
                                </el-form-item>                       
                            </el-col>
                        </el-col>
                        <el-col :span="14">
                            <el-col :span="12">
                                <el-form-item label="报警状态">
                                    <el-select v-model="form.region" placeholder="请选择">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理情况">
                                <el-select v-model="form.region" placeholder="请选择">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>                        
                        </el-col>                
                        <el-form-item  class='btn-group'>
                            <el-button size="small" type="primary">查询</el-button>
                            <el-button size="small">重置</el-button>
                            <el-button size="small">批量确认</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-content">
                    <el-table :data="tableData" style="width: 100%">
                        <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
                        <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
                        <el-table-column align="center" prop="name"  width="200" label="设备名称" ></el-table-column>
                        <el-table-column prop="description" align="center" label="测点名称"></el-table-column>
                        <el-table-column align="center" prop="state" label="传感器类型" ></el-table-column>
                        <el-table-column prop="warningTime" align="center"  width="200"  label="报警时间"></el-table-column>
                        <el-table-column align="center" prop="state" label="报警状态" ></el-table-column>
                        <el-table-column prop="description" align="center" label="状态描述"></el-table-column>
                        <el-table-column prop="operator" align="center" label="处理情况"></el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="details">确认</el-button>                       
                                <el-button type="text" size="mini" @click="showChart">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>                        
            </div>
        </div>
        <div v-if="showDetails">
            <Details :visible.sync="showDetails"></Details>
        </div>
       
        
   </div>
</template>

<script>
 import tree from '@/components/tree.vue'
 import * as device from '@/data/device.js'
   export default {
       name:'',
       components:{
        tree,
        Details:resolve => {require(['./details.vue'], resolve)},
       },
       data(){
           return {
                treeData:[],
                showSearchBox:false,
                isFold:false,
                isFoldClass:'el-icon-s-fold',
                tableData: [{
                    state: '已确认',
                    name:'长沙出线间隔A相刀闸',
                    description: '描述',
                    warningTime: '2021-09-11 01:50:20',
                    ensureTime:'2021-09-11 01:52:20',
                    operator:'张三',
                },{
                    state: '已确认',
                    name:'长沙出线间隔A相刀闸',
                    description: '描述',
                    warningTime: '2021-09-11 01:50:20',
                    ensureTime:'2021-09-11 01:52:20',
                    operator:'张三',
                },] ,
                form: {
                    name: '',
                    region: '', 
                    date1:'',
                    date2:'', 
                },
                activeTab:'list',
               showDetails: false,
               dataRange:[],
               searchForm:{
                    "alarm_type": 0,
                    "sensor_type": "",
                    "start_date": "",
                    "end_data": "",
                    "alarm_level": 1, 
                    "is_processed": '',
                }
           }
       },
       mounted(){
        this.getTreeData();
       },

    methods: {
        selectDate() {
            this.searchForm.start_date = this.formatDate(this.dataRange[0])
            this.searchForm.end_date = this.formatDate(this.dataRange[1]);
        },
        clickNode(v){},
        showSearch(){},
        toggle(v){},
        getTreeData(){
            device.queryDeviceTree().then(res=>{
                if(!res) return;
                this.treeData = res.data;
                this.clickNode(res.data[0].children[0])                 
            })
        },
        getSiteList() {
            device.siteAlarmList().then(res => {
                
            })
        },
        getEquipmentList() { 
            device.equipmentAlarmList().then(res => {
                
            })
        },
        details(row){
            this.showDetails = true;
        },
        showChart(){
            
        }
       }
   }
</script>

<style lang='less' scoped>
    .el-form-item{
        margin-bottom:0;
    }
    .left-tree{
        background:#212325;
        color:#fff;
    }
    .btn-group{
        float:right;
    }
    .el-button--small{
        padding:9px 35px;
    }
    .main-area{
        width:calc(100% - 300px);
        float: right;
    }
    /deep/.left-tree .el-tree{
        background: #2C2E30;color:#fff;user-select: none;
    }
    /deep/.warning-tabs{
        width:100%;text-align: center;position:relative
    }
     /deep/.el-tabs{
        width:270px;position: absolute;left:0;right:0;margin:auto;top:0;
    }
    /deep/.el-tabs__nav-wrap::after{
        height:0;
    }
    /deep/.el-tabs__active-bar{
        height: 0;;
    } 
    /deep/.el-tabs__item{
    font-size: 18px;background:#2C2E30;margin-right:2px;width:130px;padding:0;
}  
</style>

