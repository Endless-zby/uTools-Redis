<template>
<div class="decrease">


  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="addConnection">新建连接</el-button>
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
<!--          <el-button type="info" icon="el-icon-edit" size="small">配置连接</el-button>-->

          <template slot="title">Redis-172.16.192.245</template>
          <div class="demo-input-suffix">
            <el-input
              placeholder="输入key"
              prefix-icon="el-icon-search"
              v-model="input2">
            </el-input>
          </div>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: left; font-size: 12px">
        <el-dropdown>
          <el-button type="primary"  icon="el-icon-s-tools" size="mini" plain></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>Redis-Client</span>
      </el-header>

      <el-main>
        <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>

</div>
</template>
<script>



  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item),
        input2: 'byzhao'
      }
    },

    methods: {
      addConnection: function () {
          // 在这添加一个redis链接
          console.log('添加一个redis链接')
        this.creareRedis()
      }
    },
    mounted() {

    }
  };
</script>

<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
