<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable placeholder="请输入新闻标题检索" class="search-input" v-model="title"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;{{ $t('search') }}</Button>
    </Card>
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showCreateForm">{{ $t('create') }}</Button>
    <Table
      :border="false"
      :stripe="true"
      :show-header="true"
      :data="tableData"
      :loading="loading"
      :columns="columns"
      size="default"
      :highlight-row="true"
      editable
      @on-sort-change="handleSortChange"
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
    <Modal
      v-model="baseFormModel"
      :title="formObj.organizeId === '' ? $t('create') : $t('update')"
      scrollable
      width="620"
      mask
      :mask-closable="false"
      :closable="false">
      <Form :model="formObj" :label-width="80" :rules="ruleValidate" ref="baseForm">
        <FormItem :label="$t('organize_name')" prop="organizeName">
            <Input v-model="formObj.organizeName" :placeholder="$t('please_input')+$t('organize_name')"/>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">{{ $t('i.modal.cancelText') }}</Button>
        <Button type="primary" @click="submitBaseFormHandle">{{ $t('i.modal.okText') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { loadNews } from '@/api/yeetong/news'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      submiting: false,
      formObj: {
        organizeId: '',
        organizeName: ''
      },
      baseFormModel: false,
      deleting: false,
      current: 1,
      title: '',
      orderField: '',
      orderType: ''
    }
  },
  computed: {
    columns () {
      return [{
        title: ' ',
        key: 'action',
        width: 180,
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
            ])
          ])
        }
      }, {
        type: 'index',
        width: 60,
        align: 'center'
      },
      {
        title: '标题',
        key: 'newsTitle',
        width: 200,
        tooltip: true
        // https://www.yeetong.cn/news/5c13c3b066779372ce86d686
      },
      {
        title: '关键词',
        key: 'newsKeywords',
        minWidth: 200,
        tooltip: true
      },
      {
        title: '访问量',
        key: 'pageViewNum',
        sortable: 'custom',
        minWidth: 200,
        tooltip: true
      },
      {
        title: '发布状态',
        key: 'releaseState',
        width: 120,
        sortable: 'custom',
        render: (h, params) => {
          const row = params.row
          const color = row.releaseState === 'Y' ? 'success' : 'warning'
          const text = row.releaseState === 'Y' ? '已发布' : '未发布'
          return h('Tag', {
            props: {
              color: color
            }
          }, text)
        }
      },
      {
        title: '发布时间',
        key: 'releaseTime',
        sortable: 'custom',
        minWidth: 150,
        tooltip: true
      },
      {
        title: this.$t('create_at'),
        sortable: 'custom',
        width: 210,
        key: 'createAt'
      }]
    },
    ruleValidate () {
      return {
        organizeName: [{
          required: true,
          message: this.$t('please_input') + this.$t('organize_name'),
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    load () {
      this.loading = true
      let title = this.title
      let size = this.size
      let page = this.current
      let orderField = this.orderField
      let orderType = this.orderType
      const _this = this
      loadNews({ title, page, size, orderField, orderType }).then(res => {
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
      deleteOrganize({ resultId: params.row.organizeId }).then(res => {
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
      this.formObj.organizeId = ''
      this.formObj.organizeName = ''
      this.baseFormModel = true
    },
    showEditForm (params) {
      this.formObj.organizeId = params.row.organizeId
      this.formObj.organizeName = params.row.organizeName
      this.baseFormModel = true
    },
    submitBaseFormHandle () {
      const _this = this
      _this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertOrganize(_this.formObj).then(res => {
            _this.submiting = false
            if (res.status === 200 && res.data.code === 200) {
              _this.closeBaseFormHandle()
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
      this.formObj.organizeId = ''
      this.formObj.organizeName = ''
      this.baseFormModel = false
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
