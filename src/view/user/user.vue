<template>
    <div>
        <div class="z-block search-block">
            <el-form :inline="true" ref="form" :model="searchForm" label-width="80px">  
                <el-form-item label="用户名">
                    <el-input v-model="searchForm.username" clearable placeholder="请输入公司名称"></el-input>
                </el-form-item>             
                <el-form-item label="公司">
                    <el-select v-model="searchForm.customer" placeholder="请选择" @change="setValue" clearable>
                        <el-option
                            v-for="item in customerList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>                
                </el-form-item>
                <el-form-item label="站点">
                    <el-select v-model="searchForm.sites" placeholder="请选择" multiple>
                       <el-option
                            v-for="item in siteList"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class='item-button'>
                    <el-button size="small" type="primary" @click="search">查询</el-button>
                    <el-button size="small" @click="reset">重置</el-button>
                </el-form-item>
                
            </el-form>
        </div>
        <div>
            <el-button-group>
                <el-button type="primary" @click="handleUsers(0)">新建</el-button>
            </el-button-group>
            <el-table :data="tableData" style="width: 100%">

                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="role_level" label="角色">
                    <template slot-scope="scope">
                        <span>{{getRoleLabel(scope.row.role_level)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status?'已启用':'已禁用'}}</span>    
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机"></el-table-column>
                <el-table-column prop="customer_name" label="所属公司"  width="280"></el-table-column>

                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleUsers(1,scope.row)">编辑</el-button>
                        <el-button type="text" @click="handleUsers(2,scope.row)">删除</el-button>
                        <el-button :disabled="!scope.row.is_suspend" type="text" @click="handleUsers(3,scope.row)">禁用</el-button>
                        <el-button :disabled="scope.row.is_suspend" type="text" @click="handleUsers(4,scope.row)">启用</el-button>
                    </template>
                   
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="addUserDialog" class="dialog-box" width="500px" :close-on-click-modal="false">
            <el-form :model="userForm" :rules="userRules" label-width="70px" ref="userForm"> 
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="userForm.username" :disabled="dialogTitle=='修改用户'"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="userForm.email"  :disabled="dialogTitle=='修改用户'"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码" v-if="dialogTitle=='新增用户'">
                    <el-input v-model="userForm.password" type="password"></el-input>
                </el-form-item> 
                <el-form-item prop="phone" label="电话" >
                    <el-input v-model="userForm.phone"></el-input>
                </el-form-item>               
                <el-form-item prop="role_level" label="角色">
                    <el-select v-model="userForm.role_level" placeholder="请选择" @change="selectRole">
                        <el-option v-for="(item,index) in roleOptions" :key="index" :label="item.label" :value="item.level"></el-option>
                        <!-- <el-option label="超级管理员" value="10"></el-option>
                        <el-option label="管理员" value="20"></el-option>
                        <el-option label="普通用户" value="30"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item prop="customer" label="公司" v-if="[20,30,'管理员'].indexOf(userForm.role_level)>-1">
                    <el-select v-model="userForm.customer" placeholder="请选择" @change="setValue">
                        <el-option
                            v-for="item in customerList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="sites" label="站点" v-if="userForm.role_level == 30">
                    <el-select v-model="userForm.sites" placeholder="请选择" multiple>
                       <el-option
                            v-for="item in siteList"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button type="primary" @click="save('userForm')">保 存</el-button>
            </div>
        </el-dialog>
        <!-- <el-dialog title="新建公司" :visible.sync="addCompanyDialog" class="dialog-box" width="500px">
            <el-form :model="userForm" :rules="rules" label-width="70px"> 
                <el-form-item label="公司名称" prop="userName">
                    <el-input v-model="userForm.userName"></el-input>
                </el-form-item>               
                <el-form-item label="行政区域" prop="userName">
                    <el-select v-model="userForm.userName" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="userForm.desc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="">取 消</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
