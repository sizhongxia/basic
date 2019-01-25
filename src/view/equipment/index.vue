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
      <Input clearable :placeholder="$t('search_by_keyword_equipment_name')" class="search-input" v-model="name"/>
      <Input clearable :placeholder="$t('search_by_keyword_equipment_code')" class="search-input" v-model="code"/>
      <Input clearable :placeholder="$t('search_by_keyword_equipment_sn')" class="search-input" v-model="sn"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;{{ $t('search') }}</Button>
      <p style="margin-top: 14px;font-size: 12px;">{{ $t('equipment_manage_note') }}</p>
    </Card>
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
      @on-row-dblclick="showDetail"
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
    <Modal
      v-model="detailModel"
      scrollable
      width="820"
      mask
      :mask-closable="false"
      class-name="vertical-center-modal">
      <p slot="header">
        <Icon type="md-arrow-dropright" />
        <span>设备详情</span>
      </p>
      <div>
        <Form :model="equipment" :label-width="120">
          <Row style="padding-right: 60px;">
            <Col span="12">
              <FormItem label="设备名称">
                <Input :readonly="true" v-model="equipment.equipmentName"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备序列号">
                <Input :readonly="true" v-model="equipment.equipmentSn"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备编码">
                <Input :readonly="true" v-model="equipment.equipmentCode"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备类型">
                <Input :readonly="true" v-model="equipment.typeName"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备型号">
                <Input :readonly="true" v-model="equipment.modelName"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="最后操作人">
                <Input :readonly="true" v-model="equipment.operator"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备通讯标识">
                <Input :readonly="true" v-model="equipment.equipmentDtuId"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备通讯地址">
                <Input :readonly="true" v-model="equipment.equipment485Addr"/>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="设备备注">
                <Input type="textarea" :readonly="true" v-model="equipment.remark"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备创建时间">
                <Input :readonly="true" v-model="equipment.createAt"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备修改时间">
                <Input :readonly="true" v-model="equipment.updateAt"/>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import { loadEquipments } from '@/api/equipment'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      current: 1,
      name: '',
      code: '',
      sn: '',
      equipment: {},
      detailModel: false
    }
  },
  computed: {
    columns () {
      return [{
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: this.$t('equipment_name'),
        key: 'equipmentName',
        minWidth: 160,
        sortable: 'custom',
        tooltip: true
      }, {
        title: this.$t('equipment_code'),
        key: 'equipmentCode',
        sortable: 'custom',
        minWidth: 160,
        tooltip: true
      }, {
        title: this.$t('equipment_sn'),
        key: 'equipmentSn',
        sortable: 'custom',
        minWidth: 160,
        tooltip: true
      }, {
        title: this.$t('operator'),
        key: 'operator',
        width: 160,
        tooltip: true
      }, {
        title: this.$t('create_at'),
        sortable: 'custom',
        width: 210,
        key: 'createAt'
      }]
    }
  },
  methods: {
    load () {
      let name = this.name
      let code = this.code
      let sn = this.sn
      let size = this.size
      let page = this.current
      let orderField = this.orderField
      let orderType = this.orderType
      this.loading = true
      const _this = this
      _this.tableData = []
      loadEquipments({ name, code, sn, page, size, orderField, orderType }).then(res => {
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
    showDetail (e) {
      console.info(e)
      this.equipment = e
      this.detailModel = true
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
