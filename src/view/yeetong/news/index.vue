<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable placeholder="按新闻标题检索" class="search-input" v-model="title"/>
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
      :title="formObj.uniqueId === '' ? $t('create') : $t('update')"
      scrollable
      width="820"
      mask
      :mask-closable="false"
      :closable="false">
      <Form :model="formObj" :label-width="120" :rules="ruleValidate" ref="baseForm">
        <FormItem label="新闻标题" prop="newsTitle">
          <Input v-model="formObj.newsTitle" placeholder="请输入新闻标题"/>
        </FormItem>
        <FormItem label="新闻关键词" prop="newsKeywords">
          <Input v-model="formObj.newsKeywords" placeholder="请输入新闻关键词"/>
        </FormItem>
        <FormItem label="新闻封面图地址" prop="newsCoverPic">
          <Input v-model="formObj.newsCoverPic" placeholder="请输入新闻封面图地址">
            <Button slot="append" @click="uploadNewsCoverPic" icon="ios-cloud-upload-outline">上传</Button>
          </Input>
        </FormItem>
        <FormItem label="新闻摘要" prop="newsAbstract">
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="formObj.newsAbstract" placeholder="请输入新闻摘要"/>
        </FormItem>
        <FormItem label="新闻内容" prop="newsContent">
          <editor ref="editor" @on-change="handleNewsContentChange"/>
        </FormItem>
        <FormItem label="新闻来源" prop="newsOrigin">
          <Input v-model="formObj.newsOrigin" placeholder="请输入新闻来源"/>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="loadingItem || submiting"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">{{ $t('i.modal.cancelText') }}</Button>
        <Button type="primary" @click="submitBaseFormHandle">{{ $t('i.modal.okText') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { loadNews, newsDetail, upinsertNews, releaseNews, outlineNews, deleteNews, newsToUp, newsToDown } from '@/api/yeetong/news'
import Editor from '_c/editor'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      submiting: false,
      loadingItem: false,
      formObj: {
        uniqueId: '',
        newsTitle: '',
        releaseState: '',
        releaseTime: '',
        newsOrigin: '',
        newsCoverPic: '',
        newsAbstract: '',
        newsKeywords: '',
        newsContent: '',
        createTime: '',
        updateTime: ''
      },
      baseFormModel: false,
      deleting: false,
      relasesHandleing: false,
      outlineHandleing: false,
      current: 1,
      title: '',
      orderField: '',
      orderType: ''
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
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: '是否要发布当前文章'
              },
              on: {
                'on-ok': () => {
                  this.handleRelease(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text',
                  loading: this.relasesHandleing
                }
              }, '发布')
            ]),
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: '是否要提高新闻排序权重'
              },
              on: {
                'on-ok': () => {
                  this.handleNewsToUpSort(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text'
                }
              }, '升序')
            ]),
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: '是否要降低新闻排序权重'
              },
              on: {
                'on-ok': () => {
                  this.handleNewsToDownSort(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text'
                }
              }, '降序')
            ]),
            h('Poptip', {
              props: {
                transfer: true,
                confirm: true,
                title: '是否要下线当前文章'
              },
              on: {
                'on-ok': () => {
                  this.handleOutLine(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text',
                  loading: this.outlineHandleing
                }
              }, '下线')
            ]),
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
        title: '权值排序',
        sortable: 'custom',
        key: 'sortNum',
        width: 120
      },
      {
        title: '标题',
        key: 'newsTitle',
        width: 200,
        tooltip: true
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
        newsTitle: [{
          required: true,
          message: '请输入新闻标题',
          trigger: 'blur'
        }],
        newsKeywords: [{
          required: true,
          message: '请输入新闻关键词',
          trigger: 'blur'
        }],
        newsCoverPic: [{
          required: true,
          message: '请输入新闻封面图地址',
          trigger: 'blur'
        }],
        newsAbstract: [{
          required: true,
          message: '请输入新闻摘要',
          trigger: 'blur'
        }],
        newsContent: [{
          required: true,
          message: '请输入新闻内容',
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
      deleteNews({ resultId: params.row.uniqueId }).then(res => {
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
    handleRelease (params) {
      const _this = this
      _this.relasesHandleing = true
      releaseNews({ resultId: params.row.uniqueId }).then(res => {
        _this.relasesHandleing = false
        if (res.status === 200 && res.data.code === 200) {
          _this.load()
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.relasesHandleing = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handleOutLine (params) {
      const _this = this
      _this.outlineHandleing = true
      outlineNews({ resultId: params.row.uniqueId }).then(res => {
        _this.outlineHandleing = false
        if (res.status === 200 && res.data.code === 200) {
          _this.load()
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.outlineHandleing = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handleNewsToUpSort (params) {
      const _this = this
      newsToUp({ resultId: params.row.uniqueId }).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          _this.load()
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handleNewsToDownSort (params) {
      const _this = this
      newsToDown({ resultId: params.row.uniqueId }).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          _this.load()
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
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
      this.formObj.uniqueId = ''
      this.formObj.newsTitle = ''
      this.$refs.editor.setHtml('')
      this.baseFormModel = true
    },
    showEditForm (params) {
      const _this = this
      _this.baseFormModel = true
      _this.loadingItem = false
      newsDetail({ resultId: params.row.uniqueId }).then(res => {
        _this.loadingItem = false
        if (res.status === 200 && res.data.code === 200) {
          _this.formObj = res.data.data
          _this.$refs.editor.setHtml(_this.formObj.newsContent)
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
          upinsertNews(_this.formObj).then(res => {
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
      this.formObj.uniqueId = ''
      this.formObj.newsTitle = ''
      this.formObj.uniqueId = ''
      this.formObj.newsTitle = ''
      this.formObj.releaseState = ''
      this.formObj.releaseTime = ''
      this.formObj.newsOrigin = ''
      this.formObj.newsCoverPic = ''
      this.formObj.newsAbstract = ''
      this.formObj.newsKeywords = ''
      this.formObj.newsContent = ''
      this.formObj.createTime = ''
      this.formObj.updateTime = ''
      this.baseFormModel = false
    },
    handleNewsContentChange (html) {
      this.formObj.newsContent = html
    },
    uploadNewsCoverPic () {
      this.$Modal.error({
        title: '暂不支持单独上传，请到‘图片素材’中拷贝图片地址。'
      })
      // 方案，弹出上传框
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
