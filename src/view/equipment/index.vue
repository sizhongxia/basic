<style lang="less">
@import "./index.less";
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
      size="small"
      :height="tableHeight"
      :highlight-row="true"
      editable
      @on-sort-change="handleSortChange"
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
  </div>
</template>
<script>
import { loadEquipments } from '@/api/equipment'
export default {
  data () {
    return {
      tableData: [],
      tableHeight: 100,
      total: 0,
      size: 10,
      loading: false,
      current: 1,
      name: '',
      code: '',
      sn: ''
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
        key: 'equipmentId',
        sortable: 'custom',
        width: 100,
        tooltip: true
      },
      {
        title: this.$t('equipment_name'),
        key: 'equipmentName',
        width: 160,
        sortable: 'custom',
        tooltip: true
      },
      {
        title: this.$t('equipment_code'),
        key: 'equipmentCode',
        sortable: 'custom',
        width: 160,
        tooltip: true
      },
      {
        title: this.$t('equipment_sn'),
        key: 'equipmentSn',
        sortable: 'custom',
        width: 160,
        tooltip: true
      },
      {
        title: this.$t('operator'),
        key: 'operator',
        width: 160,
        tooltip: true
      },
      {
        title: this.$t('remark'),
        key: 'remark',
        width: 210,
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
    }
  },
  mounted () {
    const _this = this
    _this.tableHeight = window.document.body.offsetHeight - 330
    var ctimer = false
    window.addEventListener('resize', () => {
      if (ctimer) {
        window.clearTimeout(ctimer)
      }
      ctimer = window.setTimeout(() => {
        _this.tableHeight = window.document.body.offsetHeight - 330
      }, 100)
    })
    _this.load()
  }
}
</script>
