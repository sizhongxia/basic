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
      <Input clearable placeholder="按应用名称查询" class="search-input" v-model="searchValue"/>
      <Select v-model="searchChargingMode" class="search-input" clearable placeholder="请选择付费模式查询">
        <Option value="Free">免费</Option>
        <Option value="Fees">付费</Option>
      </Select>
      <Select v-model="searchState" class="search-input" clearable placeholder="请选择开发状态查询">
        <Option value="Develop">开发中</Option>
        <Option value="Release">已发布</Option>
        <Option value="Maintain">维护中</Option>
        <Option value="Offline">已下线</Option>
      </Select>
      <Select v-model="searchShow" class="search-input" clearable placeholder="请选择展示状态查询">
        <Option value="Y">展示</Option>
        <Option value="N">不展示</Option>
      </Select>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;{{ $t('search') }}</Button>
    </Card>
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showCreateForm">新建应用</Button>
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
      :title="formObj.funcId === '' ? '新增' : '修改'"
      scrollable
      width="760"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Form :model="formObj" :label-width="120" :rules="ruleValidate" ref="baseForm">
        <Row style="padding-right: 60px;">
          <Col span="24">
            <FormItem label="应用名称" prop="funcName">
              <Input v-model="formObj.funcName" placeholder="请输入应用名称"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="应用图标" prop="funcIcon">
              <Input v-model="formObj.funcIcon" placeholder="请输入应用图标地址">
                <Button slot="append" @click="uploadNewsCoverPic" icon="ios-cloud-upload-outline">上传</Button>
              </Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="应用简介" prop="funcSynopsis">
              <Input type="textarea" v-model="formObj.funcSynopsis" :maxlength="180" placeholder="请输入应用简介"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="应用开发状态" prop="funcState">
              <Select v-model="formObj.funcState" style="width:100%">
                <Option value="Develop">开发中</Option>
                <Option value="Release">已发布</Option>
                <Option value="Maintain">维护中</Option>
                <Option value="Offline">已下线</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="应用展示状态" prop="funcShow">
              <Select v-model="formObj.funcShow" style="width:100%">
                <Option value="Y">展示</Option>
                <Option value="N">不展示</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="应用版本" prop="funcVersion">
              <Input v-model="formObj.funcVersion" placeholder="请输入应用版本(例：v-1.0)"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="应用付费模式" prop="funcChargingMode">
              <Select v-model="formObj.funcChargingMode" style="width:100%">
                <Option value="Free">免费</Option>
                <Option value="Fees">付费</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="应用费用" prop="funcFee">
              <InputNumber :max="9999999" :min="0" :step="0.01"
              style="width:100%" v-model="formObj.funcFee" placeholder="请输入应用费用"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="付费周期(月)" prop="funcFeeCycle">
              <InputNumber :max="1200" :min="0" :step="1"
              style="width:100%" v-model="formObj.funcFeeCycle" placeholder="请输入应用付费周期"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Spin size="large" fix v-if="loading || submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">关闭</Button>
        <Button type="primary" @click="submitBaseFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="detailContentFormModel"
      title="修改功能详细描述内容"
      scrollable
      width="820"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Form :model="detailContentFormObj" :label-width="0" ref="detailContentForm">
        <editor ref="editor" @on-change="handleDetailContentChange"/>
      </Form>
      <Spin size="large" fix v-if="loadingDecription || submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeDetailContentFormandle">关闭</Button>
        <Button type="primary" @click="submitDetailContentFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal v-model="uploadFuncIconModel">
      <Upload
        type="drag"
        accept=".jpg,.png"
        :multiple="false"
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
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>单击或拖动文件到此处上传</p>
        </div>
        <Spin size="large" fix v-if="pictrueUploading"></Spin>
      </Upload>
      <div slot="footer" style="display: none;"></div>
    </Modal>
    <Modal
      v-model="funcPlatformInfoModel"
      scrollable
      width="980"
      mask
      :mask-closable="false"
      class-name="vertical-center-modal">
      <p slot="header">
          <Icon type="md-arrow-dropright" />
          <span>适用平台</span>
      </p>
      <div>
        <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showCreatePaltForm">新建</Button>
        <Table
          :border="false"
          :stripe="true"
          :show-header="true"
          :data="platformInfos"
          :loading="loadingPlatformInfos"
          :columns="funcPlatformInfoColumns"
          :height="280"
          :highlight-row="true"
        ></Table>
      </div>
      <div slot="footer">
        <Button type="text" @click="cancelFuncPlatformInfoModel">关闭</Button>
      </div>
    </Modal>
    <Modal
      v-model="basePlatFormModel"
      :title="platformObj.resId === '' ? '新增' : '修改'"
      scrollable
      width="520"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Form :model="platformObj" :label-width="120" :rules="rulePlatFormValidate" ref="basePlatForm">
        <FormItem label="选择平台" prop="platformType">
          <Select v-model="platformObj.platformType" style="width:100%" :disabled="platformObj.resId != ''">
            <Option v-for="type in platformTypeDicts" :key="type.dictItemId" :value="type.dictItemValue">{{type.dictItemName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="入口地址" prop="inletUrl">
          <Input v-model="platformObj.inletUrl" placeholder="请输入应用入口地址"/>
        </FormItem>
        <FormItem label="应用版本" prop="version">
          <Input v-model="platformObj.version" placeholder="请输入应用版本(例：v-1.0)"/>
        </FormItem>
        <FormItem label="可用状态" prop="canUse">
          <Select v-model="platformObj.canUse" style="width:100%">
            <Option value="Y">可用</Option>
            <Option value="N">不可用</Option>
          </Select>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="loading || submiting || loadingPlatformDicts"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBasePlatFormHandle">关闭</Button>
        <Button type="primary" @click="submitBasePlatFormHandle">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { loadFuncs, upinsertFunc, deleteFunc, funcDetail, funcDescription, upinsertFuncDescription, funcPlatformInfos, upinsertFuncPlatform, deleteFuncPlatform } from '@/api/func'
import { selectDictItemsByCode } from '@/api/dict'
import config from '@/config'
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
        funcId: '',
        funcName: '',
        funcIcon: '',
        funcVersion: '',
        funcSynopsis: '',
        funcState: '',
        funcShow: '',
        funcChargingMode: '',
        funcFee: 0,
        funcFeeCycle: 0
      },
      baseFormModel: false,
      deleting: false,
      current: 1,
      searchValue: '',
      searchChargingMode: '',
      searchState: '',
      searchShow: '',
      orderField: '',
      orderType: '',
      uploadFuncIconModel: false,
      baseUrl: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro,
      uploadFormat: ['jpg', 'png'],
      uploadHeaders: {
        type: 'material_imgs'
      },
      pictrueUploading: false,
      detailContentFormModel: false,
      detailContentFormObj: {
        funcId: '',
        funcDescription: ''
      },
      loadingDecription: false,
      loadingPlatformInfos: false,
      platformInfos: [],
      funcPlatformInfoModel: false,
      platformObj: {
        resId: '',
        funcId: '',
        inletUrl: '',
        platformType: '',
        canUse: '',
        version: ''
      },
      basePlatFormModel: false,
      loadingPlatformDicts: false,
      platformTypeDicts: [],
      deleteingPlatform: false
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
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showDetailContentForm(params)
                }
              }
            }, '修改描述'),
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showCanUsePlatForm(params)
                }
              }
            }, '适用平台'),
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
      }, {
        title: '应用名称',
        key: 'funcName',
        minWidth: 200,
        tooltip: true
      }, {
        title: '应用版本',
        key: 'funcVersion',
        minWidth: 120,
        tooltip: true
      }, {
        title: '付费模式',
        key: 'funcChargingMode',
        width: 160,
        render: (h, params) => {
          const row = params.row
          const color = row.funcChargingMode === 'Fees' ? 'warning' : 'success'
          const text = row.funcChargingMode === 'Fees' ? '收费' : '免费'
          return h('Tag', {
            props: {
              color: color
            }
          }, text)
        }
      }, {
        title: '费用(元)',
        key: 'funcFee',
        sortable: 'custom',
        minWidth: 120,
        tooltip: true
      }, {
        title: '付费周期(月)',
        key: 'funcFeeCycle',
        minWidth: 180,
        tooltip: true
      }, {
        title: '开发状态',
        key: 'funcState',
        sortable: 'custom',
        minWidth: 120,
        tooltip: true
      }, {
        title: '展示状态',
        key: 'funcShow',
        width: 120,
        sortable: 'custom',
        render: (h, params) => {
          const row = params.row
          const color = row.funcShow === 'Y' ? 'success' : 'warning'
          const text = row.funcShow === 'Y' ? '显示' : '未显示'
          return h('Tag', {
            props: {
              color: color
            }
          }, text)
        }
      }, {
        title: '创建时间',
        key: 'createAt',
        sortable: 'custom',
        minWidth: 180,
        tooltip: true
      }, {
        title: '修改时间',
        key: 'updateAt',
        sortable: 'custom',
        minWidth: 180,
        tooltip: true
      }]
    },
    funcPlatformInfoColumns () {
      return [{
        title: ' ',
        key: 'action',
        width: 160,
        fixed: 'left',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showEditPlatForm(params)
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
                  this.handlePlatformDelete(params)
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
        title: '平台名称',
        key: 'platformTypeName',
        minWidth: 200,
        tooltip: true
      }, {
        title: '入口地址',
        key: 'inletUrl',
        minWidth: 320,
        tooltip: true
      }, {
        title: '可用状态',
        key: 'canUse',
        width: 120,
        render: (h, params) => {
          const row = params.row
          const color = row.canUse === 'Y' ? 'success' : 'warning'
          const text = row.canUse === 'Y' ? '可用' : '维护中'
          return h('Tag', {
            props: {
              color: color
            }
          }, text)
        }
      }, {
        title: '版本',
        key: 'version',
        minWidth: 120,
        tooltip: true
      }, {
        title: '创建时间',
        key: 'createAt',
        minWidth: 180,
        tooltip: true
      }, {
        title: '修改时间',
        key: 'updateAt',
        minWidth: 180,
        tooltip: true
      }]
    },
    ruleValidate () {
      return {
        funcName: [{
          required: true,
          message: '请输入应用名称',
          trigger: 'blur'
        }],
        funcIcon: [{
          required: true,
          message: '请上传应用图标',
          trigger: 'blur'
        }],
        funcVersion: [{
          required: true,
          message: '请输入应用版本号',
          trigger: 'blur'
        }],
        funcSynopsis: [{
          required: true,
          message: '请输入应用简述',
          trigger: 'blur'
        }],
        funcState: [{
          required: true,
          message: '请选择一个状态',
          trigger: 'blur'
        }],
        funcShow: [{
          required: true,
          message: '请选择一个状态',
          trigger: 'blur'
        }],
        funcChargingMode: [{
          required: true,
          message: '请选择一个付费模式',
          trigger: 'blur'
        }]
      }
    },
    rulePlatFormValidate () {
      return {
        platformType: [{
          required: true,
          message: '请输入选择一个平台',
          trigger: 'blur'
        }],
        inletUrl: [{
          required: true,
          message: '请输入入口地址',
          trigger: 'blur'
        }],
        version: [{
          required: true,
          message: '请输入版本号',
          trigger: 'blur'
        }],
        canUse: [{
          required: true,
          message: '请选择是否可用',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    load () {
      this.loading = true
      let searchValue = this.searchValue
      let searchChargingMode = this.searchChargingMode
      let searchState = this.searchState
      let searchShow = this.searchShow
      let size = this.size
      let page = this.current
      let orderField = this.orderField
      let orderType = this.orderType
      const _this = this
      loadFuncs({ searchValue, searchChargingMode, searchState, searchShow, page, size, orderField, orderType }).then(res => {
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
      deleteFunc({ resultId: params.row.funcId }).then(res => {
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
      this.baseFormModel = true
    },
    showEditForm (params) {
      const _this = this
      _this.baseFormModel = true
      _this.loading = false
      funcDetail({ resultId: params.row.funcId }).then(res => {
        _this.loading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.formObj = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loading = false
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
          upinsertFunc(_this.formObj).then(res => {
            _this.submiting = false
            if (res.status === 200 && res.data.code === 200) {
              _this.$Modal.success({
                title: '保存成功'
              })
              if (!_this.formObj.funcId) {
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
      this.$refs['baseForm'].resetFields()
      this.formObj = {
        funcId: '',
        funcName: '',
        funcIcon: '',
        funcVersion: '',
        funcSynopsis: '',
        funcState: '',
        funcShow: '',
        funcChargingMode: '',
        funcFee: 0,
        funcFeeCycle: 0
      }
      this.baseFormModel = false
    },
    uploadNewsCoverPic () {
      this.uploadFuncIconModel = true
    },
    uploadPicBeforeHandle () {
      this.pictrueUploading = true
    },
    uploadPicSuccessHandle (response, file) {
      this.formObj.funcIcon = file.response.data
      this.uploadFuncIconModel = false
      this.pictrueUploading = false
    },
    uploadPicErrorHandle (file) {
      const _this = this
      _this.pictrueUploading = false
      _this.$Modal.error({
        title: _this.$t('upload_error')
      })
    },
    uploadPicErrorSizeHandle (file) {
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
    showDetailContentForm (params) {
      const _this = this
      _this.detailContentFormModel = true
      _this.loadingDecription = true
      funcDescription({ resultId: params.row.funcId }).then(res => {
        _this.loadingDecription = false
        if (res.status === 200 && res.data.code === 200) {
          _this.detailContentFormObj = res.data.data
          _this.$refs.editor.setHtml(_this.detailContentFormObj.funcDescription)
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingDecription = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handleDetailContentChange (html) {
      this.detailContentFormObj.funcDescription = html
    },
    closeDetailContentFormandle () {
      const _this = this
      _this.detailContentFormModel = false
      _this.detailContentFormObj.funcId = ''
      _this.detailContentFormObj.funcDescription = ''
      _this.$refs.editor.setHtml('')
    },
    submitDetailContentFormHandle () {
      const _this = this
      _this.submiting = true
      upinsertFuncDescription(_this.detailContentFormObj).then(res => {
        _this.submiting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.$Modal.success({
            title: '保存成功'
          })
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.submiting = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    loadFuncPlatformInfos (resultId) {
      const _this = this
      _this.loadingPlatformInfos = true
      funcPlatformInfos({ resultId: resultId }).then(res => {
        _this.loadingPlatformInfos = false
        if (res.status === 200 && res.data.code === 200) {
          _this.platformInfos = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingPlatformInfos = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showCanUsePlatForm (params) {
      const _this = this
      _this.platformObj.funcId = params.row.funcId
      _this.funcPlatformInfoModel = true
      _this.loadFuncPlatformInfos(params.row.funcId)
    },
    cancelFuncPlatformInfoModel () {
      this.funcPlatformInfoModel = false
      this.platformInfos = []
    },
    showCreatePaltForm () {
      const _this = this
      _this.platformObj.resId = ''
      _this.platformObj.inletUrl = ''
      _this.platformObj.platformType = ''
      _this.platformObj.canUse = ''
      _this.platformObj.version = ''
      _this.basePlatFormModel = true
      _this.loadingPlatformDicts = false
      selectDictItemsByCode({ code: 'func_platform_classify' }).then(res => {
        _this.loadingPlatformDicts = false
        if (res.status === 200 && res.data.code === 200) {
          _this.platformTypeDicts = res.data.data.list
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingPlatformDicts = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showEditPlatForm (params) {
      const _this = this
      _this.basePlatFormModel = true
      _this.platformObj.resId = params.row.resId
      _this.platformObj.inletUrl = params.row.inletUrl
      _this.platformObj.platformType = params.row.platformType
      _this.platformObj.canUse = params.row.canUse
      _this.platformObj.version = params.row.version
      _this.loadingPlatformDicts = false
      selectDictItemsByCode({ code: 'func_platform_classify' }).then(res => {
        _this.loadingPlatformDicts = false
        if (res.status === 200 && res.data.code === 200) {
          _this.platformTypeDicts = res.data.data.list
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingPlatformDicts = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handlePlatformDelete (params) {
      const _this = this
      _this.deleteingPlatform = true
      deleteFuncPlatform({ resultId: params.row.resId }).then(res => {
        _this.deleteingPlatform = false
        if (res.status === 200 && res.data.code === 200) {
          _this.loadFuncPlatformInfos(params.row.funcId)
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.deleteingPlatform = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    closeBasePlatFormHandle () {
      this.basePlatFormModel = false
      this.$refs['basePlatForm'].resetFields()
    },
    submitBasePlatFormHandle () {
      const _this = this
      _this.$refs['basePlatForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertFuncPlatform(_this.platformObj).then(res => {
            _this.submiting = false
            if (res.status === 200 && res.data.code === 200) {
              _this.$Modal.success({
                title: '保存成功'
              })
              if (!_this.platformObj.resId) {
                _this.closeBasePlatFormHandle()
              }
              _this.loadFuncPlatformInfos(_this.platformObj.funcId)
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
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
