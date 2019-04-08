<style lang="less">
@import "./index.less";
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal{
        top: 0;
    }
}
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable placeholder="按系统消息标题查询" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;{{ $t('search') }}</Button>
    </Card>
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showCreateForm">新建系统消息</Button>
    <Table
      :border="false"
      :stripe="true"
      :show-header="true"
      :data="tableData"
      :loading="loading"
      :columns="columns"
      :highlight-row="true"
      editable
      @on-sort-change="handleSortChange"
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
    <Modal
      v-model="baseFormModel"
      :title="formObj.resId === '' ? '新增' : '修改'"
      scrollable
      :width="820"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Form :model="formObj" :label-width="120" :rules="ruleValidate" ref="baseForm">
        <FormItem label="消息标题" prop="msgTitle">
          <Input v-model="formObj.msgTitle" placeholder="请输入消息标题"/>
        </FormItem>
        <FormItem label="消息内容" prop="msgContent">
          <editor ref="editor" @on-change="handleMsgContentChange"/>
        </FormItem>
        <FormItem label="是否全员接收" prop="isEntire">
          <Select v-model="formObj.isEntire" style="width:100%">
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="submiting || loadingItem"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">关闭</Button>
        <Button type="primary" @click="submitBaseFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="selectUserFormModel"
      title="请输入要接收系统的消息的用户名"
      scrollable
      :width="420"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Form :model="releaseObj" :label-width="120">
        <FormItem label="用户名">
          <Input v-model="releaseObj.userName" placeholder="请输入用户名"/>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="pushing"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeSendFormHandle">关闭</Button>
        <Button type="primary" @click="release">发送</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { loadSystemMessages, deleteSystemMessage, systemMessageDetail, releaseSystemMessage, upinsertSystemMessage } from '@/api/systemMessage'
import Editor from '_c/editor'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      submiting: false,
      formObj: {
        resId: '',
        msgTitle: '',
        msgContent: '',
        isEntire: ''
      },
      releaseObj: {
        resultId: '',
        userName: ''
      },
      baseFormModel: false,
      selectUserFormModel: false,
      deleting: false,
      pushing: false,
      loadingItem: false,
      current: 1,
      searchValue: '',
      orderField: '',
      orderType: '',
      createItemFormModel: false
    }
  },
  computed: {
    columns () {
      return [{
        title: ' ',
        key: 'action',
        width: 280,
        fixed: 'left',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showEditForm(params)
                }
              }
            }, this.$t('edit')),
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: '是否要删除当前系统消息？'
              },
              on: {
                'on-ok': () => {
                  this.handleDelete(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text',
                  loading: this.deleting
                }
              }, this.$t('delete'))
            ]),
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: '是否要发布当前系统消息？'
              },
              on: {
                'on-ok': () => {
                  this.handlePush(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text',
                  loading: this.pushing
                }
              }, '发布')
            ])
          ])
        }
      }, {
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '消息标题',
        key: 'msgTitle',
        minWidth: 200,
        tooltip: true
      }, {
        title: '发布状态',
        key: 'sendStatue',
        sortable: 'custom',
        minWidth: 140,
        tooltip: true
      }, {
        title: '全员接收',
        key: 'isEntire',
        sortable: 'custom',
        minWidth: 140,
        tooltip: true
      }, {
        title: '接收人数',
        key: 'receiveNum',
        minWidth: 140,
        tooltip: true
      }, {
        title: '创建时间',
        key: 'createAt',
        sortable: 'custom',
        minWidth: 140,
        tooltip: true
      }]
    },
    ruleValidate () {
      return {
        msgTitle: [{
          required: true,
          message: '请输入消息标题',
          trigger: 'blur'
        }],
        msgContent: [{
          required: true,
          message: '请输入消息内容',
          trigger: 'blur'
        }],
        isEntire: [{
          required: true,
          message: '请选择是否全员接收',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    load () {
      this.loading = true
      let searchValue = this.searchValue
      let size = this.size
      let page = this.current
      let orderField = this.orderField
      let orderType = this.orderType
      const _this = this
      loadSystemMessages({ searchValue, page, size, orderField, orderType }).then(res => {
        _this.loading = false
        if (res.status === 200 && res.data.code === 200) {
          let data = res.data.data
          _this.tableData = data.list
          _this.current = data.current
          _this.total = data.total
          _this.size = data.size
        }
      }).catch(function (reason) {
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
        _this.tableData = []
        _this.loading = false
      })
    },
    handleDelete (params) {
      const _this = this
      _this.deleting = true
      deleteSystemMessage({ resultId: params.row.resId }).then(res => {
        _this.deleting = false
        if (res.status === 200 && res.data.code === 200) {
          this.load()
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.deleting = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handleSearch (e) {
      this.load()
    },
    changePage (page) {
      this.current = page
      this.load()
    },
    changePageSize (size) {
      this.size = size
      this.load()
    },
    handleSortChange (e) {
      this.orderField = e.key
      this.orderType = e.order
      this.load()
    },
    showCreateForm () {
      this.$refs['baseForm'].resetFields()
      this.formObj.resId = ''
      this.formObj.msgTitle = ''
      this.formObj.msgContent = ''
      this.$refs.editor.setHtml('')
      this.formObj.isEntire = ''
      this.baseFormModel = true
    },
    showEditForm (params) {
      const _this = this
      _this.baseFormModel = true
      _this.$refs['baseForm'].resetFields()
      _this.loadingItem = true
      systemMessageDetail({ resultId: params.row.resId }).then(res => {
        _this.loadingItem = false
        if (res.status === 200 && res.data.code === 200) {
          _this.formObj = res.data.data
          _this.$refs.editor.setHtml(_this.formObj.msgContent)
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingItem = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
      this.formObj.msgTitle = params.row.msgTitle
      this.formObj.msgContent = params.row.msgContent
      this.$refs.editor.setHtml(params.row.msgContent)
      this.formObj.isEntire = params.row.isEntireVal
      this.baseFormModel = true
    },
    handlePush (params) {
      const _this = this
      _this.releaseObj.resultId = params.row.resId
      if (params.row.isEntireVal === 'Y') {
        _this.release()
      } else {
        _this.releaseObj.userName = ''
        _this.selectUserFormModel = true
      }
    },
    release () {
      const _this = this
      _this.pushing = true
      releaseSystemMessage(_this.releaseObj).then(res => {
        _this.pushing = false
        if (res.status === 200 && res.data.code === 200) {
          _this.releaseObj.userName = ''
          _this.selectUserFormModel = false
          _this.load()
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.pushing = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handleMsgContentChange (html) {
      this.formObj.msgContent = html
    },
    submitBaseFormHandle () {
      const _this = this
      _this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertSystemMessage(_this.formObj).then(res => {
            _this.submiting = false
            if (res.status === 200 && res.data.code === 200) {
              _this.$Modal.success({
                title: '保存成功'
              })
              if (!_this.formObj.dictId) {
                _this.closeBaseFormHandle()
              }
              _this.load()
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.submiting = false
            _this.closeBaseFormHandle()
            _this.$Modal.error({
              title: _this.$t('error_message_info') + reason.message
            })
          })
        }
      })
    },
    closeBaseFormHandle () {
      this.baseFormModel = false
      this.$refs['baseForm'].resetFields()
    },
    closeSendFormHandle () {
      this.selectUserFormModel = false
    }
  },
  components: {
    Editor
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
