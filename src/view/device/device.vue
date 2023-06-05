<template>
    <div  style="height: 100%">
        <div class="z-block search-block">
                <div >
                    主机档案导入
                    <el-input
                        style="width: 300px;"
                        placeholder="导入.CSV格式档案数据文件"
                    ></el-input>
                    <el-upload class="upload-demo" ref="upload"  :http-request="uploadFunction"
                    :show-file-list="false" action="string" accept=".xls,.xlsx">
                        <el-button size="small" type="primary">导入</el-button>
                    </el-upload>
                    <el-button size="small" type="primary"><a href="http://114.116.8.127:7099/customer_resource/网关导入模版.xlsx">模板导出</a></el-button>

                </div>
                <el-form :inline="true" ref="form" :model="searchForm" label-width="80px" style="margin-top:15px;">
                    <span style="height:40px;line-height: 40px;display:inline-block;">主机档案导出</span>
                    <el-form-item label="公司名称">
                        <el-select v-model="exportForm.customer_id" placeholder="请选择" @change="setValue" clearable>
                            <el-option
                                v-for="item in customerList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>                
                    </el-form-item>
                    <el-form-item label="站点名称">
                        <el-select v-model="exportForm.site_id" placeholder="请选择" multiple>
                        <el-option
                                v-for="item in siteList"
                                :key="item._id"
                                :label="item.name"
                                :value="item._id">
                            </el-option>
                        </el-select>
                    </el-form-item>                 
                    <!-- <el-form-item label="传感器类型：">
                        <el-select v-model="exportForm.type" placeholder="传感器类型">
                            <el-option label="AE" value="AE"></el-option>
                            <el-option label="TEV" value="TEV"></el-option>
                            <el-option label="UHF" value="UHF"></el-option>

                            <el-option label="MECH" value="MECH"></el-option>
                            <el-option label="HFCT" value="HFCT"></el-option>
                            <el-option label="OZONE" value="OZONE"></el-option>
                            <el-option label="VIBRATION" value="VIBRATION"></el-option>
                            <el-option label="DEVTEMP" value="DEVTEMP"></el-option>
                            <el-option label="ENVTEMP" value="ENVTEMP"></el-option>
                            <el-option label="ENVTH" value="ENVTH"></el-option>

                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button size="small" type="primary" @click="onExport">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>
        <div style="display: flex;height: calc(100% - 141px);margin-top:10px;">
            
            <div class="z-block file-menu">
                <div class="block-title">设备导航</div>
                <div style="height:calc(100% - 50px);position:relative">
                    <tree ref="tree" :type="'device'" :data="treeData" @del="del" @clickNode="clickNode"></tree>
                    <div class="tree-button">
                        <el-button type="primary" @click="add">新增主机</el-button>
                    </div>
                </div>
            </div>
            <div class="z-block menu-info">
                <div style="background:#fff;">
                    <div class="block-title">主机信息和配置</div>
                    <!-- <el-button-group>
                        <el-button type="primary" @click="addDevice">新建主机</el-button>
                    </el-button-group> -->
                    <el-table :data="deviceData" style="width: 100%" @row-click="selectDevice">
                        <el-table-column prop="name" label="主机名称" ></el-table-column>
                        <el-table-column prop="client_number" label="主机编号" ></el-table-column>
                        <el-table-column prop="name" label="网络状态">
                            <template>
                                <div>正常</div>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="name" label="最后上传数据时间" width="160"></el-table-column>
                        <el-table-column prop="name" label="最后连接时间"  width="160"></el-table-column> -->
                        <!-- <el-table-column prop="name" label="SIM卡号"></el-table-column>
                        <el-table-column prop="name" label="SIM卡流量"></el-table-column>
                        <el-table-column prop="name" label="硬件版本"></el-table-column>
                        <el-table-column prop="name" label="固件版本"></el-table-column> -->
                        <el-table-column label="操作" width="200">
                             <template slot-scope="scope">                          
                                <el-button type="text" @click.stop="add(scope.row,2)">配置</el-button>
                                <el-button type="text" @click="details(scope.row,$event)">详情</el-button>
                                <el-button type="text" @click="publishSensors(scope.row,$event)">传感器</el-button>
                                <el-button type="text" @click="publishSensors(scope.row,$event,true)">刷新</el-button>
                            </template>
                            
                        </el-table-column>
                    </el-table>
                </div>   
                
                <div style="margin-top:10px;background:#fff;">
                    <div class="block-title">传感器详情</div>
                    <el-form :inline="true" ref="form" :model="searchForm" label-width="80px" style="margin-top:15px;">
                        <el-form-item label="传感器名称" prop="name">
                            <el-input v-model="searchForm.name" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="传感器编号" prop="client_number">
                            <el-input v-model="searchForm.client_number" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="网络状态" prop="is_online">
                            <el-select v-model="searchForm.is_online" placeholder="请选择" style="width:206px" clearable>
                                <el-option label="在线" value="true"></el-option>
                                <el-option label="离线" value="false"></el-option>
                            </el-select>
                            <!-- <el-input v-model="searchForm.is_online" placeholder="请选择"></el-input> -->
                        </el-form-item>
                         <el-form-item label="传感器类型" prop="sensor_type">
                            <!-- <el-input v-model="searchForm.sensor_type" placeholder="请选择"></el-input> -->
                            <el-select v-model="searchForm.sensor_type" placeholder="传感器类型"  style="width:206px">
                                <el-option label="AE" value="AE"></el-option>
                                <el-option label="TEV" value="TEV"></el-option>
                                <el-option label="TEMP" value="TEMP"></el-option>
                                <el-option label="UHF" value="UHF"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" @click="search">查询</el-button>
                            <el-button size="small" @click="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :data="sensorData" style="width: 100%"  v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)" >
                        <el-table-column prop="name" label="传感器名称"></el-table-column>
                        <el-table-column prop="sensor_type" label="传感器类型"></el-table-column>
                        <el-table-column prop="sensor_id" label="传感器编号"></el-table-column>
                        <el-table-column prop="is_online" label="网络状态" >
                            <template slot-scope="props">
                                <p>{{props.row.is_online?'在线':'离线'}}</p>        
                            </template>  
                        </el-table-column>
                         <!-- <el-table-column prop="card" label="电量(%)" width="70px"></el-table-column>
                         <el-table-column prop="card" label="信号信噪比"  width="110px"></el-table-column>
                        <el-table-column prop="card" label="信号强度"></el-table-column> --> 
                         <el-table-column width="160" prop="update_time" align="center" label="最后上传数据时间"></el-table-column>                     
                        <!-- <el-table-column prop="card" label="硬件版本"></el-table-column>
                        <el-table-column prop="card" label="固件版本"></el-table-column> -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="setSensor(scope.row)">配置</el-button>
                                <el-button type="text" @click="sensorDetails(scope.row)">详情</el-button>
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
         <el-dialog title="主机详情" :visible.sync="showDetails" class="dialog-box" width="500px" :close-on-click-modal="false">
            <div v-if="showDetails">
                <el-row>
                    <el-col :span="5"><div class="grid-content bg-purple">公司名称：</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{detailsData.customer_name}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5"><div class="grid-content bg-purple">站点名称：</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{detailsData.site_name}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5"><div class="grid-content bg-purple">主机编号：</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{detailsData.client_number}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5"><div class="grid-content bg-purple">时间校准：</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{detailsData.version_structure}}</div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="5"><div class="grid-content bg-purple">备注：</div></el-col>
                    <el-col :span="12"><div class="grid-content bg-purple-light">{{detailsData.remarks}}</div></el-col>
                </el-row>
            </div>
        </el-dialog>
         <el-dialog :title="dialogTitle+'主机'" :visible.sync="addDeviceDialog" class="dialog-box" :before-close="handleClose" width="500px" :close-on-click-modal="false">
            <el-form :model="deviceForm" :rules="deviceRules" label-width="90px" ref="deviceForm" class="deviceForm"> 
                <el-form-item label="主机名称" prop="name">
                    <el-input v-model="deviceForm.name"></el-input>
                </el-form-item>                             
                <el-form-item label="公司名称" prop="customer">
                    <el-select v-model="deviceForm.customer" placeholder="请选择" @change="setValue">
                        <el-option
                            v-for="item in customerList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="站点名称" prop="site_id">
                    <el-select v-model="deviceForm.site_id" placeholder="请选择">
                       <el-option
                            v-for="item in siteList"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主机编号" prop="client_number">
                    <el-input v-model="deviceForm.client_number" :disabled="actionType=='edit'"></el-input>                   
                </el-form-item>
                <el-form-item label="时间校准" prop="time_adjusting">
                    <!-- <el-input v-model="deviceForm.time_adjusting"></el-input>     -->
                    <el-date-picker
                        v-model="deviceForm.time_adjusting"
                        type="datetime"
                        value-format='timestamp'
                        placeholder="选择日期时间">
                    </el-date-picker>               
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="deviceForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button type="primary" @click="saveDevice('deviceForm')">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="参数配置" :visible.sync="setSensorDialog" class="dialog-box" width="500px">
            <el-form :model="clientForm" :rules="rules" label-width="90px"> 
                <el-form-item label="传感器名称" prop="name">
                    <el-input v-model="clientForm.name" disabled></el-input>
                </el-form-item> 
                 <el-form-item label="传感器编号" prop="name">
                    <el-input v-model="clientForm.client_number" disabled></el-input>
                </el-form-item> 
                 <el-form-item label="采集周期" prop="name">
                    <el-input v-model="clientForm.acq_period"></el-input>
                    <el-select v-model="acqPeriod" placeholder="请选择" @change="changePeriod">
                        <el-option
                        v-for="item in periodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>           
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="saveBatch">同种批量应用</el-button>
                <el-button @click="setSensorDialog = false">取 消</el-button>
                <el-button type="primary" @click="saveSetSensorDialog">保 存</el-button>
            </div>
        </el-dialog>
         <div  v-if="showChartDetails" >
            <chartDetails  :visible.sync="showChartDetails" :dataDetails="dataDetails"></chartDetails>
        </div> 
    </div>
