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
.picModelStyle {
  display: inline-block;
  width: 144px;
  height: 144px;
  text-align: center;
  line-height: 144px;
  border: 1px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 8px;
}
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable placeholder="按商品名称检索" class="search-input" v-model="goodsName"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="ios-search-outline" /> {{ $t('search') }}</Button>
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
      :title="formObj.goodsId === '' ? $t('create') : $t('update')"
      scrollable
      width="820"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <div style="width:100%;height:420px;overflow: auto;text-align: left;">
        <Form :model="formObj" :label-width="120" :rules="ruleValidate" ref="baseForm">
          <Row style="padding-right: 60px;">
            <Col span="9">
              <FormItem label="商品排序权重" prop="sortNum">
                <InputNumber :max="999999" :min="1" v-model="formObj.sortNum" style="width:100%"/>
              </FormItem>
            </Col>
            <Col span="15">
              <FormItem label="商品名称" prop="goodsName">
                <Input v-model="formObj.goodsName" placeholder="请输入商品名称"/>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="商品简述" prop="goodsSketch">
                <Input v-model="formObj.goodsSketch" type="textarea" :rows="2" :maxlength='180' placeholder="请输入商品简述"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="暂无报价" prop="goodsNoPrice">
                <Select v-model="formObj.goodsNoPrice" style="width:100%">
                  <Option value="Y">暂无报价</Option>
                  <Option value="N">设置价格</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="商品成本价格" prop="goodsCostPrice">
                <InputNumber :max="9999999" :min="1" :step="0.01" style="width:100%"
                v-model="formObj.goodsCostPrice" placeholder="请输入商品成本价格"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="商品销售价格" prop="goodsSalePrice">
                <InputNumber :max="9999999" :min="1" :step="0.01" style="width:100%"
                v-model="formObj.goodsSalePrice" placeholder="请输入商品销售价格"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="商品折扣价格" prop="goodsDiscountPrice">
                <InputNumber :max="9999999" :min="1" :step="0.01" style="width:100%"
                v-model="formObj.goodsDiscountPrice" placeholder="请输入商品折扣价格"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="库存数量" prop="goodsRemainNum">
                <InputNumber :max="9999999" :min="10" :step="1" style="width:100%"
                v-model="formObj.goodsRemainNum" placeholder="请输入商品库存数量"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="商品已售数量" prop="goodsSoldNum">
                <InputNumber :max="999999" :min="1" :step="1" style="width:100%"
                v-model="formObj.goodsSoldNum" placeholder="请输入商品已售数量"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="在线状态" prop="showStatus">
                <Select v-model="formObj.showStatus" style="width:100%">
                  <Option value="Y">展示</Option>
                  <Option value="N">下线</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="销售状态" prop="saleStatus">
                <Select v-model="formObj.saleStatus" style="width:100%">
                  <Option value="Y">在售</Option>
                  <Option value="N">售罄</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="商品封面图片" prop="goodsCoverPic">
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
                  <Button icon="ios-cloud-upload-outline">选择封面图片</Button>
                </Upload>
                <img @click="showBigPictureModel(formObj.goodsCoverPic)" v-if="formObj.goodsCoverPic" style="width: 120px;height: 80px;display: block;margin-top: 10px;" :src="formObj.goodsCoverPic">
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <Spin size="large" fix v-if="loadingItem || submiting || pictrueUploading"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandleWithAlert">关闭</Button>
        <Button type="primary" @click="submitBaseFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal v-model="picModelVisible">
      <img :src="picModelPicUrl" v-if="picModelPicUrl" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="picModelWithDelVisible">
      <img :src="currentGoodsPicture.picUrl" v-if="currentGoodsPicture.picId" style="max-width: 100%">
      <div slot="footer" style="text-align:center">
        <Button type="error" style="width: 120px" v-if="currentGoodsPicture.picId" @click="deleteGoodsPicture">删除</Button>
      </div>
      <Spin size="large" fix v-if="deleting"></Spin>
    </Modal>
    <Modal
      v-model="detailContentFormModel"
      title="修改商品详情内容"
      scrollable
      width="820"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Form :model="detailContentFormObj" :label-width="0" ref="detailContentForm">
        <editor ref="editor" @on-change="handleDetailContentChange"/>
      </Form>
      <Spin size="large" fix v-if="loadingItem || submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeDetailContentFormandle">关闭</Button>
        <Button type="primary" @click="submitDetailContentFormHandle">保存</Button>
      </div>
    </Modal>
    <Modal v-model="picManageModel"
      title="商品图库"
      width="820"
      mask
      :mask-closable="false"
      :closable="true"
      class-name="vertical-center-modal">
      <div style="width:100%;height:420px;overflow: auto;text-align: left;">
        <div v-for="picItem in goodsPictureList" :key='picItem.picId' class="picModelStyle">
          <img @click="showBigPictureModelWithCanDel(picItem)" :src="picItem.picUrl" style="vertical-align: top;border-style: none;width:100%;height:100%;">
        </div>
      </div>
      <div slot="footer">
        <Upload
          type="select"
          accept=".jpg,.png"
          :multiple="true"
          :format="uploadFormat"
          :headers="uploadGoodsHeaders"
          :before-upload="uploadPicBeforeHandle"
          :on-success="uploadGoodsPicSuccessHandle"
          :on-error="uploadPicErrorHandle"
          :on-format-error="uploadPicErrorFormatHandle"
          :on-exceeded-size="uploadPicErrorSizeHandle"
          :max-size="4096"
          :show-upload-list="false"
          :action="baseUrl + 'upload-goods'">
          <Button icon="ios-cloud-upload-outline">上传新图片</Button>
        </Upload>
      </div>
      <Spin size="large" fix v-if="pictrueUploading || loadingPics"></Spin>
    </Modal>
  </div>
