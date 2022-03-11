<template xmlns="http://www.w3.org/1999/html">
  <div class="decrease">


    <el-container style="height: 600px; border: 1px solid #eee">
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
          @close="handleClose"
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
          <div v-if="mainType !== 'index'">
            <el-input placeholder="key" v-model="key" size="small" style="width: 45%">
              <template slot="prepend" style="width: 30px">{{mainType}}</template>
              <el-button slot="append" icon="el-icon-check" style="width: 30px"></el-button>
            </el-input>

            <el-input placeholder="设置超时时间" v-model="ttl" size="small" style="width: 45% ; float: right">
              <template slot="prepend" style="width: 30px">TTL</template>
              <el-button slot="append" icon="el-icon-check" @click="updateTTl" style="width: 30px"></el-button>
            </el-input>
          </div>


<!--          主页-->
          <div v-if="mainType === 'index'">
            <div>
              <el-card class="box-card" shadow="always" style="float: left">
                <div slot="header" class="clearfix">
                  <span class="el-icon-info">服务器</span>
                  <!--                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                </div>
                <div class="text item">
                  <input class="input-index" type="button" disabled=true :value="'Redis版本:' + redisInfo.redis_version">
                  <input class="input-index" type="button" disabled=true :value="`OS:` + redisInfo.os">
                  <input class="input-index" type="button" disabled=true :value="`进程ID:` + redisInfo.process_id">
                </div>
              </el-card>
              <el-card class="box-card" shadow="always" style="float: right">
                <div slot="header" class="clearfix">
                  <span class="el-icon-s-operation">状态</span>
                  <!--                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                </div>
                <div class="text item">
                  <input class="input-index" type="button" disabled=true :value="'客户端连接数:' + redisInfo.connected_clients">
                  <input class="input-index" type="button" disabled=true :value="`历史连接数:` + redisInfo.total_connections_received">
                  <input class="input-index" type="button" disabled=true :value="`历史命令数:` + redisInfo.total_commands_processed">
                </div>
              </el-card>
            </div>
            <br>
              <el-card class="box-card-db" shadow="always">
                <div slot="header" class="clearfix">
                  <span class="el-icon-s-data">键值统计</span>
                  <!--                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
                </div>
                <el-table
                  :data="redisDbList"
                  style="width: 100%"
                  :default-sort = "{prop: 'date', order: 'descending'}"
                >
                  <el-table-column
                    prop="dbName"
                    label="DB"
                    sortable>
                  </el-table-column>
                  <el-table-column
                    prop="keys"
                    label="Keys"
                    sortable>
                  </el-table-column>
                  <el-table-column
                    prop="expires"
                    label="Expires"
                    sortable>
                  </el-table-column>
                  <el-table-column
                    prop="ttl"
                    label="Avg TTL"
                    sortable>
                  </el-table-column>
                </el-table>
              </el-card>
            <div>
              <el-card class="box-card-db" shadow="always">
                <div slot="header" class="clearfix">
                  <span class="el-icon-s-home">Redis信息全集</span>
                </div>
                <el-table
                  :data="redisInfoList"
                  style="width: 100%"
                  :default-sort = "{prop: 'date', order: 'descending'}"
                >
                  <el-table-column
                    prop="name"
                    label="Key"
                    sortable>
                  </el-table-column>
                  <el-table-column
                    prop="value"
                    label="Value"
                    sortable>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>

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
                label="ID">
              </el-table-column>
              <el-table-column
                prop="value"
                label="Value">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        redisInfo: {},
        redisInfoList: [],
        redisDbList: [],
        keyMap: new Map,
        textarea2: {},
        clientList: [],
        formLabelWidth: '80px',
        //当前client
        nowClient: {},
        // main块中显示的value类型
        mainType: 'index',
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
          this.refreshIndexInfo(data)
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
        this.mainType = 'index'
        const now = this.clientList[index];
        // 测试连接
        isRedisConnect(now.port, now.host, now.auth).then((data) => {
          console.log('这是连接信息');
          this.refreshIndexInfo(data)
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
      refreshIndexInfo: function(data){
        // 刷新页面中的redis连接信息
        console.log(data);
        this.redisInfo = data;
        const map = new Map(Object.entries(data));
        let list = [];
        let dblist = [];
        for (let[k,v] of map){
          if(k.startsWith('db')){
            dblist.push({"dbName":k,"keys":v.keys,"expires":v.expires,"ttl":v.avg_ttl})
          }else {
            list.push({"name":k,"value":v})
          }
        }
        console.log(map);
        console.log(typeof map);
        this.redisInfoList = list;
        this.redisDbList = dblist;
      },
      handleClose: function (index) {
        this.mainType = 'index'
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
          } else if ("list" === type || "hash" === type) {
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
          }else {
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
  .input-index{
    width: 100%;
    height: 32px;
    font-size: 13px;
  }

  .el-aside {
    color: #333;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 48%;
  }
  .box-card-db {
    width: 100%;
  }
</style>
