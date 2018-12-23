<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con">
      <Input clearable :placeholder="$t('search_by_keyword_farm_name')" class="search-input" v-model="name"/>
      <Input clearable :placeholder="$t('search_by_keyword_farm_code')" class="search-input" v-model="code"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;{{ $t('search') }}</Button>
    </Card>
    <Button type="primary" icon="ios-add-circle-outline" style="margin-bottom: 18px" @click="openCreateFormTab">{{ $t('create') }}</Button>
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
      v-model="changeOwnerModel"
      scrollable
      width="620"
      mask
      :mask-closable="false">
      <p slot="header">
          <Icon type="ios-bulb-outline"></Icon>
          <span>{{ $t('farm_change_owner') }}</span>
      </p>
      <div>
        <p>{{ $t('farm_current_owner') }}: {{ farmOwnerFormObj.ownerUserName }} ({{ farmOwnerFormObj.ownerUserPhone }})</p>
        <div>
          <Form :model="farmOwnerFormObj">
            <FormItem :label="$t('new_farm_owner')">
              <Select
                v-model="farmOwnerFormObj.newOwnerUserId"
                filterable
                remote
                :remote-method="remoteGetUsers"
                clearable
                :loading="usersLoading"
                style="width: 240px">
                <Option v-for="option in users" :value="option.value" :key="option.value">{{option.label}} ({{option.phoneNo}}, {{option.email}})</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" size="large" :loading="ownerChangeSubmiting" @click="changeOwnerHandle">{{ $t('submit') }}</Button>
      </div>
      <Spin size="large" fix v-if="ownerLoading"></Spin>
    </Modal>
  </div>
</template>
<script>
import { loadFarms, deleteFarm, farmOwnerInfo, changeFarmOwner } from '@/api/farm'
import { query } from '@/api/user'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      loading: false,
      deleting: false,
      current: 1,
      name: '',
      code: '',
      orderField: '',
      orderType: '',
      changeOwnerModel: false,
      currentOwner: '',
      ownerLoading: false,
      usersLoading: false,
      ownerChangeSubmiting: false,
      users: [],
      farmOwnerFormObj: {
        newOwnerUserId: '',
        ownerUserId: '',
        ownerUserName: '',
        ownerUserPhone: ''
      }
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
        key: 'farmId',
        sortable: 'custom',
        width: 200,
        tooltip: true
      },
      {
        title: this.$t('farm_code'),
        key: 'farmCode',
        sortable: 'custom',
        width: 180,
        tooltip: true
      },
      {
        title: this.$t('farm_name'),
        key: 'farmName',
        sortable: 'custom',
        width: 200,
        tooltip: true
      },
      {
        title: this.$t('province'),
        key: 'provinceName',
        width: 160,
        tooltip: true
      },
      {
        title: this.$t('city'),
        key: 'cityName',
        width: 160,
        tooltip: true
      },
      {
        title: this.$t('county'),
        key: 'countyName',
        width: 160,
        tooltip: true
      },
      {
        title: this.$t('address'),
        key: 'address',
        width: 200,
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
        width: 280,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'ios-create-outline'
              },
              on: {
                'click': () => {
                  this.openEditFormTab(params)
                }
              }
            }, this.$t('edit')),
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'ios-create-outline'
              },
              on: {
                'click': () => {
                  this.openFarmAreasTab(params)
                }
              }
            }, this.$t('farm_area')),
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
            ]),
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'ios-create-outline'
              },
              on: {
                'click': () => {
                  this.showChangeOwnerModel(params)
                }
              }
            }, this.$t('farm_change_owner'))
          ])
        }
      }]
    }
  },
  methods: {
    load () {
      this.loading = true
      let name = this.name
      let code = this.code
      let size = this.size
      let page = this.current
      let orderField = this.orderField
      let orderType = this.orderType
      const _this = this
      loadFarms({ name, code, page, size, orderField, orderType }).then(res => {
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
      deleteFarm({ resultId: params.row.farmId }).then(res => {
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
    openCreateFormTab () {
      const route = {
        name: 'farm_add',
        meta: {
          title: this.$t('farm_add')
        }
      }
      this.$router.push(route)
    },
    openEditFormTab (params) {
      const route = {
        name: 'farm_edit',
        query: {
          farmId: params.row.farmId
        },
        meta: {
          title: this.$t('farm_edit')
        }
      }
      this.$router.push(route)
    },
    openFarmAreasTab (params) {
      const route = {
        name: 'farm_area',
        query: {
          farmId: params.row.farmId,
          farmName: params.row.farmName
        },
        meta: {
          title: this.$t('farm_area')
        }
      }
      this.$router.push(route)
    },
    showChangeOwnerModel (params) {
      const _this = this
      _this.changeOwnerModel = true
      _this.ownerLoading = true
      farmOwnerInfo({ resultId: params.row.farmId }).then(res => {
        _this.ownerLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.farmOwnerFormObj = res.data.data
          _this.farmOwnerFormObj.newOwnerUserId = ""
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.ownerLoading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    remoteGetUsers (searchValue) {
      const _this = this
      if (searchValue !== '') {
        this.usersLoading = true
        query({ searchValue }).then(res => {
          _this.usersLoading = false
          if (res.status === 200 && res.data.code === 200) {
            _this.users = res.data.data
          } else {
            _this.$Modal.error({
              title: _this.$t('error_message_info') + res.data.message
            })
          }
        }).catch(function (reason) {
          _this.usersLoading = false
          _this.$Modal.error({
            title: _this.$t('error_message_info') + reason.message
          })
        })
      } else {
        _this.users = []
      }
    },
    changeOwnerHandle () {
      const _this = this
      if (_this.farmOwnerFormObj.newOwnerUserId === _this.farmOwnerFormObj.ownerUserId) {
        _this.$Modal.error({
          title: _this.$t('not_change_error_info')
        })
        return
      }
      _this.ownerChangeSubmiting = true
      changeFarmOwner({ farmId: _this.farmId, ownerUserId: _this.farmOwnerFormObj.newOwnerUserId }).then(res => {
        _this.ownerChangeSubmiting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.$Modal.success({
            title: _this.$t('save_success')
          })
          _this.$Modal.remove()
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.ownerChangeSubmiting = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    }
  },
  mounted () {
    this.load()
  }
}
</script>