import * as account from '@/data/api.js'
export default {
    name: "",
    data() {
        return {
            userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
            searchForm: {
                username: "",
                customer: "", 
                sites:[]           
            },
            tableData: [                
            ],
            customerList:[],
            siteList:[],
            addUserDialog:false,
            addCompanyDialog:false,
            dialogTitle:'新建用户',
            userForm:{
                username:"",
                email:"",
                phone:"",
                password:"",
                role_level:"",
                customer:"",
                sites:[],
            },
            userRules:{
                username:[{ required: true, message: '请输入用户名', trigger: 'blur' }],
                email:[{ required: true, message: '请输入邮箱', trigger: 'blur' }],
                password:[{ required: true, message: '请输入密码', trigger: 'blur' }],
                phone:[{ required: true, message: '请输入电话', trigger: 'blur' }],
                role_level:[{ required: true, message: '请选择角色', trigger: 'change' }],
                customer:[{ required: true, message: '请选择公司', trigger: 'change' }],
                sites:[{ required: true, message: '请选择站点', trigger: 'change' }],
            },
            roleOptions:[],
            roleList:[
               { level:0,label:'内部超级管理员'},
               { level:10,label:'超级管理员'},
               { level:20,label:'管理员'},
               { level:30,label:'普通用户'},
            ]
        };
    },
    mounted() {
        this.getCustomerList();
        this.getUserList(); 
        this.setRoleOption();
    },

    methods: {
        setRoleOption(){
            let role = this.userInfo.role_level;
            if(role == 0){
                this.roleOptions = [
                    { level:10,label:'超级管理员'},
                    { level:20,label:'管理员'},
                    { level:30,label:'普通用户'},
                ]
            }else if(role==10){
                this.roleOptions = [
                    { level:20,label:'管理员'},
                    { level:30,label:'普通用户'},
                ]
            }else if(role==12){
                this.roleOptions = [
                    { level:30,label:'普通用户'},
                ]
            }
        },
        getRoleLabel(val){
            return this.roleList.find(item=>item.level==val).label
        },
        search(){
            this.getUserList(this.searchForm);
        },
        reset(){
            this.searchForm={
                username: "",
                customer: "", 
                sites:[]           
            }
            this.siteList = [];
            this.getUserList(this.searchForm);
        },
        getSiteList(id){
            account.siteRequest(id,'get').then(res=>{
                this.siteList = res.data.sites;
            })
        },
        getUserList(obj={}){
             account.usersQuery(Object.assign(this.userForm,obj),'get').then(res=>{
                this.tableData = res.data.users;
            })
        },
        getCustomerList(){
            account.getCustomerList(this.userForm).then(res=>{
                this.customerList = res.data.customers;
            })
        },
        valueAssign(obja,objb){
            //objb 给对象 obja赋值
            Object.keys(obja).forEach(key => { obja[key] = objb[key] || obja[key]});
        }, 
        handleUsers(n,val){

            if(n==1||n==0){
                this.dialogTitle = n==0?'新增用户':'修改用户'
                this.addUserDialog = true;
                if(n==0){
                    this.resetForm();
                }
                if(n==1){
                    this.valueAssign(this.userForm,val);
                    this.getSiteList(val.customer)
                    // this.userForm.customer = val.customer_name;
                    this.user_id = val.id
                }
                return;
            }else{
                let params = {user_id:val.id};
                let type = 'delete';
                if(n==2){
                    account.usersDelete(params,type).then(res=>{
                        this.getUserList();
                        return;
                    })
                }                
                if(n!=2){
                    params = Object.assign(params, {is_suspend:n==3?false:true});
                    type = 'put'
                     account.usersRequest(params,type).then(res=>{
                        this.getUserList();
                    })
                }
               
            }           
        },
        selectRole(v){
            if(v==10){
                delete this.userForm.customer
                delete this.userForm.sites
            }else if(v==20){
                 delete this.userForm.sites
            }else{}
        },
        setValue(v){
            if(v === 'add'){
                this.addCompanyDialog = true;
            }else{
                this.userForm.sites = [];
                this.getSiteList(v)
            }
        },
        resetForm(){
            this.userForm ={
                username:"",
                email:"",
                phone:"",
                password:"",
                role_level:"",
                customer:"",
                sites:[],
            }
        },
        cancelDialog(){
            this.addUserDialog = false
            this.resetForm();
        },
        save(form){
             this.$refs[form].validate((valid) => {
                 if (valid) {
                    let type='post';
                    let params = this.userForm
                    if(this.dialogTitle=='修改用户'){
                        delete this.userForm.password
                        if(this.userForm.role_level==10){
                            delete params.customer
                            delete params.sites
                        }else if(this.userForm.role_level==20){
                            delete params.sites
                        }
                        type = 'put';
                        params = Object.assign(params,{user_id:this.user_id})
                    }else{
                        //根据不同角色删除属性
                        if(this.userForm.role_level==10){
                            delete params.customer
                            delete params.sites
                        }else if(this.userForm.role_level==20){
                            delete params.sites
                        }
                    }
                    account.usersAdd(params,type).then(res=>{
                        this.$message({type:'success', message: '已操作成功'});                               
                        this.addUserDialog = false;
                    
                        this.$nextTick(() => {
                            this.resetForm();   
                            // this.$refs['userForm'].resetFields();
                            this.getUserList();
                        })
                    
                    })
                 }else{return false}
             })
           
        }
    },
};
</script>

<style lang='less' scoped>
   .dialog-box {
        /deep/ .el-select{
            width:100%;
        }
   }
   .el-button-group{
       float:right;padding:10px 20px 10px 10px;
   }
   .item-button{float:right;}
   /deep/.el-table th{
       text-align: center;
   }
</style>
