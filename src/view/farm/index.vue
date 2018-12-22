<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <div class="search-box"></div>
    <Table
      :border="false"
      :stripe="true"
      :show-header="true"
      :size="small"
      :data="tableData"
      :columns="tableColumns"
    ></Table>
    <div>
        <div style="page">
            <Page :total="total" :current="current" @on-change="changePage"></Page>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [{
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03'
      }],
      total: 10,
      current: 1
    }
  },
  computed: {
    tableColumns () {
      let columns = []
      columns.push({
        type: 'selection',
        width: 60,
        align: 'center'
      })
      columns.push({
        type: 'index',
        width: 60,
        align: 'center'
      })
      columns.push({
        title: this.$t('organize_name'),
        key: 'organizeName'
      })
      columns.push({
        title: this.$t('create_at'),
        key: 'createAt'
      })
      columns.push({
        title: this.$t('update_at'),
        key: 'updateAt'
      })
      return columns
    }
  },
  methods: {
    changePage (e) {
      console.info(e)
      this.tableData = [{
        name: 'John Brown',
        age: 19,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03'
      }]
    }
  }
}
</script>
