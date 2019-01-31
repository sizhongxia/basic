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
      <Input clearable :placeholder="$t('search_by_keyword_equipment_model_name')" class="search-input" v-model="searchValue"/>
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
      :highlight-row="true"
      editable
      @on-sort-change="handleSortChange"
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
    <Modal
      v-model="baseFormModel"
      :title="formObj.modelId === '' ? $t('create') : $t('update')"
      scrollable
      width="620"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Form :model="formObj" :label-width="120" :rules="ruleValidate" ref="baseForm">
        <FormItem :label="$t('equipment_model_name')" prop="modelName">
            <Input v-model="formObj.modelName" :placeholder="$t('please_input')+$t('equipment_model_name')"/>
        </FormItem>
        <FormItem :label="$t('equipment_type')" prop="typeId">
          <Select v-model="formObj.typeId" clearable filterable>
            <Option v-for="item in types" :key="item.typeId" :value="item.typeId">{{ item.typeName }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('supplier')">
            <Input v-model="formObj.supplier" :placeholder="$t('please_input')+$t('supplier')"/>
        </FormItem>
        <FormItem :label="$t('remark')">
            <Input v-model="formObj.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('please_input')+$t('remark')"/>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="submiting || typesloading"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">{{ $t('i.modal.cancelText') }}</Button>
        <Button type="primary" @click="submitBaseFormHandle">{{ $t('i.modal.okText') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { loadEquipmentModels, deleteEquipmentModel, upinsertEquipmentModel } from '@/api/equipmentModel'
import { allEquipmentTypes } from '@/api/equipmentType'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      submiting: false,
      formObj: {
        modelId: '',
        modelName: '',
        typeId: '',
        supplier: '',
        remark: ''
      },
      baseFormModel: false,
      deleting: false,
      current: 1,
      searchValue: '',
      orderField: '',
      orderType: '',
      typesloading: false,
      types: []
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
      }, {
        title: this.$t('equipment_model_name'),
        key: 'modelName',
        sortable: 'custom',
        minWidth: 200,
        tooltip: true
      }, {
        title: this.$t('equipment_type_name'),
        key: 'typeName',
        minWidth: 140,
        tooltip: true
      }, {
        title: this.$t('supplier'),
        key: 'supplier',
        width: 140,
        tooltip: true
      }, {
        title: this.$t('create_at'),
        sortable: 'custom',
        width: 210,
        key: 'createAt'
      }]
    },
    ruleValidate () {
      return {
        modelName: [{
          required: true,
          message: this.$t('please_input') + this.$t('equipment_model_name'),
          trigger: 'blur'
        }],
        typeId: [{
          required: true,
          message: this.$t('i.select.placeholder') + this.$t('equipment_type'),
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
      loadEquipmentModels({ searchValue, page, size, orderField, orderType }).then(res => {
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
      deleteEquipmentModel({ resultId: params.row.modelId }).then(res => {
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
      this.$refs['baseForm'].resetFields()
      this.formObj.modelId = ''
      this.formObj.modelName = ''
      this.formObj.typeId = ''
      this.formObj.supplier = ''
      this.formObj.remark = ''
      this.baseFormModel = true
      this.typesloading = true
      const _this = this
      allEquipmentTypes().then(res => {
        _this.typesloading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.types = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.typesloading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showEditForm (params) {
      this.$refs['baseForm'].resetFields()
      this.formObj.modelId = params.row.modelId
      this.formObj.modelName = params.row.modelName
      this.formObj.typeId = params.row.typeId
      this.formObj.supplier = params.row.supplier
      this.formObj.remark = params.row.remark
      this.baseFormModel = true
      this.typesloading = true
      const _this = this
      allEquipmentTypes().then(res => {
        _this.typesloading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.types = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.typesloading = false
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
          upinsertEquipmentModel(_this.formObj).then(res => {
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
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
