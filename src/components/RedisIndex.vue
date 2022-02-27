<template xmlns="http://www.w3.org/1999/html">
  <div class="decrease">


    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="220px" style="background-color: rgb(238, 241, 246)">

        <el-row>
          <el-button type="success" size="small" icon="el-icon-circle-plus-outline" @click="dialogFormVisible = true">
            新建连接
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
        </el-row>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          :unique-opened=true>
          <el-submenu :index="String(index)" v-for="(client,index) in clientList" :key="index">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{client.name}}</span>
            </template>
            <el-input
              placeholder="搜索key.."
              prefix-icon="el-icon-search"
              v-model="input2"
              size="small"
              @input="selectKey">
            </el-input>
            <div v-for="(tag,elem) in keyMap.get(client.id)" :key="elem" >

              <p style="margin-top:1px; background-color: darkgray" >
                {{tag}}
              </p>
            </div>


<!--            <el-tag-->
<!--              v-for="(tag,elem) in keyMap.get(client.id)"-->
<!--              :key="elem"-->
<!--              closable-->
<!--              type="success">-->
<!--              {{tag}}-->
<!--            </el-tag>-->
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
          <span>{{nowClient.name}}</span>
        </el-header>

        <el-main style="background-color: bisque">
          <div>
            <json-viewer :value="textarea2" :expand-depth=4 copyable boxed sort></json-viewer>
          </div>


<!--          <el-input-->
<!--            type="textarea"-->
<!--            :autosize="{ minRows: 5, maxRows: 10}"-->
<!--            placeholder="value...."-->
<!--            v-model="textarea2">-->
<!--          </el-input>-->
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
  export default {
    data() {
      return {
        input2: '',
        dialogFormVisible: false,
        form: {
          id: '',
          name: '',
          host: '',
          port: '',
          auth: ''
        },
        keyMap: new Map,
        textarea2: {
          "traceId": "M6902171363576680152",
          "message": {
            "code": "0",
            "message": "success"
          },
          "user": {
            "idNoEndAt": "4075459200000",
            "county": "",
            "vipDueDate": "",
            "idAddressCodeExists": "0",
            "idNo": "H123321",
            "orgType": "",
            "province": "",
            "operateCode": "2"
          }
        },
        clientList: [],
        formLabelWidth: '80px',
        //当前client
        nowClient: {},
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
          const md5 = this.$md5(JSON.stringify(this.form))
          this.form.id = md5;
          console.log(this.form.id)
          const id = 'config/' + md5
          const isExist = this.uToolsDbGet(id)
          console.log(isExist)
          if (isExist) {
            this.$message.info('已存在');
          } else {
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
      },
      uToolsDbDel: function (id) {
        const result = utools.db.remove(id)
        console.log(result)
        if (result.ok) {
          console.log("删除成功")
          this.$message.success('已删除【' + result.data.b + '】');
          this.refresh()
        }
      },
      handleOpen: function (index) {

        console.log('handleOpen');
        console.log(index);
       const now = this.clientList[index];
        // 测试连接
        isRedisConnect(now.port, now.host, now.auth).then((data) => {
          // this.$message.success('连接成功');
          // 连接redis查所有key
          getKeys(now.id, '').then((data) => {
            // 获取所有keys
            // keys加到clientList中的对应对象中
            this.keyMap.set(now.id, data)
            this.nowClient = now;
            this.refresh()
          }).catch((errer) => {
            console.log(errer);
            this.$message.error(errer);
          })
        }).catch((error) => {
          this.$message.error(error);
        })


      },
      selectKey: function (value) {
        console.log(value);
        getKeys(this.nowClient.id, value).then((data) => {
          console.log(data);
          if (data.length === 0) {
            this.keyMap.delete(this.nowClient.id);
          } else {
            this.keyMap.set(this.nowClient.id, data);
          }
        }).catch((errer) => {
          console.log(errer);
        })
      },
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