</template>
<script>
import { loadGoods, upinsertGoods, goodsDetail, goodsDetailContent, updateGoodsDetailContent, deleteGoods, goodsPictures, deleteGoodsPicture } from '@/api/yeetong/goods'
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
      uploadGoodsHeaders: {
        goodsId: ''
      },
      pictrueUploading: false,
      loading: false,
      submiting: false,
      loadingItem: false,
      formObj: {
        goodsId: '',
        sortNum: 1,
        goodsName: '',
        goodsSketch: '',
        goodsNoPrice: 'Y',
        showStatus: 'N',
        saleStatus: 'N',
        goodsCostPrice: 0,
        goodsSalePrice: 0,
        goodsDiscountPrice: 0,
        goodsRemainNum: 10,
        goodsSoldNum: 1,
        goodsCoverPic: ''
      },
      detailContentFormModel: false,
      detailContentFormObj: {
        goodsId: '',
        goodsDetailContent: ''
      },
      baseFormModel: false,
      deleting: false,
      picModelVisible: false,
      picModelPicUrl: '',
      goodsName: '',
      current: 1,
      orderField: '',
      orderType: '',
      picManageModel: false,
      loadingPics: false,
      goodsPictureList: [],
      currentGoodsPicture: {},
      picModelWithDelVisible: false
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
        width: 260,
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
            }, '详情页'),
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showPicManageModel(params)
                }
              }
            }, '图库'),
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showDocManageModel(params)
                }
              }
            }, '文档'),
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: '是否要删除当前商品'
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
        title: '权值排序',
        sortable: 'custom',
        key: 'sortNum',
        width: 120
      }, {
        title: '商品名称',
        key: 'goodsName',
        width: 200,
        tooltip: true
      }, {
        title: '商品成本价格',
        key: 'goodsCostPrice',
        align: 'center',
        minWidth: 200,
        tooltip: true
      }, {
        title: '商品销售价格',
        key: 'goodsSalePrice',
        minWidth: 200,
        align: 'center',
        tooltip: true
      }, {
        title: '折扣价格',
        key: 'goodsDiscountPrice',
        align: 'center',
        minWidth: 200,
        tooltip: true
      }, {
        title: '销售状态',
        key: 'saleStatus',
        width: 120,
        sortable: 'custom',
        render: (h, params) => {
          const row = params.row
          const color = row.saleStatus === 'Y' ? 'success' : 'warning'
          const text = row.saleStatus === 'Y' ? '在售' : '售罄'
          return h('Tag', {
            props: {
              color: color
            }
          }, text)
        }
      }, {
        title: '展示状态',
        key: 'showStatus',
        width: 120,
        sortable: 'custom',
        render: (h, params) => {
          const row = params.row
          const color = row.showStatus === 'Y' ? 'success' : 'warning'
          const text = row.showStatus === 'Y' ? '展示' : '下线'
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
        minWidth: 150,
        tooltip: true
      }]
    },
    ruleValidate () {
      return {
        goodsName: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        goodsSketch: [{
          required: true,
          message: '请输入商品简述',
          trigger: 'blur'
        }],
        goodsCoverPic: [{
          required: true,
          message: '请上传商品封面图',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    load () {
      this.loading = true
      let goodsName = this.goodsName
      let size = this.size
      let page = this.current
      let orderField = this.orderField
      let orderType = this.orderType
      const _this = this
      loadGoods({ goodsName, page, size, orderField, orderType }).then(res => {
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
      this.formObj.goodsCoverPic = file.response.data
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
      this.baseFormModel = true
    },
    showEditForm (params) {
      const _this = this
      _this.baseFormModel = true
      _this.loadingItem = false
      goodsDetail({ resultId: params.row.goodsId }).then(res => {
        _this.loadingItem = false
        if (res.status === 200 && res.data.code === 200) {
          _this.formObj = res.data.data
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
    showDetailContentForm (params) {
      const _this = this
      _this.detailContentFormModel = true
      _this.loadingItem = true
      goodsDetailContent({ resultId: params.row.goodsId }).then(res => {
        _this.loadingItem = false
        if (res.status === 200 && res.data.code === 200) {
          _this.detailContentFormObj = res.data.data
          _this.$refs.editor.setHtml(_this.detailContentFormObj.goodsDetailContent)
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
    submitBaseFormHandle () {
      const _this = this
      _this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertGoods(_this.formObj).then(res => {
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
    submitDetailContentFormHandle () {
      const _this = this
      _this.submiting = true
      updateGoodsDetailContent(_this.detailContentFormObj).then(res => {
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
    handleDelete (params) {
      const _this = this
      _this.deleting = true
      deleteGoods({ resultId: params.row.goodsId }).then(res => {
        _this.deleting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.load()
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
    closeBaseFormHandle () {
      const _this = this
      _this.baseFormModel = false
      _this.formObj.goodsId = ''
      _this.formObj.sortNum = 1
      _this.formObj.goodsName = ''
      _this.formObj.goodsSketch = ''
      _this.formObj.goodsNoPrice = 'Y'
      _this.formObj.goodsCostPrice = 0
      _this.formObj.goodsSalePrice = 0
      _this.formObj.goodsDiscountPrice = 0
      _this.formObj.goodsRemainNum = 10
      _this.formObj.goodsSoldNum = 1
      _this.formObj.showStatus = 'N'
      _this.formObj.saleStatus = 'N'
      _this.formObj.goodsCoverPic = ''
      _this.$refs['baseForm'].resetFields()
    },
    closeBaseFormHandleWithAlert () {
      const _this = this
      _this.$Modal.confirm({
        title: '关闭提示',
        content: '<p>是否要关闭当前表单？</p>',
        onOk: () => {
          _this.closeBaseFormHandle()
        }
      })
    },
    showBigPictureModel (pic) {
      this.picModelVisible = true
      this.picModelPicUrl = pic
    },
    showBigPictureModelWithCanDel (item) {
      this.currentGoodsPicture = item
      this.picModelWithDelVisible = true
    },
    handleDetailContentChange (html) {
      this.detailContentFormObj.goodsDetailContent = html
    },
    closeDetailContentFormandle () {
      const _this = this
      _this.detailContentFormModel = false
      _this.detailContentFormObj.goodsId = ''
      _this.detailContentFormObj.goodsDetailContent = ''
      _this.$refs.editor.setHtml('')
    },
    loadGoodsPics (goodsId) {
      const _this = this
      _this.loadingPics = true
      goodsPictures({ resultId: _this.uploadGoodsHeaders.goodsId }).then(res => {
        _this.loadingPics = false
        if (res.status === 200 && res.data.code === 200) {
          _this.goodsPictureList = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loadingPics = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showPicManageModel (params) {
      const _this = this
      _this.picManageModel = true
      _this.uploadGoodsHeaders.goodsId = params.row.goodsId
      _this.loadGoodsPics()
    },
    showDocManageModel (params) {
      const _this = this
      _this.$Modal.error({
        title: '待开发'
      })
    },
    deleteGoodsPicture () {
      const _this = this
      _this.deleting = true
      deleteGoodsPicture({ resultId: this.currentGoodsPicture.picId }).then(res => {
        _this.deleting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.currentGoodsPicture = {}
          _this.picModelWithDelVisible = false
          _this.loadGoodsPics()
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
