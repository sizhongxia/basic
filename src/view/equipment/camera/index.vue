<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable placeholder="请输入摄像头名称检索" class="search-input" v-model="name"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="ios-search-outline" /> {{ $t('search') }}</Button>
      <p style="margin-top: 14px;font-size: 12px;">注：摄像头在农场控制台中进行维护</p>
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
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
  </div>
</template>
<script>
import { loadCameras } from '@/api/camera'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      current: 1,
      orderField: '',
      orderType: '',
      name: ''
    }
  },
  computed: {
    columns () {
      return [{
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '摄像头名称',
        key: 'cameraName',
        minWidth: 160,
        tooltip: true
      }, {
        title: '摄像头品牌名称',
        key: 'brandName',
        minWidth: 160,
        tooltip: true
      }, {
        title: '安装部署日期',
        key: 'deployTime',
        sortable: 'custom',
        minWidth: 160,
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
      let size = this.size
      let page = this.current
      let orderField = this.orderField
      let orderType = this.orderType
      this.loading = true
      const _this = this
      _this.tableData = []
      loadCameras({ name, page, size, orderField, orderType }).then(res => {
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
    _this.load()
  }
}
</script>
