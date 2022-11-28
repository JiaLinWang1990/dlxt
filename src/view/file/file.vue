<template>
    <div style="height: 100%">
        <div class="z-block search-block">
            <div v-if="[0,10].indexOf(userInfo.role_level)>-1">
                档案导入
                <el-input
                    v-model="searchForm.siteName"
                    style="width: 300px;"
                    placeholder="导入.CSV格式档案数据文件"
                ></el-input>
                <el-upload class="upload-demo" ref="upload"  :http-request="uploadFunction"
                 :show-file-list="false" action="string" accept=".xls,.xlsx">
                    <el-button size="small" type="primary">导入</el-button>
                </el-upload>
                <el-button size="small" type="primary"><a href="http://114.116.8.127:7099/customer_resource/云平台档案管理模版.xlsx">模板导出</a></el-button>
                <!-- <el-button size="small" style="margin-left:20px;" @click="onSubmit">导出</el-button> -->
            </div>
            <el-form :inline="true" ref="form" :model="searchForm" label-width="80px" style="margin-top:15px;">
                <span style="height:40px;line-height: 40px;display:inline-block;">档案导出</span>
                <el-form-item label="站点名称：">
                    <el-input v-model="searchForm.siteName" placeholder="请输入站点名称"></el-input>
                </el-form-item>
                <el-form-item label="公司名称：">
                    <el-input v-model="searchForm.company" placeholder="请输入公司名称"></el-input>
                </el-form-item>
                <el-form-item label="传感器类型：">
                    <el-select v-model="searchForm.degree" placeholder="电压等级">
                        <el-option label="10kV" value="10kV"></el-option>
                        <el-option label="20kV" value="20kV"></el-option>
                        <el-option label="35kV" value="35kV"></el-option>
                        <el-option label="35kV" value="35kV"></el-option>
                        <el-option label="110kV" value="110kV"></el-option>
                        <el-option label="220kV" value="220kV"></el-option>
                        <el-option label="330kV" value="330kV"></el-option>
                        <el-option label="500kV" value="500kV"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <!-- <el-button size="small" type="primary" @click="onSubmit">查询</el-button> -->
                    <el-button size="small" type="primary" @click="onSubmit">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-top: 20px;display: flex;height: calc(100% - 130px);">
            <div class="z-block file-menu">
                <div class="block-title">档案导航</div>
                <div style="height:calc(100% - 50px)">
                    <tree ref="tree" v-if="showTree"  :data="treeData" @add="add" @addChild="addChild" @del="del" @edit="edit"  @clickNode="clickNode"></tree>
                </div>
                <!-- <el-button size="small" type="primary" @click="add">新建</el-button>
                <el-button size="small">删除</el-button> -->
            </div>
            <div class="z-block menu-info">
                <div class="block-title">
                    <span>层级信息和配置</span>
                    <el-button style="float:right;" @click="handleOperate">编辑</el-button>
                </div>
                <div v-if="clickNodeDetailObj.type == 'customer'" class="details-info">
                    <p class="details-title">公司信息</p>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">公司名称</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.name}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">行政区域</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">
                            {{contentDetails.administrative_division?contentDetails.administrative_division.province+"-"+contentDetails.administrative_division.city+"-"+contentDetails.administrative_division.region:''}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">备注</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.remarks}}</div></el-col>
                    </el-row>                   
                </div>  
                <div v-if="clickNodeDetailObj.type == 'site'" class="details-info">
                    <p class="details-title">站点信息</p>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">站点名称</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.name}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">电压等级</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.voltage_level}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">行政区域</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">
                            {{contentDetails.administrative_division?contentDetails.administrative_division.province+"-"+contentDetails.administrative_division.city+"-"+contentDetails.administrative_division.region:''}}
                            </div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">站点坐标</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.site_location?contentDetails.site_location[0]+','+contentDetails.site_location[1]:''}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">备注</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.remarks}}</div></el-col>
                    </el-row>                   
                </div> 
                <div v-if="clickNodeDetailObj.type == 'equipment'" class="details-info">
                    <p class="details-title">设备信息</p>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">设备名称</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.device_name}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">设备类型</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.device_type}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">电压等级</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.voltage_level}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">运行编号</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.operation_number}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">资产编号</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.asset_number}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">设备型号</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.device_model}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">出厂编号</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.factory_number}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">备注</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.remarks}}</div></el-col>
                    </el-row>                   
                </div>
                <div v-if="clickNodeDetailObj.type == 'point'" class="details-info">
                    <p class="details-title">测点信息</p>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">测点名称</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.measure_name}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">传感器编号</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.sensor_number}}</div></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">测点类型</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.measure_type}}</div></el-col>
                    </el-row>
             
                    <el-row>
                        <el-col :span="5"><div class="grid-content bg-purple">备注</div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple-light">{{contentDetails.remarks}}</div></el-col>
                    </el-row>                   
                </div>                 
            </div>
        </div>
        <el-dialog :title="operateType+'公司'" :visible.sync="addCompanyDialog" :close-on-click-modal="false" class="dialog-box" width="500px">
            <el-form :model="companyForm" :rules="companyRules" label-width="90px" ref="companyForm">
                <el-form-item label="公司名称" prop="name">
                    <el-input v-model="companyForm.name"></el-input>
                </el-form-item>

                <el-form-item label="行政区域" prop="divisionArr">
                    <el-cascader :options="areaData" ref="cascader" v-model="divisionArr"
                        @change="handleAreaChange" @getCheckedNodes="getCheckedNodes">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="备注"  prop="remarks">
                    <el-input type="textarea" v-model="companyForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addCompanyDialog','companyForm')">取 消</el-button>
                <el-button type="primary" @click="save('addCompanyDialog','companyForm')">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="operateType+'站点'" :visible.sync="addSitetDialog" :close-on-click-modal="false" class="dialog-box" width="500px">
            <el-form :model="siteForm" :rules="siteRules" label-width="90px" ref="siteForm">
                <el-form-item label="站点名称" prop="name">
                    <el-input v-model="siteForm.name"></el-input>
                </el-form-item>
                <el-form-item label="电压等级" prop="voltage_level">
                    <el-select v-model="siteForm.voltage_level" placeholder="请选择">
                        <el-option label="10kV" value="10kV"></el-option>
                        <el-option label="20kV" value="20kV"></el-option>
                        <el-option label="35kV" value="35kV"></el-option>
                        <el-option label="35kV" value="35kV"></el-option>
                        <el-option label="110kV" value="110kV"></el-option>
                        <el-option label="220kV" value="220kV"></el-option>
                        <el-option label="330kV" value="330kV"></el-option>
                        <el-option label="500kV" value="500kV"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行政区域" prop="divisionArr">
                    <el-cascader :options="areaData" ref="cascader" v-model="divisionArr"
                        @change="handleAreaChange" @getCheckedNodes="getCheckedNodes">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="站点坐标" prop="site_location">
                    <el-input class='location'  v-model="siteForm.site_location[0]" placeholder="请输入经度"/>  
                    <el-input class='location'  v-model="siteForm.site_location[1]" placeholder="请输入纬度"/>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="siteForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addSitetDialog','siteForm')">取 消</el-button>
                <el-button type="primary" @click="save('addSitetDialog','siteForm')">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="operateType+'电力设备'" :visible.sync="addDeviceDialog" :close-on-click-modal="false" class="dialog-box" width="500px">
            <el-form :model="deviceForm" :rules="deviceRules" label-width="90px"  ref="deviceForm">
                <el-form-item label="设备名称" prop="device_name">
                    <el-input v-model="deviceForm.device_name"></el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="device_type">
                    <el-select v-model="deviceForm.device_type" placeholder="请选择">
                        <el-option label="开关柜" value="开关柜"></el-option>
                        <el-option label="GIS" value="GIS"></el-option>
                        <el-option label="变压器" value="变压器"></el-option>
                        <el-option label="电缆" value="电缆"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电压等级" prop="voltage_level">
                    <el-select v-model="deviceForm.voltage_level" placeholder="请选择">
                        <el-option label="10kV" value="10kV"></el-option>
                        <el-option label="20kV" value="20kV"></el-option>
                        <el-option label="35kV" value="35kV"></el-option>
                        <el-option label="35kV" value="35kV"></el-option>
                        <el-option label="110kV" value="110kV"></el-option>
                        <el-option label="220kV" value="220kV"></el-option>
                        <el-option label="330kV" value="330kV"></el-option>
                        <el-option label="500kV" value="500kV"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="运行编号" prop="operation_number">
                    <el-input v-model="deviceForm.operation_number"></el-input>
                </el-form-item>
                <el-form-item label="资产编号" prop="asset_number">
                    <el-input v-model="deviceForm.asset_number"></el-input>
                </el-form-item>
                <el-form-item label="设备型号" prop="device_model">
                    <el-input v-model="deviceForm.device_model"></el-input>
                </el-form-item>
                <el-form-item label="出厂编号" prop="factory_number">
                    <el-input v-model="deviceForm.factory_number"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="deviceForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addDeviceDialog','deviceForm')">取 消</el-button>
                <el-button type="primary" @click="save('addDeviceDialog','deviceForm')">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="operateType+'测点'" :visible.sync="addPointDialog" :close-on-click-modal="false" class="dialog-box" width="500px">
            <el-form :model="pointForm" :rules="pointRules" label-width="90px" ref="pointForm">
                <el-form-item label="测点名称" prop="measure_name">
                    <el-input v-model="pointForm.measure_name"></el-input>
                </el-form-item>
                <el-form-item label="传感器编号" prop="sensor_number">
                    <el-input v-model="pointForm.sensor_number"></el-input>
                </el-form-item>
                <el-form-item label="测点类型" prop="measure_type">
                    <el-select v-model="pointForm.measure_type" placeholder="请选择">
                        <el-option label="AE" value="AE"></el-option>
                        <el-option label="TEV" value="TEV"></el-option>
                        <el-option label="Temp" value="Temp"></el-option>
                        <el-option label="UHF" value="UHF"></el-option>
                    </el-select>
                </el-form-item>              
                
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="pointForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('addPointDialog','pointForm')">取 消</el-button>
                <el-button type="primary" @click="save('addPointDialog','pointForm')">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import tree from "@/components/tree.vue";
