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
      <Input style="width: 200px" placeholder="按年份查询" v-model="searchYear" clearable/>
      <Input style="width: 200px" placeholder="按月份查询" v-model="searchMonth" clearable/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;检索</Button>
    </Card>
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showCreateForm">新增</Button>
    <Table
      :border="false"
      :stripe="true"
      :show-header="true"
      :data="tableData"
      :loading="loading"
      :columns="columns"
      :highlight-row="true"
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
    <Modal
      v-model="baseFormModel"
      :title="formObj.resId === '' ? '新增' : '修改'"
      scrollable
      :width="900"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <div style="width:100%;height:260px;overflow: auto;text-align: left;">
        <Form :model="formObj" :label-width="190" ref="baseForm">
          <Row>
              <Col span="12">
                  <FormItem label="年份">
                    <InputNumber :min="2000" :step="1" :disabled="formObj.resId != ''" style="width: 200px;" v-model="formObj.dateYear" placeholder="请输入年份"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="月份">
                    <InputNumber :min="1" :max="12" :step="1" :disabled="formObj.resId != ''" style="width: 200px;" v-model="formObj.dateMonth" placeholder="请输入月份"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="24">
                  <FormItem label="200总指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.ncp200" placeholder="请输入200总指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="24">
                  <FormItem label="菜篮子产品价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.clzcp" placeholder="请输入菜篮子产品价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="24">
                  <FormItem label="粮油产品价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.ly" placeholder="请输入粮油产品价格指数"></InputNumber>
                  </FormItem>
              </Col>
          </Row>
        </Form>
      </div>
      <Spin size="large" fix v-if="submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">关闭</Button>
        <Button type="primary" @click="submitBaseFormHandle">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { loadMoaWpap200mzs, upinsertWpap200mzs, deleteWpap200mzs } from '@/api/moa'
export default {
  data () {
    return {
      searchYear: '',
      searchMonth: '',
      tableData: [],
      current: 1,
      total: 0,
      size: 10,
      loading: false,
      submiting: false,
      baseFormModel: false,
      deleting: false,
      formObj: {
        resId: '',
        dateYear: 2000,
        dateMonth: 1,
        ncp200: 0,
        clzcp: 0,
        ly: 0
      }
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
            }, '修改'),
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: '是否要删除当前记录？'
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
              }, '删除')
            ])
          ])
        }
      }, {
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '年份',
        key: 'dateYear',
        minWidth: 200,
        tooltip: true
      }, {
        title: '月份',
        key: 'dateMonth',
        minWidth: 200,
        tooltip: true
      }, {
        title: '200总指数',
        key: 'ncp200',
        minWidth: 140,
        tooltip: true
      }, {
        title: '菜篮子产品指数',
        key: 'clzcp',
        minWidth: 140,
        tooltip: true
      }, {
        title: '粮油产品指数',
        key: 'ly',
        minWidth: 140,
        tooltip: true
      }, {
        title: '创建时间',
        key: 'createAt',
        minWidth: 200,
        tooltip: true
      }]
    }
  },
  methods: {
    load () {
      this.loading = true
      let searchYear = this.searchYear
      let searchMonth = this.searchMonth
      let page = this.current
      let size = this.size
      const _this = this
      loadMoaWpap200mzs({ searchYear, searchMonth, page, size }).then(res => {
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
      deleteWpap200mzs({ resultId: params.row.resId }).then(res => {
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
    showCreateForm () {
      this.$refs['baseForm'].resetFields()
      this.formObj.resId = ''
      this.formObj.dateYear = 2000
      this.formObj.dateMonth = 1
      this.formObj.ncp200 = 0
      this.formObj.clzcp = 0
      this.formObj.ly = 0
      this.baseFormModel = true
    },
    showEditForm (params) {
      this.$refs['baseForm'].resetFields()
      this.formObj.resId = params.row.resId
      this.formObj.dateYear = params.row.dateYear
      this.formObj.dateMonth = params.row.dateMonth
      this.formObj.ncp200 = params.row.ncp200
      this.formObj.clzcp = params.row.clzcp
      this.formObj.ly = params.row.ly
      this.baseFormModel = true
    },
    submitBaseFormHandle () {
      const _this = this
      _this.submiting = true
      upinsertWpap200mzs(_this.formObj).then(res => {
        _this.submiting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.$Modal.success({
            title: '保存成功'
          })
          if (!_this.formObj.resId) {
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
    },
    closeBaseFormHandle () {
      this.baseFormModel = false
      this.$refs['baseForm'].resetFields()
    },
    closeSendFormHandle () {
      this.selectUserFormModel = false
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
