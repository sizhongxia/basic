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
      <DatePicker type="date" placeholder="按日期查询" v-model="searchValue" clearable></DatePicker>
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
      :width="1000"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <div style="width:100%;height:420px;overflow: auto;text-align: left;">
        <Form :model="formObj" :label-width="190" ref="baseForm">
          <Row>
              <Col span="24">
                  <FormItem label="请选择日期">
                    <DatePicker v-model="formObj.resDate" type="date" placeholder="请选择一个日期" clearable></DatePicker>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="200总指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.ncp200" placeholder="请输入200总指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="200总指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.ncp200Cv" placeholder="请输入200总指数涨幅"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="菜篮子产品价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.clzcp" placeholder="请输入菜篮子产品价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="菜篮子产品价格指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.clzcpCv" placeholder="请输入菜篮子产品价格指数涨幅"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="畜产品价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.xcp" placeholder="请输入畜产品价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="畜产品价格指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.xcpCv" placeholder="请输入畜产品价格指数涨幅"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="水产品价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.scp" placeholder="请输入水产品价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="水产品价格指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.scpCv" placeholder="请输入水产品价格指数涨幅"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="蔬菜价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.sc" placeholder="请输入蔬菜价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="蔬菜价格指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.scCv" placeholder="请输入蔬菜价格指数涨幅"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="水果价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.sg" placeholder="请输入水果价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="水果价格指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.sgCv" placeholder="请输入水果价格指数涨幅"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="粮油产品价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.lycp" placeholder="请输入粮油产品价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="粮油产品价格指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.lycpCv" placeholder="请输入粮油产品价格指数涨幅"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="粮食价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.ls" placeholder="请输入粮食价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="粮食价格指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.lsCv" placeholder="请输入粮食价格指数涨幅"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="食用油价格指数">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.syy" placeholder="请输入食用油价格指数"></InputNumber>
                  </FormItem>
              </Col>
              <Col span="12">
                  <FormItem label="食用油价格指数涨幅">
                    <InputNumber :step="0.01" style="width: 200px;" v-model="formObj.syyCv" placeholder="请输入食用油价格指数涨幅"></InputNumber>
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
import { loadMoaWpap200dzs, upinsertWpap200dzs, deleteWpap200dzs } from '@/api/moa'
export default {
  data () {
    return {
      searchValue: '',
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
        resDate: '',
        ncp200: 0,
        ncp200Cv: 0,
        clzcp: 0,
        clzcpCv: 0,
        xcp: 0,
        xcpCv: 0,
        scp: 0,
        scpCv: 0,
        sc: 0,
        scCv: 0,
        sg: 0,
        sgCv: 0,
        lycp: 0,
        lycpCv: 0,
        ls: 0,
        lsCv: 0,
        syy: 0,
        syyCv: 0
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
        title: '日期',
        key: 'resDate',
        minWidth: 200,
        tooltip: true
      }, {
        title: '200总指数',
        key: 'ncp200',
        minWidth: 140,
        tooltip: true
      }, {
        title: '200总指数涨幅',
        key: 'ncp200Cv',
        minWidth: 140,
        tooltip: true
      }, {
        title: '菜篮子产品指数',
        key: 'clzcp',
        minWidth: 140,
        tooltip: true
      }, {
        title: '菜篮子产品指数涨幅',
        key: 'clzcpCv',
        minWidth: 200,
        tooltip: true
      }, {
        title: '畜产品指数',
        key: 'xcp',
        minWidth: 140,
        tooltip: true
      }, {
        title: '畜产品指数涨幅',
        key: 'xcpCv',
        minWidth: 140,
        tooltip: true
      }, {
        title: '水产品指数',
        key: 'scp',
        minWidth: 140,
        tooltip: true
      }, {
        title: '水产品指数涨幅',
        key: 'scpCv',
        minWidth: 140,
        tooltip: true
      }, {
        title: '蔬菜价格指数',
        key: 'sc',
        minWidth: 140,
        tooltip: true
      }, {
        title: '蔬菜价格指数涨幅',
        key: 'scCv',
        minWidth: 140,
        tooltip: true
      }, {
        title: '水果价格指数',
        key: 'sg',
        minWidth: 140,
        tooltip: true
      }, {
        title: '水果价格指数涨幅',
        key: 'sgCv',
        minWidth: 140,
        tooltip: true
      }, {
        title: '粮油产品指数',
        key: 'lycp',
        minWidth: 140,
        tooltip: true
      }, {
        title: '粮油产品指数涨幅',
        key: 'lycpCv',
        minWidth: 140,
        tooltip: true
      }, {
        title: '粮食价格指数',
        key: 'ls',
        minWidth: 140,
        tooltip: true
      }, {
        title: '粮食价格指数涨幅',
        key: 'lsCv',
        minWidth: 140,
        tooltip: true
      }, {
        title: '食用油价格指数',
        key: 'syy',
        minWidth: 140,
        tooltip: true
      }, {
        title: '食用油价格指数涨幅',
        key: 'syyCv',
        minWidth: 200,
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
      let searchValue = this.searchValue
      let size = this.size
      let page = this.current
      const _this = this
      loadMoaWpap200dzs({ searchValue, page, size }).then(res => {
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
      deleteWpap200dzs({ resultId: params.row.resId }).then(res => {
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
      this.formObj.resDate = ''
      this.formObj.ncp200 = 0
      this.formObj.ncp200Cv = 0
      this.formObj.clzcp = 0
      this.formObj.clzcpCv = 0
      this.formObj.xcp = 0
      this.formObj.xcpCv = 0
      this.formObj.scp = 0
      this.formObj.scpCv = 0
      this.formObj.sc = 0
      this.formObj.scCv = 0
      this.formObj.sg = 0
      this.formObj.sgCv = 0
      this.formObj.lycp = 0
      this.formObj.lycpCv = 0
      this.formObj.ls = 0
      this.formObj.lsCv = 0
      this.formObj.syy = 0
      this.formObj.syyCv = 0
      this.baseFormModel = true
    },
    showEditForm (params) {
      this.$refs['baseForm'].resetFields()
      this.formObj.resId = params.row.resId
      this.formObj.resDate = params.row.resDate
      this.formObj.ncp200 = params.row.ncp200
      this.formObj.ncp200Cv = params.row.ncp200Cv
      this.formObj.clzcp = params.row.clzcp
      this.formObj.clzcpCv = params.row.clzcpCv
      this.formObj.xcp = params.row.xcp
      this.formObj.xcpCv = params.row.xcpCv
      this.formObj.scp = params.row.scp
      this.formObj.scpCv = params.row.scpCv
      this.formObj.sc = params.row.sc
      this.formObj.scCv = params.row.scCv
      this.formObj.sg = params.row.sg
      this.formObj.sgCv = params.row.sgCv
      this.formObj.lycp = params.row.lycp
      this.formObj.lycpCv = params.row.lycpCv
      this.formObj.ls = params.row.ls
      this.formObj.lsCv = params.row.lsCv
      this.formObj.syy = params.row.syy
      this.formObj.syyCv = params.row.syyCv
      this.baseFormModel = true
    },
    submitBaseFormHandle () {
      const _this = this
      _this.submiting = true
      upinsertWpap200dzs(_this.formObj).then(res => {
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
