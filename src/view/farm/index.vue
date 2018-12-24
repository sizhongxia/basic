<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con" shadow>
      <Input clearable :placeholder="$t('search_by_keyword_farm_name')" class="search-input" v-model="name"/>
      <Input clearable :placeholder="$t('search_by_keyword_farm_code')" class="search-input" v-model="code"/>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;{{ $t('search') }}</Button>
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
        <div>
          <Form :model="farmOwnerFormObj" :label-width="140" ref="farmOwnerForm">
            <FormItem :label="$t('farm_current_owner')">
              {{ farmOwnerFormObj.ownerUserName }} ({{ farmOwnerFormObj.ownerUserPhone }})
            </FormItem>
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
    <Modal
      v-model="createAuthUserModel"
      scrollable
      width="620"
      mask
      :mask-closable="false">
      <p slot="header">
          <Icon type="ios-bulb-outline"></Icon>
          <span>{{ $t('farm_auth_new_user') }}</span>
      </p>
      <div>
        <div>
          <Form :model="farmAuthFormObj" :label-width="140" ref="farmAuthForm">
            <FormItem :label="$t('user')">
              <Select
                v-model="farmAuthFormObj.userId"
                filterable
                remote
                :remote-method="remoteGetUsers"
                clearable
                :loading="usersLoading"
                style="width: 240px">
                <Option v-for="option in users" :value="option.value" :key="option.value">{{option.label}} ({{option.phoneNo}}, {{option.email}})</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('identity')">
              <Select
                v-model="farmAuthFormObj.identity"
                clearable
                style="width: 240px">
                <Option value="admin">admin</Option>
                <Option value="manager">manager</Option>
                <Option value="visitor">visitor</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('remark')">
              <Input v-model="farmAuthFormObj.applyRemark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" :placeholder="$t('please_input')+$t('remark')" style="width: 350px"></Input>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" size="large" :loading="saveAuthUserSubmiting" @click="saveAuthUserHandle">{{ $t('submit') }}</Button>
      </div>
    </Modal>
    <Modal
      v-model="hadAuthUserModel"
      scrollable
      width="620"
      mask
      :mask-closable="false">
      <p slot="header">
          <Icon type="md-heart-outline"></Icon>
          <span>{{ $t('farm_had_auth_users') }}</span>
      </p>
      <div>
        <Table
          :border="false"
          :stripe="true"
          :show-header="true"
          :data="farmUserTableData"
          :loading="farmUserDataloading"
          :columns="farmUserColumns"
          size="small"
          :height="260"
          :highlight-row="true"
        ></Table>
      </div>
      <div slot="footer"></div>
      <Spin size="large" fix v-if="farmAuthUsersloading"></Spin>
    </Modal>
  </div>