</template>

<script>
import tree from "@/components/tree.vue";
import * as account from '@/data/api.js'
import * as device from '@/data/device.js'
import * as api from '@/data/api.js'
import request from 'axios'
export default {
    name: "deviceManager",
    components: {
        tree,
         chartDetails:resolve => {require(['../site/chartDetails.vue'], resolve)},
    },
    data() {
        return {
            treeData:[],
            tableTitle:'主机信息和配置',//'传感器详情'
            deviceData:[],
            sensorData: [],
            addDeviceDialog:false,
            setSensorDialog:false,
            deviceForm:{
                name:'',
                customer:'',
                site_id:'',
                client_number:'',                
                time_adjusting:'',
                remarks:'',
            },
            rules:{},
            deviceRules:{
                name: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
                customer:[{ required: true, message: '请选择公司', trigger: 'blur' }],
                site_id:[{ required: true, message: '请选择站点', trigger: 'blur' }],
                client_number: [{ required: true, message: '请输入主机编号', trigger: 'blur' }],
                time_adjusting: [{ required: true, message: '请选择时间', trigger: 'blur' }],
            },
            customerList:[],
            siteList:[],
            dialogTitle:'新增',
            showDetails:false,
            detailsData:'',
            actionType:'',
            searchForm: {
                name: "",
                client_number: "",
                is_online: "",
                sensor_type:""
            },
            currentGatewayId:'',//当前点击的主机，查询其下传感器时用到
            showChartDetails:false,
            dataDetails:[],
            loading: false,
            selectSensorInfo: {},
            clientForm: {
                name: '',
                client_number: '',
                acq_period:0
            },
            exportForm: {
                customer_id: '',
                site_id:'',
            },
            periodOptions: [
                { value: 0, label: 'S' },
                { value: 1, label: 'Min' },
                { value: 2, label: 'H' },                
            ],
            acqPeriod: 0,
            currentPage:1,
            size:10,
            total:0,
        };
    },
    mounted() {
        this.getTreeData();
        this.getCustomerList();
    },

    methods: {
        handleSizeChange(val){
            this.size = val;
            this.selectDevice(this.selectSensorInfo);
            // this.getUserList();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.selectDevice(this.selectSensorInfo);
        },
        changePeriod() { },
        saveSetSensorDialog(){
            let timeStep = [1,60,3600]
            let acqPeriodValue = this.clientForm.acq_period * timeStep[this.acqPeriod]
            console.log(acqPeriodValue,999);
            let params = {client_number:this.clientForm.client_number,sensor_id:this.clientForm.sensor_id,params:{acq_period:acqPeriodValue}}
            device.setSensorTiming(params).then(res=>{
                this.$message({type:'success', message: '修改成功'});
                this.setSensorDialog = false;
            })
        },
        saveBatch(){
            let timeStep = [1,60,3600]
            let acqPeriodValue = this.clientForm.acq_period * timeStep[this.acqPeriod]
            let params = {
                sensor_id:this.clientForm.sensor_id,
                sensor_type:this.clientForm.sensor_type,
                acq_period:acqPeriodValue
            }
            device.setBatch(params).then(res=>{
                console.log(res,'同种批量');
            })
        },
        uploadFunction(item){
            let formData = new FormData();
            formData.append('file',item.file);
            device.importFile({
                data:formData
            }).then(res=>{
                this.$message({type:'success', message: '导入成功'});
                this.getTreeData();
            })
        },
        onExport() { 
            console.log(this.exportForm, 555);
            let {customer_id,site_id,type} = this.exportForm
            let params = {
                customer_id:customer_id,
                site_id: site_id,
                // type:type
            }
            device.exportData(params).then(res => {
                console.log(res, '导出');
                
            })
        },
        exportMethod (data) {
            return request({
                method: data.method,
                url: `${data.url}${data.params ? '?' + data.params : ''}`,
                responseType: 'blob'
            }).then((res) => {
                const link = document.createElement('a')
                let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob)
            //  link.download = res.headers['content-disposition'] //下载后文件名
            //  link.setAttribute('download', apis[this.activeName - 0].name + '.xlsx')
                link.download = data.fileName //下载的文件名
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }).catch(error => {
                console.log(error)
            })
        },
        add(obj,n){
            this.addDevice();
            if(n==2){
                this.actionType = 'edit'
                this.dialogTitle = '修改';
                this.details(obj)
            }
            else{this.dialogTitle = '新增';this.actionType = 'add'}            
        },
        del(v){
            this.$confirm('是否清除当前位置的后台数据?【取消删除请点击右上角 X 】', '提示', {
                confirmButtonText: '清除',
                cancelButtonText: '不清除',
                distinguishCancelAndClose:true,
                type: 'warning'
            }).then(() => {
                this.deleteAction(v,true)               
            }).catch((action) => {
                if(action =='cancel'){
                    this.deleteAction(v,false)
                }else{
                    this.$message({type:'info',message:'已取消删除'}); 
                }
                        
            }); 
        },
        deleteAction(v,n){
            device.delGateway({gateway_id:v.id,isClear:n}).then(res=>{
                this.$message({type:'success', message: '已删除成功'});  
                this.getTreeData();
            })
        },
        publishSensors(v,e,frash){
            e.stopPropagation();
            let This = this
            device.publishSensors({gateway_id:v.gateway_id}).then(res=>{
                console.log(res,'res');
                this.$message({ type: 'success', message: '获取传感器列表成功！' }); 
                frash && setTimeout(This.querySensorList(v.gateway_id),1000)
                // this.querySensorList(v.gateway_id)
                // this.selectDevice(v);
            })
        },
        details(v,e){
            this.detailsData = {};
            if(e){
                this.showDetails = true;
            }            
            // e.stopPropagation();          
            device.gatewayDetails({gateway_id:v.gateway_id}).then(res=>{
                this.detailsData = res.data;
                this.valueAssign(this.deviceForm,res.data);
                this.getSiteList(res.data.customer);
            })
        },
        valueAssign(obja,objb){
            //objb 给对象 obja赋值
            Object.keys(obja).forEach(key => { obja[key] = objb[key] || obja[key]});
        },  
        clickNode(v){
            if(v.type !="site") return;
            device.siteGateways({site_id:v.id}).then(res=>{
                this.deviceData = res.data;
                this.sensorData = [];
            })    
        },
         getTreeData(){
            device.queryDeviceTree().then(res=>{
                if(!res) return;
                this.treeData = res.data;
                this.clickNode(res.data[0].children[0])                 
            })
        },
        addDevice(){
            this.addDeviceDialog = true;
        },
        setSensor(row) {
            this.selectSensorInfo = row
            this.clientForm.name = row.name;
            this.clientForm.client_number = row.client_number;
            this.clientForm.sensor_id = row.sensor_id;
            this.clientForm.sensor_type = row.sensor_type;
            this.setSensorDialog = true;
            //获取采集时间间隔接口
            this.getSensorTiming(row)
        },
        getSensorTiming(row) { 
            let params = { client_number: row.client_number, sensor_id: row.sensor_id }
            device.querySensorTiming(params).then(res => {
                console.log(res, 121);
                this.clientForm.acq_period = res.data.acq_period
            })
        },
        selectDevice(row) {
            this.selectSensorInfo = row
            this.currentGatewayId = row.gateway_id
            this.querySensorList(row.gateway_id)
        },
        querySensorList(id,form){
            let params = form ? { gateway_id: id, searchForm: form,page:this.currentPage,limit:this.size } : Object.assign({}, { gateway_id: id,page:this.currentPage,limit:this.size})
            device.getSensorList(params).then(res=>{
                this.sensorData = res.data.sensor_info;
                this.total = res.data.total;
            })
        },
        search(){
            this.querySensorList(this.currentGatewayId,this.searchForm)
        },
        reset(){
            this.$refs.form.resetFields();
            this.querySensorList(this.currentGatewayId)
        },
        getCustomerList(){
            account.getCustomerList(this.userForm).then(res=>{
                this.customerList = res.data.customers;
                this.exportForm.customer_id = this.customerList[0].id,
                this. getSiteList(this.exportForm.customer_id)
                console.log(this.customerList,'customerList');
            })
        },
        setValue(v){
            this.getSiteList(v)
        },
         getSiteList(id){
            account.siteRequest(id,'get').then(res=>{
                this.siteList = res.data.sites;
            })
        },
        saveDevice(form){
            console.log(this.deviceForm,'form');
             this.$refs[form].validate((valid) => {
                if (valid) {
                    this.deviceForm.time_adjusting = parseInt(Number(this.deviceForm.time_adjusting)/100)
                    if(this.actionType=='add'){
                        device.addDevice({site_id:this.deviceForm.sites,params:this.deviceForm}).then(res=>{
                            console.log(res,'device');
                            this.clearForm()
                            this.addDeviceDialog = false;
                            this.$message({type: 'success',message: '添加成功'});  
                            this.getTreeData();
                        },err=>{
                            console.log(err,'errrr');
                        })
                    }else{
                        device.editDevice({gateway_id:this.detailsData._id,params:this.deviceForm}).then(res=>{
                            console.log(res,'device');
                            this.clearForm()
                            this.addDeviceDialog = false;
                            this.$message({type: 'success',message: '修改成功'});  
                            this.getTreeData();
                        })
                    }
                }else{
                    return false
                }
            })                       
        },
        cancelDialog(){
            this.clearForm();
            this.addDeviceDialog = false
        },
        
        sensorDetails(obj){
            this.showChartDetails = true;
             this.dataDetails = [
                 {type:obj.sensor_type,sensor_info:obj.sensor_info,point_id:obj.sensor_id,sensor_data_id:obj.sensor_data_id,sensor_type:obj.sensor_type}
             ];
        },
        handleClose(done){
            this.clearForm();
            done();
        },
        clearForm(){
            for(let i in this.deviceForm){
                this.deviceForm[i] = '';
            }           
        }
    },
};
</script>

<style lang='less' scoped>
.tree-button{
    position: absolute;right:10px;bottom: 10px;
}
/deep/.el-form-item{
    margin-bottom:8px;
}
/deep/.el-table th.el-table__cell.is-leaf{
    background: #FAFAFA !important;
}
.grid-content{
    height:26px;
}
/deep/.el-dialog__body{
    padding-bottom: 30px;
}
/deep/.el-form-item__label{
    width:100px !important;
}
/deep/.dialog-box .el-form-item__content{
   margin-left:100px !important;
}
/deep/.el-form-item:last-child .el-form-item__content>.el-input{
    width:calc(100% - 100px)
}
/deep/.el-form-item:last-child .el-form-item__content .el-select{
    width:90px;
    .el-input__suffix{
        right:-24px;width:100%;
        input{
            width:90px;
        }
    }
}
.el-pagination{
    text-align: right;
}
.deviceForm {
    /deep/.el-form-item{
        margin-bottom:20px;
    }
}
</style>
