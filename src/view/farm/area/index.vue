<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con">
      <p slot="title">{{ $t('current_farm') }}: {{ farmName }}</p>
      <Input clearable :placeholder="$t('search_by_keyword_farm_area_name')" class="search-input" v-model="name"/>
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
      size="small"
      :highlight-row="true"
      editable
      @on-sort-change="handleSortChange"
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
    <Modal
      v-model="detailModel"
      :title="$t('detail')"
      @on-ok="detailModelOkHandle"
      scrollable
      width="620"
      mask
      :mask-closable="false">
      <p>{{ $t('area_name') }}: {{formObj.areaName}}</p>
    </Modal>
    <Modal
      v-model="baseFormModel"
      :title="formObj.areaId === '' ? $t('create') : $t('update')"
      scrollable
      width="620"
      mask
      :mask-closable="false"
      :closable="false">
      <Form :model="formObj" :label-width="80" :rules="ruleValidate" ref="baseForm">
        <FormItem :label="$t('area_name')" prop="areaName">
            <Input v-model="formObj.areaName" :placeholder="$t('please_input')+$t('area_name')"/>
        </FormItem>
        <FormItem :label="$t('area_position')" prop="areaPosition">
            <Input v-model="formObj.areaPosition" :placeholder="$t('please_input')+$t('area_position')"/>
        </FormItem>
        <FormItem :label="$t('area_acreage')" prop="acreage">
            <Input v-model="formObj.acreage" :placeholder="$t('please_input')+$t('area_acreage')"/>
        </FormItem>
        <FormItem :label="$t('area_describe')" prop="areaDescribe">
            <Input v-model="formObj.areaDescribe" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('please_input')+$t('area_describe')"/>
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
import { loadFarmAreas, deleteFarmArea, upinsertFarmArea } from '@/api/farmArea'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      farmId: '',
      farmName: '',
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      submiting: false,
      formObj: {
        areaId: '',
        areaName: '',
        areaDescribe: '',
        areaPosition: '',
        acreage: ''
      },
      baseFormModel: false,
      detailModel: false,
      deleting: false,
      current: 1,
      name: '',
      orderField: '',
      orderType: ''
    }
  },
  computed: {
    columns () {
      return [{
        type: 'index',
        width: 60,
        align: 'center'
      },
      {
        title: this.$t('record_id'),
        key: 'areaId',
        sortable: 'custom',
        width: 200,
        tooltip: true
      },
      {
        title: this.$t('area_name'),
        key: 'areaName',
        sortable: 'custom',
        width: 200,
        tooltip: true
      },
      {
        title: this.$t('area_acreage'),
        key: 'acreage',
        sortable: 'custom',
        width: 180,
        tooltip: true
      },
      {
        title: this.$t('area_position'),
        key: 'areaPosition',
        width: 220,
        tooltip: true
      },
      {
        title: this.$t('area_describe'),
        key: 'areaDescribe',
        width: 360,
        tooltip: true
      },
      {
        title: this.$t('create_at'),
        sortable: 'custom',
        width: 210,
        key: 'createAt'
      },
      {
        title: this.$t('update_at'),
        sortable: 'custom',
        width: 210,
        key: 'updateAt'
      },
      {
        title: this.$t('action'),
        key: 'action',
        width: 240,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'ios-paper-outline'
              },
              on: {
                'click': () => {
                  this.showDetailModel(params)
                }
              }
            }, this.$t('detail')),
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'ios-create-outline'
              },
              on: {
                'click': () => {
                  this.showEditForm(params)
                }
              }
            }, this.$t('edit')),
            h('Poptip', {
              props: {
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
                  size: 'small',
                  icon: 'ios-trash-outline',
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
        areaName: [{
          required: true,
          message: this.$t('please_input') + this.$t('area_name'),
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    load () {
      if (!this.farmId) {
        this.closeTag({
          name: 'farm_area'
        })
        return
      }
      this.loading = true
      let farmId = this.farmId
      let name = this.name
      let size = this.size
      let page = this.current
      let orderField = this.orderField
      let orderType = this.orderType
      const _this = this
      loadFarmAreas({ farmId, name, page, size, orderField, orderType }).then(res => {
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
      deleteFarmArea({ resultId: params.row.areaId }).then(res => {
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
      this.formObj.areaId = ''
      this.formObj.areaName = ''
      this.formObj.areaDescribe = ''
      this.formObj.areaPosition = ''
      this.formObj.acreage = ''
      this.baseFormModel = true
    },
    showEditForm (params) {
      this.formObj.areaId = params.row.areaId
      this.formObj.areaName = params.row.areaName
      this.formObj.areaPosition = params.row.areaPosition
      this.formObj.acreage = params.row.acreage
      this.formObj.areaDescribe = params.row.areaDescribe
      this.baseFormModel = true
    },
    submitBaseFormHandle () {
      const _this = this
      _this.$refs['baseForm'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          _this.formObj.farmId = _this.farmId
          upinsertFarmArea(_this.formObj).then(res => {
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
      this.formObj.areaId = ''
      this.formObj.areaName = ''
      this.baseFormModel = false
    },
    showDetailModel (params) {
      this.detailModel = true
      this.formObj.areaName = params.row.areaName
    },
    detailModelOkHandle () {
      this.detailModel = false
    }
  },
  mounted () {
    this.farmId = this.$route.query.farmId
    this.farmName = this.$route.query.farmName
    this.load()
  }
}
</script>
