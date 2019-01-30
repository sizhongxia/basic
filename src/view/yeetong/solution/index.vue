<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable placeholder="按解决方案名称检索" class="search-input" v-model="searchValue"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
    </Card>
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showCreateForm">新增解决方案</Button>
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
      :title="formObj.solutionId === '' ? $t('create') : $t('update')"
      scrollable
      :width="980"
      mask
      :mask-closable="false"
      :closable="false">
      <Form :model="formObj" :label-width="160" :rules="ruleValidate" ref="baseForm">
        <FormItem label="解决方案名称" prop="solutionName">
          <Input v-model="formObj.solutionName" placeholder="请输入解决方案名称"/>
        </FormItem>
        <FormItem label="解决方案简述" prop="solutionSynopsis">
          <Input v-model="formObj.solutionSynopsis" type="textarea" :rows="2" :maxlength='180' placeholder="请输入解决方案简述"/>
        </FormItem>
        <FormItem label="解决方案详情页信息" prop="solutionDilate">
          <editor ref="editor" @on-change="handleSolutionDilateChange"/>
        </FormItem>
        <FormItem label="解决方案封面图片" prop="solutionCoverPic">
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
            <Button icon="ios-cloud-upload-outline">选择解决方案封面图片</Button>
          </Upload>
          <img @click="showBigPictureModel(formObj.solutionCoverPic)" v-if="formObj.solutionCoverPic" style="width: 120px;height: 80px;display: block;margin-top: 10px;" :src="formObj.solutionCoverPic">
        </FormItem>
        <Spin size="large" fix v-if="pictrueUploading"></Spin>
      </Form>
      <Spin size="large" fix v-if="submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">关闭</Button>
        <Button type="primary" @click="submitBaseFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal v-model="picModelVisible">
      <img :src="picModelPicUrl" v-if="picModelPicUrl" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { loadSolutions, solutionDetail, deleteSolution, upinsertSolution } from '@/api/yeetong/solution'
import config from '@/config'
import Editor from '_c/editor'
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
        solutionId: '',
        solutionName: '',
        solutionSynopsis: '',
        solutionCoverPic: '',
        solutionDilate: ''
      },
      picModelVisible: false,
      picModelPicUrl: '',
      loadingObj: false,
      baseFormModel: false,
      deleting: false,
      current: 1,
      searchValue: '',
      orderField: '',
      orderType: '',
      pictrueUploading: false
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
                title: '是否要删除当前解决方案'
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
        title: '解决方案名称',
        key: 'solutionName',
        minWidth: 200,
        tooltip: true
      }, {
        title: '解决方案简述',
        key: 'solutionSynopsis',
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
        solutionName: [{
          required: true,
          message: '请输入解决方案名称',
          trigger: 'blur'
        }],
        solutionSynopsis: [{
          required: true,
          message: '请输入解决方案简述',
          trigger: 'blur'
        }],
        solutionCoverPic: [{
          required: true,
          message: '请上传解决方案封面图',
          trigger: 'blur'
        }],
        solutionDilate: [{
          required: true,
          message: '请输入解决方案详情页信息',
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
      loadSolutions({ searchValue, page, size, orderField, orderType }).then(res => {
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
      deleteSolution({ resultId: params.row.solutionId }).then(res => {
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
      this.formObj.solutionCoverPic = file.response.data
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
      this.$refs.editor.setHtml('')
      this.baseFormModel = true
    },
    showEditForm (params) {
      const _this = this
      _this.baseFormModel = true
      _this.loadingObj = true
      solutionDetail({ resultId: params.row.solutionId }).then(res => {
        _this.loadingObj = false
        if (res.status === 200 && res.data.code === 200) {
          _this.formObj = res.data.data
          _this.$refs.editor.setHtml(res.data.data.solutionDilate)
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
    },
    submitBaseFormHandle () {
      const _this = this
      _this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertSolution(_this.formObj).then(res => {
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
      this.formObj.solutionId = ''
      this.formObj.solutionName = ''
      this.formObj.solutionSynopsis = ''
      this.formObj.solutionCoverPic = ''
      this.formObj.solutionDilate = ''
      this.$refs.editor.setHtml('')
      this.$refs['baseForm'].resetFields()
    },
    showBigPictureModel (pic) {
      this.picModelVisible = true
      this.picModelPicUrl = pic
    },
    handleSolutionDilateChange (html) {
      this.formObj.solutionDilate = html
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