</template>
<script>
import { loadFarms, deleteFarm, farmOwnerInfo, changeFarmOwner, farmAuthUsers } from '@/api/farm'
import { query, authFarmVisit, handleAuthApply } from '@/api/user'
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
        farmId: '',
        ownerUserId: '',
        ownerUserName: '',
        ownerUserPhone: ''
      },
      farmAuthFormObj: {
        farmId: '',
        userId: '',
        identity: '',
        applyRemark: ''
      },
      createAuthUserModel: false,
      saveAuthUserSubmiting: false,
      hadAuthUserModel: false,
      farmUserTableData: [],
      farmUserDataloading: false,
      farmAuthUsersloading: false
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
        title: this.$t('action'),
        key: 'action',
        align: 'center',
        width: 190,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                'click': () => {
                  this.openFarmConsoleTab(params)
                }
              }
            }, this.$t('farm_console')),
            h('Dropdown', {
              props: {
                trigger: 'click'
              },
              on: {
                'on-click': (name) => {
                  switch (name) {
                    case 'edit' : this.openEditFormTab(params)
                      break
                    case 'farm_area' : this.openFarmAreasTab(params)
                      break
                    case 'delete' : this.handleDelete(params)
                      break
                    case 'farm_change_owner' : this.showChangeOwnerModel(params)
                      break
                    case 'farm_auth_new_user' : this.showCreateAuthUserModel(params)
                      break
                    case 'farm_had_auth_users' : this.showHadAuthUsersModel(params)
                      break
                  }
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                }
              }, this.$t('more_options')),
              h('DropdownMenu', {
                slot: 'list'
              }, [
                h('DropdownItem', {
                  props: {
                    name: 'edit'
                  }
                }, this.$t('edit')),
                h('DropdownItem', {
                  props: {
                    name: 'farm_area'
                  }
                }, this.$t('farm_area')),
                h('DropdownItem', {
                  props: {
                    name: 'farm_change_owner'
                  }
                }, this.$t('farm_change_owner')),
                h('DropdownItem', {
                  props: {
                    name: 'farm_auth_new_user'
                  }
                }, this.$t('farm_auth_new_user')),
                h('DropdownItem', {
                  props: {
                    name: 'farm_had_auth_users'
                  }
                }, this.$t('farm_had_auth_users')),
                h('DropdownItem', {
                  props: {
                    name: 'delete'
                  }
                }, [
                  h('span', {
                    style: {
                      color: '#ed4014'
                    }
                  }, this.$t('delete'))
                ])
              ])
            ])
          ])
        }
      },
      {
        title: this.$t('record_id'),
        key: 'farmId',
        sortable: 'custom',
        width: 100,
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
        width: 100,
        tooltip: true
      },
      {
        title: this.$t('city'),
        key: 'cityName',
        width: 100,
        tooltip: true
      },
      {
        title: this.$t('county'),
        key: 'countyName',
        width: 100,
        tooltip: true
      },
      {
        title: this.$t('address'),
        key: 'address',
        width: 240,
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
    },
    farmUserColumns () {
      return [{
        type: 'index',
        width: 60,
        align: 'center'
      },
      {
        title: this.$t('record_id'),
        key: 'userId',
        width: 100,
        tooltip: true
      },
      {
        title: this.$t('user_name'),
        key: 'userName',
        width: 200,
        tooltip: true
      },
      {
        title: this.$t('phone_no'),
        key: 'userPhoneNo',
        width: 120,
        tooltip: true
      },
      {
        title: this.$t('identity'),
        key: 'identity',
        width: 150,
        tooltip: true
      },
      {
        title: this.$t('apply_at'),
        key: 'applyAt',
        width: 150,
        tooltip: true
      },
      {
        title: this.$t('apply_remark'),
        key: 'applyRemark',
        width: 280,
        tooltip: true
      },
      {
        title: this.$t('apply_state'),
        key: 'applyState',
        width: 200,
        render: (h, params) => {
          const row = params.row
          if (row.applyState === 'D') {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'ios-checkmark-circle-outline'
                },
                on: {
                  'click': () => {
                    this.userFarmApplyHandle(true, params)
                  }
                }
              }, this.$t('agree')),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'ios-close-circle-outline'
                },
                on: {
                  'click': () => {
                    this.userFarmApplyHandle(false, params)
                  }
                }
              }, this.$t('disagree'))
            ])
          }
          const text = row.applyState === 'D' ? this.$t('apply_state_d') : row.applyState === 'Y' ? this.$t('apply_state_y') : this.$t('apply_state_n')
          const color = row.applyState === 'D' ? 'warning' : row.applyState === 'Y' ? 'success' : 'error'
          return h('Tag', {
            props: {
              color: color
            }
          }, text)
        }
      }]
      // ,
      // {
      //   title: this.$t('handle_at'),
      //   key: 'handleAt',
      //   width: 150,
      //   tooltip: true
      // },
      // {
      //   title: this.$t('handle_user_id'),
      //   key: 'handleUserId',
      //   width: 150,
      //   tooltip: true
      // }
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
      _this.$Modal.confirm({
        title: _this.$t('table_handle_delete_tip'),
        loading: true,
        onOk: () => {
          deleteFarm({ resultId: params.row.farmId }).then(res => {
            _this.$Modal.remove()
            if (res.status === 200 && res.data.code === 200) {
              _this.load()
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.$Modal.remove()
            _this.$Modal.error({
              title: _this.$t('error_message_info') + reason.message
            })
          })
        }
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
    openFarmConsoleTab (params) {
      const route = {
        name: 'farm_console',
        query: {
          farmId: params.row.farmId,
          farmName: params.row.farmName
        },
        meta: {
          title: this.$t('farm_console')
        }
      }
      this.$router.push(route)
    },
    showChangeOwnerModel (params) {
      const _this = this
      _this.$refs['farmOwnerForm'].resetFields()
      _this.changeOwnerModel = true
      _this.ownerLoading = true
      farmOwnerInfo({ resultId: params.row.farmId }).then(res => {
        _this.ownerLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.farmOwnerFormObj = res.data.data
          _this.farmOwnerFormObj.newOwnerUserId = ''
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
      changeFarmOwner({ farmId: _this.farmOwnerFormObj.farmId, ownerUserId: _this.farmOwnerFormObj.newOwnerUserId }).then(res => {
        _this.ownerChangeSubmiting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.changeOwnerModel = false
          _this.$Modal.success({
            title: _this.$t('save_success')
          })
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
    },
    showCreateAuthUserModel (params) {
      this.$refs['farmAuthForm'].resetFields()
      this.createAuthUserModel = true
      this.farmAuthFormObj.farmId = params.row.farmId
      this.farmAuthFormObj.userId = ''
      this.farmAuthFormObj.identity = ''
      this.farmAuthFormObj.applyRemark = '系统/Sys'
    },
    saveAuthUserHandle () {
      this.saveAuthUserSubmiting = true
      const _this = this
      authFarmVisit(this.farmAuthFormObj).then(res => {
        _this.saveAuthUserSubmiting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.createAuthUserModel = false
          _this.$Modal.success({
            title: _this.$t('save_success')
          })
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.saveAuthUserSubmiting = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showHadAuthUsersModel (params) {
      this.hadAuthUserModel = true
      const _this = this
      _this.farmUserDataloading = true
      _this.farmUserTableData = []
      farmAuthUsers({ resultId: params.row.farmId }).then(res => {
        _this.farmUserDataloading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.farmUserTableData = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.farmUserDataloading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    userFarmApplyHandle (type, params) {
      const _this = this
      _this.$Modal.confirm({
        title: _this.$t('table_handle_handle_apply_tip'),
        loading: true,
        onOk: () => {
          handleAuthApply({ farmId: params.row.farmId, userId: params.row.userId, applyState: type ? 'Y' : 'N' }).then(res => {
            _this.$Modal.remove()
            if (res.status === 200 && res.data.code === 200) {
              _this.$Modal.success({
                title: _this.$t('save_success')
              })
              _this.showHadAuthUsersModel(params)
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.$Modal.remove()
            _this.$Modal.error({
              title: _this.$t('error_message_info') + reason.message
            })
          })
        }
      })
    }
  },
  mounted () {
    const _this = this
    _this.tableHeight = window.document.body.offsetHeight - 300
    var ctimer = false
    window.addEventListener('resize', () => {
      if (ctimer) {
        window.clearTimeout(ctimer)
      }
      ctimer = window.setTimeout(() => {
        _this.tableHeight = window.document.body.offsetHeight - 300
      }, 100)
    })
    _this.load()
  }
}
</script>
