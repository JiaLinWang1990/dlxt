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
                <el-tabs v-model="activeTab"  class="site-tabs-ul" @tab-click="clickTabs">
                    <el-tab-pane label="测点报警" name="chart"></el-tab-pane>
                    <el-tab-pane label="传感器报警" name="list"></el-tab-pane>
                </el-tabs>
            </div>
            <div v-if="activeTab == 'list'" style="height:calc(100% - 50px);">
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
                                </el-form-item>                       
                            </el-col>
                        </el-col>
                        <el-col :span="14">
                            <el-col :span="12">
                                <el-form-item label="报警状态">
                                    <el-select v-model="searchForm.alarm_level" placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="预警" value="1"></el-option>
                                        <el-option label="报警" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理情况">
                                    <el-select v-model="searchForm.is_processed" placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="已处理" value="true"></el-option>
                                        <el-option label="未处理" value="false"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>                        
                        </el-col>                
                        <el-form-item  class='btn-group'>
                            <el-button size="small" type="primary" @click="queryList">查询</el-button>
                            <el-button size="small"  @click="reset">重置</el-button>
                            <el-button size="small">批量确认</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-content">
                    <el-table :data="tableData" style="width: 100%"  v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)">
                        <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
                        <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
                        <el-table-column align="center" prop="equipment_name"  width="200" label="设备名称" ></el-table-column>
                        <el-table-column prop="point_name" align="center" label="测点名称"></el-table-column>
                        <el-table-column align="center" prop="sensor_type" label="传感器类型" ></el-table-column>
                        <el-table-column prop="update_time" align="center"  width="200"  label="报警时间"></el-table-column>
                        <el-table-column align="center" label="报警状态" >
                            <template slot-scope="props">
                                <p>{{alarmLevel[props.row.alarm_level]}}</p>   
                            </template>
                        </el-table-column>
                        <el-table-column prop="alarm_describe" align="center" width="200"  label="状态描述"></el-table-column>
                        <el-table-column prop="operator" align="center" label="处理情况">
                            <template slot-scope="props">
                                <p>{{props.row.is_processed?'已处理':'未处理'}}</p>   
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="handle(scope.row)">确认</el-button>                       
                                <!-- <el-button type="text" size="mini" @click="showChart">查看</el-button> -->
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
            <div v-if="activeTab == 'chart'" style="font-size:30px;height:calc(100% - 50px);">
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
                                </el-form-item>                   
                            </el-col>
                        </el-col>
                        <el-col :span="14">
                            <el-col :span="12">
                                <el-form-item label="报警状态">
                                    <el-select v-model="searchForm.alarm_level" placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="预警" value="1"></el-option>
                                        <el-option label="报警" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理情况">
                                    <el-select v-model="searchForm.is_processed" placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="已处理" value="true"></el-option>
                                        <el-option label="未处理" value="false"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>                        
                        </el-col>                
                        <el-form-item  class='btn-group'>
                            <el-button size="small" type="primary"  @click="queryList">查询</el-button>
                            <el-button size="small">重置</el-button>
                            <!-- <el-button size="small">批量确认</el-button> -->
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table-content">
                    <el-table :data="tableData" style="width: 100%"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)">
                        <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
                        <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
                        <el-table-column align="center" prop="equipment_name"  width="200" label="设备名称" ></el-table-column>
                        <el-table-column prop="point_name" align="center" label="测点名称"></el-table-column>
                        <el-table-column align="center" prop="sensor_type" label="传感器类型" ></el-table-column>
                        <el-table-column prop="update_time" align="center"  width="200"  label="报警时间"></el-table-column>
                        <el-table-column align="center" label="报警状态" >
                            <template slot-scope="props">
                            <p>{{alarmLevel[props.row.alarm_level]}}</p>   
                        </template>
                        </el-table-column>
                        <el-table-column prop="alarm_describe" align="center" width="200"  label="状态描述"></el-table-column>
                        <el-table-column prop="operator" align="center" label="处理情况">
                            <template slot-scope="props">
                                <p>{{props.row.is_processed?'已处理':'未处理'}}</p>   
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="handle(scope.row)">确认</el-button>                       
                                <el-button type="text" size="mini" @click="showChart(scope.row)">查看</el-button>
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
        </div>
        <div v-if="showDetails">
            <Details :visible.sync="showDetails" :detailsInfo="detailsInfo" @clickNode="clickNode"></Details>
        </div>
        <div  v-if="showChartDetails" >
            <chartDetails  :visible.sync="showChartDetails" :dataDetails="dataDetails"></chartDetails>
        </div>
        
   </div>
