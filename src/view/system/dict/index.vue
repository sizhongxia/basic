<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable placeholder="按字典名称或编码查询" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;{{ $t('search') }}</Button>
    </Card>
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showCreateForm">新建字典</Button>
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
      :title="formObj.dictId === '' ? '新增' : '修改'"
      scrollable
      width="620"
      mask
      :mask-closable="false"
      :closable="false">
      <Form :model="formObj" :label-width="120" :rules="ruleValidate" ref="baseForm">
        <FormItem label="字典名称" prop="dictName">
            <Input v-model="formObj.dictName" placeholder="请输入字典名称"/>
        </FormItem>
        <FormItem label="字典编码" prop="dictCode">
            <Input v-model="formObj.dictCode" placeholder="请输入字典编码"/>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">关闭</Button>
        <Button type="primary" @click="submitBaseFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="createItemFormModel"
      title="新增字典项"
      scrollable
      width="620"
      height="420"
      mask
      :mask-closable="false"
      :closable="false">
      <Form :model="itemFormObj" :label-width="120" :rules="ruleItemValidate" ref="createItemForm">
        <FormItem label="字典编码">
          <Input v-model="itemFormObj.dictCode" readonly/>
        </FormItem><FormItem label="字典项名称" prop="dictItemName">
          <Input v-model="itemFormObj.dictItemName" placeholder="请输入字典项名称"/>
        </FormItem>
        <FormItem label="字典项值" prop="dictItemValue">
          <Input v-model="itemFormObj.dictItemValue" placeholder="请输入字典项值"/>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeItemFormHandle">关闭</Button>
        <Button type="primary" @click="submitItemFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="dictItemModel"
      scrollable
      width="620"
      mask
      :mask-closable="false">
      <p slot="header">
          <Icon type="md-arrow-dropright" />
          <span>字典项</span>
      </p>
      <div>
        <Table
          :border="false"
          :stripe="true"
          :show-header="true"
          :data="dictItems"
          :loading="loadingItem"
          :columns="dictItemColumns"
          :height="260"
          :highlight-row="true"
        ></Table>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { loadDicts, selectDictItemsByCode, deleteDict, deleteDictItem, upinsertDict, upinsertItem } from '@/api/dict'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      submiting: false,
      formObj: {
        dictId: '',
        dictName: '',
        dictCode: ''
      },
      baseFormModel: false,
      deleting: false,
      current: 1,
      searchValue: '',
      orderField: '',
      orderType: '',
      loadingItem: false,
      dictItems: [],
      dictItemModel: false,
      createItemFormModel: false,
      itemFormObj: {
        dictCode: '',
        dictItemName: '',
        dictItemValue: ''
      }
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
                title: this.$t('table_handle_delete_tip')
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
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showDictItemModel(params)
                }
              }
            }, '字典项'),
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showCreateItemFormModel(params)
                }
              }
            }, '新增项')
          ])
        }
      }, {
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '字典名称',
        key: 'dictName',
        sortable: 'custom',
        minWidth: 200,
        tooltip: true
      }, {
        title: '字典编码',
        key: 'dictCode',
        sortable: 'custom',
        minWidth: 140,
        tooltip: true
      }]
    },
    dictItemColumns () {
      return [{
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '字典编码',
        key: 'dictCode',
        minWidth: 100,
        tooltip: true
      }, {
        title: '字典项名称',
        key: 'dictItemName',
        minWidth: 120,
        tooltip: true
      }, {
        title: '字典项值',
        key: 'dictItemValue',
        minWidth: 100,
        tooltip: true
      }, {
        title: ' ',
        key: 'action',
        width: 80,
        fixed: 'right',
        render: (h, params) => {
          return h('div', [
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: this.$t('table_handle_delete_tip')
              },
              on: {
                'on-ok': () => {
                  this.handleDeleteItem(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text',
                  loading: this.deleting
                }
              }, this.$t('delete'))
            ])
          ])
        }
      }]
    },
    ruleValidate () {
      return {
        dictName: [{
          required: true,
          message: '请输入字典名称',
          trigger: 'blur'
        }],
        dictCode: [{
          required: true,
          message: '请输入字典编码',
          trigger: 'blur'
        }]
      }
    },
    ruleItemValidate () {
      return {
        dictItemName: [{
          required: true,
          message: '请输入字典项名称',
          trigger: 'blur'
        }],
        dictItemValue: [{
          required: true,
          message: '请输入字典项值',
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
      loadDicts({ searchValue, page, size, orderField, orderType }).then(res => {
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
      deleteDict({ resultId: params.row.dictId }).then(res => {
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
      this.formObj.dictId = ''
      this.formObj.dictName = ''
      this.formObj.dictCode = ''
      this.baseFormModel = true
    },
    showEditForm (params) {
      this.$refs['baseForm'].resetFields()
      this.formObj.dictId = params.row.dictId
      this.formObj.dictName = params.row.dictName
      this.formObj.dictCode = params.row.dictCode
      this.baseFormModel = true
    },
    submitBaseFormHandle () {
      const _this = this
      _this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertDict(_this.formObj).then(res => {
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
    },
    showDictItemModel (param) {
      const _this = this
      _this.dictItemModel = true
      _this.loadDictItems(param.row.dictCode)
      
    },
    loadDictItems (code) {
      const _this = this
      _this.loadingItem = true
      selectDictItemsByCode({ code: code }).then(res => {
        _this.loadingItem = false
        if (res.status === 200 && res.data.code === 200) {
          let data = res.data.data
          _this.dictItems = data.list
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
    },
    showCreateItemFormModel (param) {
      const _this = this
      _this.itemFormObj.dictCode = param.row.dictCode
      _this.createItemFormModel = true
    },
    closeItemFormHandle (param) {
      const _this = this
      _this.itemFormObj = {
        dictCode: '',
        dictItemName: '',
        dictItemValue: ''
      }
      _this.createItemFormModel = false
    },
    submitItemFormHandle () {
      const _this = this
      _this.$refs['createItemForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertItem(_this.itemFormObj).then(res => {
            _this.submiting = false
            if (res.status === 200 && res.data.code === 200) {
              _this.$Modal.success({
                title: '保存成功'
              })
              _this.itemFormObj.dictItemName = ''
              _this.itemFormObj.dictItemValue = ''
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.submiting = false
            _this.closeItemFormHandle()
            _this.$Modal.error({
              title: _this.$t('error_message_info') + reason.message
            })
          })
        }
      })
    },
    handleDeleteItem (params) {
      const _this = this
      _this.deleting = true
      deleteDictItem({ resultId: params.row.dictItemId }).then(res => {
        _this.deleting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.loadDictItems(params.row.dictCode)
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
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
