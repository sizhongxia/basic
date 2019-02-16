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
.ivu-select-dropdown {
  z-index: 9999999 !important;
}
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable placeholder="按百科知识标题检索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
    </Card>
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showCreateForm">新增百科知识</Button>
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
      :title="formObj.encyclId === '' ? $t('create') : $t('update')"
      scrollable
      :width="980"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <div style="width:100%;height:420px;overflow: auto;text-align: left;">
        <Form :model="formObj" :label-width="160" :rules="ruleValidate" ref="baseForm">
          <Row style="padding-right: 60px;">
            <Col span="14">
              <FormItem label="百科知识标题" prop="encyclTitle">
                <Input v-model="formObj.encyclTitle" placeholder="请输入百科知识标题"/>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="百科知识分类" prop="encyclType">
                <Select v-model="formObj.encyclType" style="width:100%">
                  <Option v-for="item in encyclClassifys" :key="item.dictItemId" :value="item.dictItemValue">{{item.dictItemName}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="百科知识内容" prop="encyclContent">
                <editor ref="editor" @on-change="handleEncyclContentChange"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="发布状态" prop="releaseState">
                <Select v-model="formObj.releaseState" style="width:100%">
                  <Option value="Y">已发布</Option>
                  <Option value="N">未发布</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="发布日期" prop="releaseTime">
                <DatePicker type="date" v-model="formObj.releaseTime" format="yyyy-MM-dd" placeholder="请选择发布日期" style="width: 100%"></DatePicker>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="百科知识来源" prop="encyclOrigin">
                <Input v-model="formObj.encyclOrigin" placeholder="请输入百科知识来源"/>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="百科标签" prop="labelNames">
                <Tag v-for="item in formObj.labelNames" :key="item.labelName" :name="item.labelName" type="dot" closable color="primary" @on-close="handleRemove">{{ item.labelName }}</Tag>
                <Button icon="ios-add" type="dashed" @click="handleAddLabel">添加新标签</Button>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="百科知识封面图片" prop="encyclCoverPic">
                <Upload
                  type="select"
                  accept=".jpg,.png"
                  :format="uploadFormat"
                  :headers="uploadHeaders"
                  :before-upload="uploadPicBeforeHandle"
                  :on-success="uploadPicSuccessHandle"
                  :on-error="uploadPicErrorHandle"
                  :on-format-error="uploadPicErrorFormatHandle"
                  :on-exceeded-size="uploadPicErrorSizeHandle"
                  :max-size="4096"
                  :show-upload-list="false"
                  :action="baseUrl + 'upload'">
                  <Button icon="ios-cloud-upload-outline">选择百科封面图片</Button>
                </Upload>
                <img @click="showBigPictureModel(formObj.encyclCoverPic)" v-if="formObj.encyclCoverPic" style="width: 120px;min-height: 80px;display: block;margin-top: 10px;" :src="formObj.encyclCoverPic">
              </FormItem>
            </Col>
          </Row>
          <Spin size="large" fix v-if="pictrueUploading"></Spin>
        </Form>
      </div>
      <Spin size="large" fix v-if="submiting || loadingEncyclClassifyDicts || deleteEncyclLabeling"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">关闭</Button>
        <Button type="primary" @click="submitBaseFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal v-model="picModelVisible">
      <img :src="picModelPicUrl" v-if="picModelPicUrl" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
    <Modal
      v-model="showAddLabelFormModel"
      title="新增标签"
      scrollable
      :width="430"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Input v-model="newLabelName" placeholder="请输入新标签名称"/>
      <div slot="footer">
        <Button type="text" @click="closeAddLabelFormModel">关闭</Button>
        <Button type="primary" :disabled="newLabelName == ''" @click="submitAddLabelFormHandle">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { loadEncycls, encyclDetail, deleteEncycl, upinsertEncycl, deleteEncyclLabel } from '@/api/yeetong/encycl'
import config from '@/config'
import Editor from '_c/editor'
import { selectDictItemsByCode } from '@/api/dict'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      baseUrl: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro,
      uploadFormat: ['jpg', 'png'],
      uploadHeaders: {
        type: 'material_imgs'
      },
      loading: false,
      submiting: false,
      formObj: {
        encyclId: '',
        encyclTitle: '',
        encyclType: '',
        encyclOrigin: '',
        encyclCoverPic: '',
        encyclContent: '',
        releaseState: '',
        releaseTime: '',
        labelNames: []
      },
      labels: [],
      picModelVisible: false,
      picModelPicUrl: '',
      loadingObj: false,
      baseFormModel: false,
      deleting: false,
      current: 1,
      searchValue: '',
      orderField: '',
      orderType: '',
      pictrueUploading: false,
      newLabelName: '',
      showAddLabelFormModel: false,
      loadingEncyclClassifyDicts: false,
      encyclClassifys: [],
      deleteEncyclLabeling: false
    }
  },
  components: {
    Editor
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
                title: '是否要删除当前知识百科'
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
      }, {
        title: '知识百科标题',
        key: 'encyclTitle',
        minWidth: 200,
        tooltip: true
      }, {
        title: '知识百科分类',
        key: 'encyclType',
        minWidth: 360,
        tooltip: true
      }, {
        title: this.$t('create_at'),
        sortable: 'custom',
        width: 210,
        key: 'createAt'
      }, {
        title: '修改时间',
        sortable: 'custom',
        width: 210,
        key: 'updateAt'
      }]
    },
    ruleValidate () {
      return {
        encyclTitle: [{
          required: true,
          message: '请输入知识百科标题',
          trigger: 'blur'
        }],
        encyclType: [{
          required: true,
          message: '请选择知识百科分类',
          trigger: 'change'
        }],
        encyclCoverPic: [{
          required: true,
          message: '请上传知识百科封面图',
          trigger: 'blur'
        }],
        encyclContent: [{
          required: true,
          message: '请输入知识百科内容',
          trigger: 'blur'
        }],
        releaseState: [{
          required: true,
          message: '请选择发布状态',
          trigger: 'change'
        }],
        releaseTime: [{
          required: true,
          type: 'date',
          message: '请选择发布日期',
          trigger: 'change'
        }],
        labelNames: [{
          required: true,
          type: 'array',
          message: '请至少添加一个标签',
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
      loadEncycls({ searchValue, page, size, orderField, orderType }).then(res => {
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
      deleteEncycl({ resultId: params.row.encyclId }).then(res => {
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
    uploadPicBeforeHandle () {
      this.pictrueUploading = true
    },
    uploadPicSuccessHandle (response, file, fileList) {
      console.info(file.response.data)
      this.formObj.encyclCoverPic = file.response.data
      this.pictrueUploading = false
    },
    uploadGoodsPicSuccessHandle (response, file, fileList) {
      this.pictrueUploading = false
      this.loadGoodsPics()
    },
    uploadPicErrorHandle (file, fileList) {
      const _this = this
      _this.pictrueUploading = false
      _this.$Modal.error({
        title: _this.$t('upload_error')
      })
    },
    uploadPicErrorSizeHandle (file, fileList) {
      const _this = this
      _this.pictrueUploading = false
      _this.$Modal.error({
        title: _this.$t('upload_error_size')
      })
    },
    uploadPicErrorFormatHandle (file, fileList) {
      const _this = this
      _this.pictrueUploading = false
      _this.$Modal.error({
        title: _this.$t('upload_error_format')
      })
    },
    showCreateForm () {
      const _this = this
      _this.$refs.editor.setHtml('')
      _this.formObj.labelNames = []
      _this.baseFormModel = true
      _this.loadingEncyclClassifyDicts = true
      selectDictItemsByCode({ code: 'encycl_classify' }).then(res => {
        _this.loadingEncyclClassifyDicts = false
        if (res.status === 200 && res.data.code === 200) {
          _this.encyclClassifys = res.data.data.list
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingEncyclClassifyDicts = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showEditForm (params) {
      const _this = this
      _this.baseFormModel = true
      _this.loadingObj = true
      encyclDetail({ resultId: params.row.encyclId }).then(res => {
        _this.loadingObj = false
        if (res.status === 200 && res.data.code === 200) {
          _this.formObj = res.data.data
          _this.$refs.editor.setHtml(res.data.data.encyclContent)
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingObj = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
      _this.loadingEncyclClassifyDicts = true
      selectDictItemsByCode({ code: 'encycl_classify' }).then(res => {
        _this.loadingEncyclClassifyDicts = false
        if (res.status === 200 && res.data.code === 200) {
          _this.encyclClassifys = res.data.data.list
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingEncyclClassifyDicts = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    submitBaseFormHandle () {
      const _this = this
      _this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertEncycl(_this.formObj).then(res => {
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
      this.baseFormModel = false
      this.formObj.encyclId = ''
      this.formObj.encyclTitle = ''
      this.formObj.encyclType = ''
      this.formObj.encyclOrigin = ''
      this.formObj.encyclCoverPic = ''
      this.formObj.encyclContent = ''
      this.formObj.labelNames = []
      this.$refs.editor.setHtml('')
      this.$refs['baseForm'].resetFields()
    },
    showBigPictureModel (pic) {
      this.picModelVisible = true
      this.picModelPicUrl = pic
    },
    handleEncyclContentChange (html) {
      this.formObj.encyclContent = html
    },
    handleAddLabel () {
      this.showAddLabelFormModel = true
    },
    closeAddLabelFormModel () {
      this.newLabelName = ''
      this.showAddLabelFormModel = false
    },
    submitAddLabelFormHandle () {
      if (this.newLabelName) {
        var newLabelNames = this.newLabelName.split(',')
        for (var inx in newLabelNames) {
          if (!newLabelNames[inx]) {
            continue
          }
          let length = this.formObj.labelNames.length
          for (var i = 0; i < length; i++) {
            if (newLabelNames[inx] === this.formObj.labelNames[i].labelName) {
              continue
            }
          }
          this.formObj.labelNames.push({
            resId: '',
            labelName: newLabelNames[inx]
          })
        }
        this.newLabelName = ''
        this.showAddLabelFormModel = false
      }
    },
    handleRemove (event, name) {
      const _this = this
      let length = _this.formObj.labelNames.length
      for (var i = 0; i < length; i++) {
        if (name === _this.formObj.labelNames[i].labelName) {
          let resId = this.formObj.labelNames[i].resId
          if (resId) {
            _this.deleteEncyclLabeling = true
            deleteEncyclLabel({ resultId: resId }).then(res => {
              _this.deleteEncyclLabeling = false
              if (res.status === 200 && res.data.code === 200) {
                console.info(res)
                _this.formObj.labelNames.splice(i, 1)
              } else {
                _this.$Modal.error({
                  title: _this.$t('error_message_info') + res.data.message
                })
              }
            }).catch(function (reason) {
              _this.deleteEncyclLabeling = false
              _this.$Modal.error({
                title: _this.$t('error_message_info') + reason.message
              })
            })
          } else {
            _this.formObj.labelNames.splice(i, 1)
          }
          return
        }
      }
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
