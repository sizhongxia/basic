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
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="showUploadForm">上传图片素材</Button>
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
      v-model="uploadModel"
      scrollable
      width="520"
      mask
      :mask-closable="false"
      class-name="vertical-center-modal">
      <p slot="header">
        <Icon type="md-arrow-dropright" />
        <span>上传图片素材</span>
      </p>
      <div>
        <div>
            <Upload
              multiple
              type="drag"
              accept=".jpg,.png"
              :format="uploadFormat"
              :headers="uploadHeaders"
              :before-upload="uploadPicBeforeHandle"
              :on-success="uploadPicSuccessHandle"
              :on-error="uploadPicErrorHandle"
              :on-format-error="uploadPicErrorFormatHandle"
              :on-exceeded-size="uploadPicErrorSizeHandle"
              :max-size="4096"
              :show-upload-list="true"
              ref="pictureUploadForm"
              :default-file-list="picList"
              :action="baseUrl + 'upload'">
                <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>单击或拖动要上传的图片到这里</p>
                </div>
            </Upload>
          </div>
      </div>
      <p slot="footer"></p>
      <Spin size="large" fix v-if="pictrueUploading"></Spin>
    </Modal>
  </div>
</template>
<script>
import { loadPictures } from '@/api/picture'
import config from '@/config'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      uploadModel: false,
      current: 1,
      picList: [],
      baseUrl: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro,
      pictrueUploading: false,
      uploadFormat: ['jpg', 'png'],
      uploadHeaders: {
        type: 'material_imgs'
      }
    }
  },
  computed: {
    columns () {
      return [{
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '图片名称',
        key: 'picName',
        minWidth: 200,
        tooltip: true
      }, {
        title: '图片地址',
        key: 'picUrl',
        minWidth: 520,
        tooltip: true
      }, {
        title: '图片Md5签名',
        key: 'picMd5',
        minWidth: 180,
        tooltip: true
      }, {
        title: '上传时间',
        key: 'uploadTime',
        minWidth: 140,
        tooltip: true
      }]
    }
  },
  methods: {
    load () {
      this.loading = true
      let size = this.size
      let page = this.current
      const _this = this
      loadPictures({ page, size }).then(res => {
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
    changePage (page) {
      this.current = page
      this.load()
    },
    changePageSize (size) {
      this.size = size
      this.load()
    },
    showUploadForm () {
      this.picList = []
      this.uploadModel = true
    },
    uploadPicBeforeHandle () {
      this.pictrueUploading = true
    },
    uploadPicSuccessHandle (response, file) {
      const _this = this
      _this.pictrueUploading = false
      _this.$Modal.success({
        title: '上传成功'
      })
      _this.load()
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
    uploadPicErrorFormatHandle (file) {
      const _this = this
      _this.pictrueUploading = false
      _this.$Modal.error({
        title: _this.$t('upload_error_format')
      })
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
