<template>
  <div class="decrease">


    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="220px" style="background-color: rgb(238, 241, 246)">

        <el-row>
          <el-button type="success" size="mini" icon="el-icon-circle-plus-outline" @click="dialogFormVisible = true">
            新建连接
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
        </el-row>
        <el-menu :default-openeds="['1', '3']" v-for="(client,index) in clientList" :key="index">
          <el-submenu :index="String(index)">
            <template slot="title">{{client.name}}</template>
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
            <el-button type="primary" icon="el-icon-s-tools" size="mini" plain></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>Redis-Client</span>
        </el-header>

        <el-main>
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10}"
            placeholder="value...."
            v-model="textarea2">
          </el-input>
        </el-main>
      </el-container>

      <el-dialog title="创建新的redis连接" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="ip" :label-width="formLabelWidth">
            <el-input v-model="form.host" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="端口" :label-width="formLabelWidth">
            <el-input v-model="form.port" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="auth" :label-width="formLabelWidth">
            <el-input v-model="form.auth" autocomplete="off"></el-input>
          </el-form-item>
          <!--        <el-form-item label="auth" :label-width="formLabelWidth">-->
          <!--          <el-select v-model="form.auth" placeholder="请选择活动区域">-->
          <!--            <el-option label="区域一" value="shanghai"></el-option>-->
          <!--            <el-option label="区域二" value="beijing"></el-option>-->
          <!--          </el-select>-->
          <!--        </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewClient">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>

  </div>
</template>
<script>
  import md5 from 'js-md5';

  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item),
        input2: 'byzhao',
        dialogFormVisible: false,
        form: {
          id: '',
          name: '',
          host: '',
          port: '',
          auth: ''
        },
        textarea2: '',
        clientList: [],
        formLabelWidth: '80px'
      }
    },

    methods: {
      addNewClient: function () {
        // 关闭窗口
        this.dialogFormVisible = false
        // 测试连接
        isRedisConnect(this.form.port, this.form.host, this.form.auth).then((data) => {
          console.log('data : ' + data)
          this.$message.success('连接成功');
          // 连接成功后保存连接数据
          const md5 = this.$md5(this.form.toString())
          this.form.id = md5;
          const id = 'config/' + md5
          const isExist = this.uToolsDbGet(id)
          if(isExist){
            this.$message.info('已存在');
          }else {
            this.uToolsDbPut(id, this.form)
            // 刷新左侧列表
            this.refresh()
            // 重置from对象
            this.form = this.$options.data().form
            console.log('添加新的连接完成！')
          }

        }).catch((error) => {
          this.$message.error(error);
        })
      },
      refresh: function () {
        const config = this.uToolsDbGetAllConfig('config')
        if (config) {
          console.log('更新成功！')
          const list = [];
          config.forEach(value => list.push(value.data));
          this.clientList = list
        }
      },

      uToolsDbPut: function (id, data) {
        const result = utools.db.put({_id: id, data: data})
        console.log(result)
        if (result.ok) {
          console.log("连接保存成功")
        }
      },
      uToolsDbGet: function (id) {
        return utools.db.get(id);
      },
      uToolsDbGetAllConfig: function () {
        // 传入字符串，则返回id以 config 开头的文档
        return utools.db.allDocs("config")
      }

    },
    created() {
      // this.clientList = [{"name":"redis-211","host":"172.16.192.211","port":"6379","auth":"ssssss",},{"name":"redis-43","host":"172.16.192.211","port":"6379","auth":"ssssss"}]
      // this.clientList = this.uToolsDbGet("connConfig").data
      // console.log('初始化列表 ： '  + this.clientList)
    },
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