</template>

<script>
import tree from '@/components/tree.vue'
import * as warning from '@/data/warning.js'
import * as device from '@/data/device.js'
import Bus from "@/util/Bus.js";

   export default {
       name:'',
       components:{
            tree,
            Details: resolve => { require(['./details.vue'], resolve) },
            chartDetails:resolve => {require(['../site/chartDetails.vue'], resolve)},
       },
       data(){
           return {
                treeData:[],
                showSearchBox:false,
                isFold:false,
                isFoldClass:'el-icon-s-fold',
                tableData: [] ,
                form: {
                    name: '',
                    region: '', 
                    date1:'',
                    date2:'', 
                },
                activeTab:'chart',
               showDetails: false,
               dataRange:[],
               loading: false,
               alarmLevel: ['正常', '预警', '报警'],
               detailsInfo: {},
               currentNodeInfo: {},
               searchForm:{
                    "alarm_type": 2,
                    "sensor_type": "",
                    "start_date": "",
                    "end_data": "",
                    "alarm_level": "", 
                    "is_processed": '',
               },
               showChartDetails: false,
               dataDetails:{},
               currentPage:1,
                size:10,
               total: 0,  
                testObj : {
                    "msg": "",
                    "code": 20001,
                    "data": {
                        "alarm_broadcast": true,
                        "latest3_alarm": true,
                        "customer_id": "635b836dde618adbcf271125",
                        "site_id": "635b836dde618adbcf271126",
                        "equipment_id": "635b836dde618adbcf271127",
                        "point_id": "635b836dde618adbcf271128",
                        "sensor_data": {
                            "_id": "6372f61598ca5fd489f7fc14",
                            "sensor_type": "AE",
                            "client_number": "8E00130200000100",
                            "sensor_id": "584e500400200002",
                            "is_latest": true,
                            "is_online": true,
                            "customer_id": "635b836dde618adbcf271125",
                            "site_id": "635b836dde618adbcf271126",
                            "equipment_id": "635b836dde618adbcf271127",
                            "point_id": "635b836dde618adbcf271128",
                            "battery": 78,
                            "rssi": -89,
                            "snr": 10,
                            "upload_interval": 600,
                            "srtc": 0,
                            "acq_t": 0,
                            "acq_period": 60,
                            "acq_toffset": 0,
                            "create_date": "2022-11-15 10:23:35",
                            "update_date": "2022-11-15 10:23:35",
                            "alarm_flag": 2,
                            "alarm_level": 2,
                            "alarm_describe": "悬浮放电221",
                            "maxvalue": -10,
                            "rmsvalue": "-2.60261368751526",
                            "harmonic1": -10,
                            "harmonic2": -10,
                            "gain": 100,
                            "sensor_data_id": "6372f61598ca5fd489f7fc14",
                            "character_value": -10
                        },
                        "alarm_data": {
                            "sensor_id": "584e500400200002",
                            "sensor_type": "AE",
                            "client_number": "8E00130200000100",
                            "is_latest": true,
                            "alarm_flag": 2,
                            "alarm_type": 2,
                            "alarm_level": 2,
                            "alarm_describe": "悬浮放电999",
                            "sensor_data_id": "6372f61598ca5fd489f7fc14",
                            "is_online": true,
                            "is_processed": false,
                            "create_date": "2022-11-15 10:23:35",
                            "update_date": "2022-11-15 10:23:35",
                            "customer_id": "635b836dde618adbcf271125",
                            "site_id": "635b836dde618adbcf271126",
                            "equipment_id": "635b836dde618adbcf271127",
                            "point_id": "635b836dde618adbcf271128",
                            "id": "6372f61598ca5fd489f7fc15"
                        },
                        "unprocessed_num": "23",
                        "abnormal_count_info": {
                            "customer_abnormal_info": {
                                "customer_day_abnormal_info": {
                                    "alarm_num": 2,
                                    "processed_num": 0
                                },
                                "customer_week_abnormal_info": {
                                    "alarm_num": 2,
                                    "processed_num": 0
                                },
                                "customer_month_abnormal_info": {
                                    "alarm_num": 5,
                                    "processed_num": 2
                                }
                            },
                            "site_abnormal_info": {
                                "site_day_abnormal_info": {
                                    "alarm_num": 2,
                                    "processed_num": 0
                                },
                                "site_week_abnormal_info": {
                                    "alarm_num": 2,
                                    "processed_num": 0
                                },
                                "site_month_abnormal_info": {
                                    "alarm_num": 5,
                                    "processed_num": 2
                                }
                            }
                        }
                    }
                }          
           }
       },
       mounted(){
           this.getTreeData();
           Bus.$on('wsData', target => {
               target = JSON.parse(target);
               let alarm_obj = target.message.data.alarm_data;
                this.updateListByWs(alarm_obj)         
            })
       },

    methods: {
        updateListByWs(obj) { 
            this.tableData.pop();
            this.tableData.unshift(obj)

        },
        handleSizeChange(val){
             this.size = val;
             this.queryList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.queryList();
        },
        clickTabs(tab){
            this.currentPage = 1;
            console.log(tab.label, tab.name, 555);            
            if (tab.name == 'chart') {
                this.searchForm.alarm_type = 2;                
            } else {
                this.searchForm.alarm_type = 1;                
            }
            this.clickNode(this.currentNodeInfo)
        },
        queryList() {
            Bus.$emit('wsData',JSON.stringify(this.testObj));
            // if(this.activeTab =='list'){
                if(this.currentNodeInfo.type=='site'){
                    this.getSiteList(this.currentNodeInfo.id)
                }else if(this.currentNodeInfo.type=='equipment'){
                    this.getEquipmentList(this.currentNodeInfo.id)
                }
                
            // }
        },
        reset() { 
            this.dataRange = [];
            this.searchForm.alarm_level = '';
            this.searchForm.is_processed = '';
            this.searchForm.start_date = '';
            this.searchForm.end_date = '';
            this.queryList();
        },
        selectDate() {
            if(this.dataRange){
                this.searchForm.start_date = this.formatDate(this.dataRange[0])
                this.searchForm.end_date = this.formatDate(this.dataRange[1]);
            }else{
                this.searchForm.start_date = this.searchForm.end_date = ""
            }
           },
        formatDate(date){
            //    if(!data) return;
            return date.getFullYear()+'-'+this.timeFormat(date.getMonth()+1)+'-'+this.timeFormat(date.getDate())+' '+this.timeFormat(date.getHours())+':'+this.timeFormat(date.getMinutes())+':'+this.timeFormat(date.getSeconds());
        },
        timeFormat(v){
            return v<10?'0'+v:v
        },
        clickNode(v) {
            this.currentPage = 1;
            let obj;
            if (!v) {
                obj = this.currentNodeInfo
            } else {
                obj = v;
                this.currentNodeInfo = v;
            }
            console.log(this.currentNodeInfo,666);
            if(obj.type=="site"){
                this.loading = true;
                this.getSiteList(obj.id)
            }else if(obj.type=="equipment"){
                this.loading = true;
                this.getEquipmentList(obj.id);             
            }    
        },
        showSearch(){},
        toggle(v){},
        getTreeData(){
            device.queryTree().then(res=>{
                if(!res) return;
                this.treeData = res.data;
                this.clickNode(res.data[0].children[0])                 
            })
        },
        getSiteList(id) {
            warning.siteAlarmList({site_id:id,data:Object.assign(this.searchForm, {page:this.currentPage,limit:this.size})}).then(res => {
                this.loading = false;
                this.tableData = res.data.alarm_list;
                this.total = res.data.total;  
            })
        },
        getEquipmentList(id) { 
            warning.equipmentAlarmList({equipments_id:id,data:Object.assign(this.searchForm, {page:this.currentPage,limit:this.size})}).then(res => {
                this.loading = false;
                this.tableData = res.data.alarm_list;
                this.total = res.data.total;  
            })
        },
        handle(row) {
            this.detailsInfo = row;
            this.showDetails = true;
        },
        showChart(row){
            this.dataDetails = [row];
            this.showChartDetails = true;
            console.log(row,'row')

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
     /deep/.site-tabs-ul.el-tabs{
        width:270px;position: absolute;left:0;right:0;margin:auto;top:0;
    }
    /deep/.el-tabs__nav-wrap::after{
        height:0;
    }
    /deep/.el-tabs__active-bar{
        height: 0;;
    } 
    /deep/.site-tabs-ul .el-tabs__item{
    font-size: 18px;background:#2C2E30;margin-right:2px;width:130px;padding:0;
    }  
    /deep/.el-table tbody tr:hover>td{
        background: #3d3f44 !important;
    }
    /deep/.el-range-input{
        background:transparent
    }
    /deep/.el-date-editor .el-range__close-icon{
        line-height:25px;
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
    .table-content{
        position: relative;
        height: calc(100% - 100px);
        .el-table{
            height:calc(100% - 40px);
            overflow: auto;
        }
    }
</style>