import * as device from '@/data/device.js'
import * as file from '@/data/file.js'
import {allData} from '@/util/china.js'
export default {
    name: "file",
    components: {
        tree,
    },
    data() {
         const validateOrg = (rule, value, callback) => { 
            if (!this.divisionArr.length) {
                callback(new Error('行政区域不能为空'))
            } else {
                callback()
            }
        }
        const validateLocation = (rule, value, callback) => { 
            console.log(this.siteForm.site_location,555);
            if (!(this.siteForm.site_location[0]&&this.siteForm.site_location[1])) {
                callback(new Error('请输入经度和纬度'))
            } else {
                callback()
            }
        }
        return {
            userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
            showTree:false,
            searchForm: {
                siteName: "",
                company: "",
                degree: "",
            },
            addCompanyDialog: false,
            addSitetDialog: false,
            addDeviceDialog: false,
            addPointDialog:false,
            companyForm: {
                name: "",
                administrative_division: {},
                remarks: "",
            },
            companyRules: {
                name: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                divisionArr:[
                    { type: 'array', required: true, validator: validateOrg }
                ]
            },
            siteForm: {
                name: "",
                voltage_level: "",
                administrative_division: {},
                remarks: "",
                site_location: [],
            },
            siteRules:{
                 name: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
                 voltage_level: [{ required: true, message: '请选中电压等级', trigger: 'change' }],
                 divisionArr: [{ type: 'array', required: true, validator: validateOrg }],
                 site_location: [{ type: 'array', required: true,validator: validateLocation, trigger: 'blur' }],
            },
            deviceForm:{
                device_name: "",
                device_type: "",
                voltage_level:"",
                operation_number: "",
                asset_number: "",
                device_model:"", 
                factory_number:"", 
                remarks:'',
            },
            deviceRules:{
                device_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
                device_type: [{ required: true, message: '请选中设备类型', trigger: 'change' }],
                voltage_level: [{ required: true, message: '请选中电压等级', trigger: 'change' }],
                operation_number: [{ required: true, message: '请输入运行编号', trigger: 'blur' }],
                asset_number: [{ required: true, message: '请输入资产编号', trigger: 'blur' }],
                device_model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
                factory_number: [{ required: true, message: '请输入出厂编号', trigger: 'blur' }],                
            },
            pointForm:{
                measure_name:'',
                measure_type:'',
                sensor_number:'',
                remarks:'',
            },
            pointRules:{
                measure_name: [{ required: true, message: '请输入测点名称', trigger: 'blur' }],
                sensor_number: [{ required: true, message: '请输入传感器编号', trigger: 'blur' }],
                measure_type: [{ required: true, message: '请选中测点类型', trigger: 'change' }],
                
            },
            treeData:[],
            clickNodeObj:{},  //当前点击的节点
            clickNodeDetailObj:{},  //当前点击的节点,用于展示详情
            operateType:'', //新增或修改
            actionName:'',//操作（新增同级或新增下级）
            areaData:allData,//区域数据
            selectAreaData:{  //选中的区域信息
                province: "",
                city: "",
                region:""
            },
            contentDetails:{},
            divisionArr:[]
        };
    },
    methods: {
        submitUpload(){
            this.$refs.upload.submit();
        },
        uploadFunction(item){
            let formData = new FormData();
            formData.append('file',item.file);
            file.importFile({
                data:formData
            }).then(res=>{
                this.$message({type:'success', message: '导入成功'});
                this.getTreeData();
            })
        },
        onSubmit() {},
        handleOperate(){
            this.edit(this.clickNodeDetailObj)
        },
        handleAreaChange(v){
            
            let labers = this.$refs.cascader.getCheckedNodes()[0].pathLabels;
            this.$set(this,'divisionArr',labers)
            this.selectAreaData={
                province: labers[0],
                city: labers[1],
                region:labers[2],
            }
        },
        getCheckedNodes(v){
            console.log(v,'node');
        },
        clickNode(v){
            
            if(v.type=="customer"){
                file.companyDetails({customer_id:v.id}).then(res=>{
                    this.contentDetails = res.data;
                    this.clickNodeDetailObj  = v;
                })
            }else if(v.type=="site"){
                file.siteDetails({customer_id:v.parent_id,site_id:v.id}).then(res=>{
                    this.contentDetails = res.data;
                    this.clickNodeDetailObj  = v;
                })
            }else if(v.type=="equipment"){
                file.deviceDetails({device_id:v.id,site_id:v.parent_id}).then(res=>{
                    this.contentDetails = res.data;
                    this.clickNodeDetailObj  = v;
                })           
            }else if(v.type=="point"){
                file.pointDetails({point_id:v.id,equipment_id:v.parent_id}).then(res=>{
                    this.contentDetails = res.data;
                    this.clickNodeDetailObj  = v;
                })         
            } 
        },
        showDialogFun(obj){
             switch (obj.type){
                case 'customer':
                    this.addCompanyDialog = true;
                    break;
                case 'site':
                    this.addSitetDialog = true;
                    break;
                case 'equipment':
                    this.addDeviceDialog = true;
                    break;
                case 'point':
                    this.addPointDialog = true;
                    break;
                default:
                    break;
            } 
        },
        add(obj) {
            this.operateType = '新建';
            this.actionName = 'add'
            this.clickNodeObj  = obj;
            this.showDialogFun(obj)
        },
        addChild(obj){
            this.operateType = '新建';
            this.actionName = 'addChild'
            this.clickNodeObj  = obj;
             switch (obj.type){
                case 'customer':
                    this.addSitetDialog = true;
                    break;
                case 'site':
                    this.addDeviceDialog = true;
                    break;
                case 'equipment':
                    this.addPointDialog = true;
                    break;
                default:
                    break;
            } 
        },
        edit(obj){
            this.operateType = '修改';
            this.clickNodeObj  = obj;
            //查询详情
            this.showDialogFun(obj);
            if(obj.type=='customer'){
                file.companyDetails({customer_id:obj.id}).then(res=>{
                    this.valueAssign(this.companyForm,res.data)
                    console.log(this.companyForm,'company');
                    this.selectAreaData = this.companyForm.administrative_division
                    this.divisionArr =[this.companyForm.administrative_division.province,this.companyForm.administrative_division.city,this.companyForm.administrative_division.region]
                })
            }else if(obj.type=='site'){
                file.siteDetails({customer_id:obj.parent_id,site_id:obj.id}).then(res=>{
                    this.valueAssign(this.siteForm,res.data);
                    this.selectAreaData = this.siteForm.administrative_division
                    this.divisionArr =[this.siteForm.administrative_division.province,this.siteForm.administrative_division.city,this.siteForm.administrative_division.region]                        
                })
            }else if(obj.type=='equipment'){
               file.deviceDetails({site_id:obj.parent_id,device_id:obj.id}).then(res=>{
                    this.valueAssign(this.deviceForm,res.data)
                })
            }else if(obj.type=='point'){
                file.pointDetails({point_id:obj.id,equipment_id:obj.parent_id}).then(res=>{
                    this.valueAssign(this.pointForm,res.data)
                }) 
            }

        },
        del(obj){
            this.$confirm('是否清除当前位置的后台数据?【取消删除请点击右上角 X 】', '提示', {
                confirmButtonText: '清除',
                cancelButtonText: '不清除',
                distinguishCancelAndClose:true,
                type: 'warning'
            }).then(() => {
                this.delActhon(obj,true)
            }).catch((action) => {
                 if(action =='cancel'){
                    this.delActhon(obj,false)
                }else{
                    this.$message({type:'info',message:'已取消删除'}); 
                }          
            });                       
        },
        delActhon(obj,n){
            if(obj.type=='customer'){
                file.delCompany({customer_id:obj.id,isClear:n}).then(res=>{
                    this.delSuccess()
                })
            }else if(obj.type=='site'){
                file.delSite({customer_id:obj.parent_id,site_id:obj.id,isClear:n}).then(res=>{
                    this.delSuccess()
                })
            }else if(obj.type=='equipment'){
                file.delDevice({site_id:obj.parent_id,equipment_id:obj.id,isClear:n}).then(res=>{
                    this.delSuccess()
                })
            }else if(obj.type=='point'){
                file.delPoint({equipment_id:obj.parent_id,point_id:obj.id,isClear:n}).then(res=>{
                    this.delSuccess()
                })
            }
        },
        delSuccess(){
             this.$message({message: '删除成功',type: 'success'});
             this.getTreeData()
        },  
        valueAssign(obja,objb){
            //objb 给对象 obja赋值
            Object.keys(obja).forEach(key => { obja[key] = objb[key] || obja[key]});
        },      
        getTreeData(){
            let This = this;
            device.queryTree({add_point:true}).then(res=>{
                if(!res) return;

                This.treeData = res.data;
                This.showTree = true;
                This.clickNode(res.data[0]);                            
            })
        },
        resetForm(val){
            this.$refs[val].resetFields();
             if(this[val].site_location){
                this[val].site_location=[];
            }
            this.divisionArr = [];            
        },
        cancel(dia,form){
            this[dia] = false;           
            this.resetForm(form);
        },
        save(val,form){
            
            this.$refs[form].validate((valid) => {
                 if (valid) {
                        if(val=='addCompanyDialog'){
                        this.companyForm.administrative_division = this.selectAreaData
                        if(this.operateType == '新建'){
                            file.addCompany(this.companyForm).then(res=>{
                                this.getTreeData();
                                this.resetForm(form)
                                this.$message({type: 'success',message: '添加成功'}); 
                            })
                        }else{                                       
                            file.editCompany({params:this.companyForm,customer_id:this.clickNodeObj.id}).then(res=>{
                                this.getTreeData();
                                this.resetForm(form);
                                this.$message({type: 'success',message: '修改成功'}); 
                            })
                        }
                        
                    }else if(val=='addSitetDialog'){
                        this.siteForm.administrative_division = this.selectAreaData  
                        let _id = this.actionName == 'add'?this.clickNodeObj.parent_id:this.clickNodeObj.id
                        if(this.operateType == '新建'){
                            file.addSite({parent_id: _id,params:this.siteForm}).then(res=>{
                                this.getTreeData()
                                this.resetForm(form);
                                this.$message({type: 'success',message: '添加成功'}); 
                            })
                        }else{                                  
                            file.editSite({params:this.siteForm,customer_id:this.clickNodeObj.parent_id,site_id:this.clickNodeObj.id}).then(res=>{
                                this.getTreeData();
                                this.resetForm(form);
                                this.$message({type: 'success',message: '修改成功'}); 
                            })
                        }
                            
                    }else if(val=='addDeviceDialog'){
                        let  _id = this.actionName == 'add'?this.clickNodeObj.parent_id:this.clickNodeObj.id
                        if(this.operateType == '新建'){
                            file.addDevice({params:this.deviceForm,site_id: _id}).then(res=>{
                                this.getTreeData();
                                this.resetForm(form);
                                this.$message({type: 'success',message: '添加成功'}); 
                            })
                        }else{              
                            file.editDevice({params:this.deviceForm,site_id:this.clickNodeObj.parent_id,equipment_id:this.clickNodeObj.id}).then(res=>{
                                this.getTreeData();
                                this.resetForm(form);
                                this.$message({type: 'success',message: '修改成功'});                 
                            })
                        }
                    
                    }else if(val=='addPointDialog'){
                        let  _id = this.actionName == 'add'?this.clickNodeObj.parent_id:this.clickNodeObj.id
                        if(this.operateType == '新建'){
                            file.addPoint({params:this.pointForm,device_id: _id}).then(res=>{
                            this.getTreeData();
                            this.resetForm(form);
                            this.$message({type: 'success',message: '添加成功'}); 
                        })
                        }else{              
                            file.editPoint({params:this.pointForm,equipment_id:this.clickNodeObj.parent_id,point_id:this.clickNodeObj.id}).then(res=>{
                                this.getTreeData();
                                this.resetForm(form);
                                this.$message({type: 'success',message: '修改成功'}); 
                            })
                        }
                        
                    }
                    this[val] = false;  
                } else{return false}
            })          
            
           
        },        
    },
    mounted(){
        this.getTreeData();
    }
};
</script>

<style lang='less' scoped>
.location{width:49%;}
.details-info{
    background: #fff;padding:20px;
    .el-row{
        padding:10px 0;
    }
}
.details-title{
    font-size: 18px;
    font-weight: bold;
    margin-bottom:15px;
}
/deep/.el-form-item__label{
    width:100px !important;
}
/deep/.el-form-item__content{
//    margin-left:100px !important;
}
</style>
