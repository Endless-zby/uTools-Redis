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

            <div>
              <!--              <el-button type="primary" size="mini" style="float: left;font-size: 12px;width: 45%" @click="addKey">刷新Key</el-button>-->
              <el-button type="primary" size="mini" style="float: right;font-size: 12px;width: 100%"
                         @click="dialogFormVisibleAddKey = true">新增Key
              </el-button>
            </div>
            <br>
            <el-input
              placeholder="搜索key.."
              prefix-icon="el-icon-search"
              v-model="input2"
              size="small"
              @input="selectKey">
            </el-input>

            <input v-for="(tag,elem) in keyMap.get(client.id)" :key="elem" type="button" :value="tag" style="width: 100%;height: 25px;" @click="getValue(tag)">

          </el-submenu>
        </el-menu>
      </el-aside>


      <el-container>
        <el-header style="text-align: left; font-size: 12px">
          <el-dropdown>
            <el-button type="primary" icon="el-icon-s-tools" size="mini" plain></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updateConnection">修改</el-dropdown-item>
              <el-dropdown-item @click.native="dialogFormVisible = true">新增</el-dropdown-item>
              <el-dropdown-item @click.native="deleteConnection">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{nowClient.name}}</span>
        </el-header>

        <el-main>
          <div>
            <el-input placeholder="key" v-model="key" size="small" style="width: 45%">
              <template slot="prepend" style="width: 30px">{{mainType}}</template>
              <el-button slot="append" icon="el-icon-check" style="width: 30px"></el-button>
            </el-input>

            <el-input placeholder="设置超时时间" v-model="ttl" size="small" style="width: 45% ; float: right">
              <template slot="prepend" style="width: 30px">TTL</template>
              <el-button slot="append" icon="el-icon-check" @click="updateTTl" style="width: 30px"></el-button>
            </el-input>
          </div>
          <br><br>


          <div v-if="mainType === 'string'">
            <json-viewer :value="textarea2" :expand-depth=4 copyable boxed sort></json-viewer>
            <br>
            <el-button type="danger" icon="el-icon-delete" @click="deleteKey" style="float: right"></el-button>
          </div>
          <div v-else-if="mainType === 'list'">
            <el-table
              :data="tableData"
              border
              style="width: 100%">
              <el-table-column
                prop="index"
                label="ID"
                width="130">
              </el-table-column>
              <el-table-column
                prop="value"
                label="Value"
                width="300">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="Operation"
                width="100">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                  <el-button type="text" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <br>
            <el-button type="danger" icon="el-icon-delete" @click="deleteKey" style="float: right"></el-button>
          </div>
        </el-main>
      </el-container>

      <el-dialog title="创建新的redis连接" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="名称" :label-width="formLabelWidth" :rules="[{ required: true, message: '名称不能为空'}]">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="ip" :label-width="formLabelWidth" :rules="[{ required: true, message: 'IP不能为空'}]">
            <el-input v-model="form.host" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="端口" :label-width="formLabelWidth" :rules="[{ required: true, message: '端口不能为空'}]">
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


      <el-dialog title="增加key" :visible.sync="dialogFormVisibleAddKey">
        <el-form :model="addKeyForm">
          <el-form-item label="类型" :label-width="formLabelWidth" :rules="[{ required: true, message: '类型不能为空'}]">
            <el-select v-model="addKeyForm.type" placeholder="请选择数据类型">
              <el-option label="string" value="string"></el-option>
              <el-option label="list" value="list"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="键名" :label-width="formLabelWidth" :rules="[{ required: true, message: 'key不能为空'}]">
            <el-input v-model="addKeyForm.key" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="过期" placeholder="秒" :label-width="formLabelWidth">
            <el-input v-model="addKeyForm.seconds" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="键值" :label-width="formLabelWidth">
            <el-input v-model="addKeyForm.stringValue" type="textarea" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAddKey = false">取 消</el-button>
          <el-button type="primary" @click="addKey">确 定</el-button>
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
        dialogFormVisibleAddKey: false,
        addKeyForm: {
          type: '',
          key: '',
          stringValue: '',
          seconds: -1,
        },
        form: {
          id: '',
          name: '',
          host: '',
          port: '',
          auth: ''
        },
        keyMap: new Map,
        textarea2: {},
        clientList: [],
        formLabelWidth: '80px',
        //当前client
        nowClient: {},
        // main块中显示的value类型
        mainType: 'string',
        tableData: [],
        // 超时时间
        ttl: -1,
        // key
        key: ''
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
      addKey: function () {
        // 关闭窗口
        this.dialogFormVisibleAddKey = false
        if ("string" === this.addKeyForm.type) {
          console.log(4444444);
          console.log(this.addKeyForm);
          setStringKey(this.nowClient.id, this.addKeyForm.key, this.addKeyForm.stringValue, this.addKeyForm.seconds).then((data) => {
            console.log(data);
            this.$message.success('添加成功');
            this.refreshKeysList()
          }).catch((errer) => {
            console.log(errer);
            this.$message.success(errer);
          })
        } else if ("list" === this.addKeyForm.type) {
          console.log('set了一个list');
          console.log(this.addKeyForm.stringValue);
          console.log('---------------');
          setListKey(this.nowClient.id, this.addKeyForm.key, this.addKeyForm.stringValue, this.addKeyForm.seconds).then((data) => {
            console.log('+++++++++++');
            console.log(data);
            this.$message.success('添加成功');
            this.refreshKeysList()
          }).catch((errer) => {
            console.log(errer);
            this.$message.success(errer);
          })
        }
        this.refresh()

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
            this.keyMap.delete(now.id)
            this.keyMap.set(now.id, data)
            this.nowClient = now;
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
      getValue: function (key) {
        getKeyTTl(this.nowClient.id, key).then((data) => {
          this.ttl = data;
        }).catch((errer) => {
          console.log(errer);
          this.$message.error(errer);
        })
        getkeyType(this.nowClient.id, key).then((type) => {
          this.key = key;
          if ("string" === type) {
            this.mainType = type
            getKey(this.nowClient.id, key).then((data) => {
              try {
                this.textarea2 = JSON.parse(data) // 如果不是json字符串就会抛异常
              } catch (e) {
                this.textarea2 = data
              }
            }).catch((errer) => {
              console.log(errer);
            })
          } else if ("list" === type) {
            this.mainType = type
            getKeyList(this.nowClient.id, key).then((data) => {
              console.log(data);
              this.tableData = data.map((item, index) => {
                return {'index': index, 'value': item}
              });
              console.log(this.tableData);
            }).catch((errer) => {
              console.log(errer);
            })
          } else {
            this.$message.error('暂不支持的value类型，后续会加');
          }
        }).catch((errer) => {
          this.$message.error('获取【' + key + '】类型失败' + errer);
        })
      },
      handleClick(row) {
        console.log(row);
      },
      updateTTl: function () {
        if (this.key === '') {
          this.$message.info('请选择key');
        } else {
          updateTTl(this.nowClient.id, this.key, this.ttl).then((data) => {
            this.$message.success('修改成功');

          }).catch((errer) => {
            console.log(errer);
            this.$message.error(errer);
          })
        }
      },
      deleteKey: function () {
        if (this.key === '') {
          this.$message.info('key为空');
        } else {
          delKey(this.nowClient.id, this.key).then((data) => {
            this.$message.success('删除成功');
            this.refreshKeysList()
          }).catch((errer) => {
            console.log(errer);
            this.$message.error(errer);
          })
        }
      },
      refreshKeysList: function () {
        getKeys(this.nowClient.id, '').then((data) => {
          this.keyMap.delete(this.nowClient.id)
          this.keyMap.set(this.nowClient.id, data);
          this.refresh()
        }).catch((errer) => {
          console.log(errer);
          this.$message.error(errer);
        })
      }
    },
    // 删除连接
    deleteConnection: function (){
      const result =  utools.db.remove('config/' + this.nowClient.id)
      // 刷新列表
      console.log(result)
      if (result.ok) {
        console.log("删除成功")
        this.$message.success('已删除【' + this.nowClient.name + '】');
        this.refresh()
      }
    },
    // 修改连接
    updateConnection: function (){

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
