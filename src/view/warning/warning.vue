<template>
   <div style="height:100%"> 
       <div class="sub-tabs warning-tabs">
            <el-tabs v-model="activeTab" class="">
                <el-tab-pane label="报警总览" name="chart"></el-tab-pane>
                <el-tab-pane label="报警事件" name="list"></el-tab-pane>
            </el-tabs>
        </div>
        <div v-if="activeTab == 'list'">
            <div class="search-content">
                <el-form ref="form" :model="form" label-width="80px"  :inline="true" class="site-form">
                    <el-col :span="6">
                        <el-form-item label="类型">
                            <el-input v-model="form.name" style="width:217px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态">
                            <el-select v-model="form.region" placeholder="请选择">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
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
                    <el-form-item  class='btn-group'>
                        <el-button   size="small" type="primary">查询</el-button>
                        <el-button size="small">重置</el-button>
                        <el-button size="small">批量确认</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table-content">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column header-align="center" align="center" type="selection" width="55"></el-table-column>
                    <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
                    <el-table-column align="center" prop="state" label="状态" ></el-table-column>
                    <el-table-column prop="description" align="center" width="280" label="报警描述"></el-table-column>
                    <el-table-column prop="warningTime" align="center" label="报警时间"></el-table-column>
                    <el-table-column prop="ensureTime" align="center" label="确认时间"></el-table-column>
                    <el-table-column prop="operator" align="center" label="确认人"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" >详情</el-button>                       
                            <el-button type="text" size="mini" >确认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-if="activeTab == 'chart'" style="font-size:30px;text-align:center;">
            总览
        </div>
   </div>
</template>

<script>
   export default {
       name:'',
       data(){
           return {
                tableData: [{
                    state: '已确认',
                    description: '这是一段描述，关于应用的描述',
                    warningTime: '2021-09-11 01:50:20',
                    ensureTime:'2021-09-11 01:52:20',
                    operator:'张三',
                },{
                    state: '已确认',
                    description: '这是一段描述，关于应用的描述',
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
                activeTab:'list'
           }
       },
       mounted(){},

       methods: {}
   }
</script>

<style lang='less' scoped>
    .el-form-item{
        margin-bottom:0;
    }
    .btn-group{
        float:right;
    }
    .el-button--small{
        padding:9px 35px;
    }
</style>

