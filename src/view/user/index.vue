<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card class="search-con">
      <Input clearable :placeholder="$t('search_by_keyword_user_name')" class="search-input" v-model="searchValue"/>
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
      <p>{{ $t('user_name') }}: {{formObj.userName}}</p>
      <p>{{ $t('phone_no') }}: {{formObj.phoneNo}}</p>
      <p>{{ $t('email') }}: {{formObj.email}}</p>
    </Modal>
    <Modal
      v-model="baseFormModel"
      :title="formObj.userId === '' ? $t('create') : $t('update')"
      scrollable
      width="620"
      mask
      :mask-closable="false"
      :closable="false">
      <Form :model="formObj" :label-width="120" :rules="ruleValidate" ref="baseForm">
        <FormItem :label="$t('user_name')" prop="userName">
            <Input v-model="formObj.userName" :disabled="formObj.userId !== ''" :placeholder="$t('please_input')+$t('user_name')"/>
        </FormItem>
        <FormItem :label="$t('phone_no')" prop="phoneNo">
            <Input v-model="formObj.phoneNo" :placeholder="$t('please_input')+$t('phone_no')"/>
        </FormItem>
        <FormItem :label="$t('email')" prop="email">
            <Input v-model="formObj.email" :placeholder="$t('please_input')+$t('email')"/>
        </FormItem>
        <FormItem :label="$t('organize')">
          <Select v-model="formObj.organizeId" clearable filterable>
            <Option v-for="item in organizes" :key="item.organizeId" :value="item.organizeId">{{ item.organizeName }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="submiting || organizesloading"></Spin>
      <div slot="footer">
        <Button type="text" @click="closeBaseFormHandle">{{ $t('i.modal.cancelText') }}</Button>
        <Button type="primary" @click="submitBaseFormHandle">{{ $t('i.modal.okText') }}</Button>
      </div>
    </Modal>
    <Modal
      v-model="userIdentityModel"
      scrollable
      width="620"
      mask
      :mask-closable="false">
      <p slot="header">
          <Icon type="ios-bulb-outline"></Icon>
          <span>{{ $t('user_identity') }}</span>
      </p>
      <div>
        <p>{{ $t('user_name') }}: {{ identityFormObj.userName }}</p>
        <div style="text-align:center">
          <Form :model="identityFormObj" :rules="ruleValidate" ref="identityForm">
            <FormItem>
              <CheckboxGroup v-model="identityFormObj.identities" @on-change="handleChangeUserIdentity">
                <Checkbox label="super_admin">
                  <span>{{ $t('super_admin') }}</span>
                </Checkbox>
                <Checkbox label="admin">
                  <span>{{ $t('admin') }}</span>
                </Checkbox>
                <Checkbox label="customer">
                  <span>{{ $t('customer') }}</span>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer"></div>
      <Spin size="large" fix v-if="identityloading"></Spin>
    </Modal>
    <Modal
      v-model="userAuthFarmModel"
      scrollable
      width="620"
      mask
      :mask-closable="false">
      <p slot="header">
          <Icon type="md-heart-outline"></Icon>
          <span>{{ $t('user_auth_farms') }}</span>
      </p>
      <div>
        <Table
          :border="false"
          :stripe="true"
          :show-header="true"
          :data="userFarmTableData"
          :loading="userFarmDataloading"
          :columns="userFarmColumns"
          size="small"
          :height="260"
          :highlight-row="true"
        ></Table>
      </div>
      <div slot="footer"></div>
      <Spin size="large" fix v-if="userAuthFarmsloading"></Spin>
    </Modal>
  </div>
</template>
<script>
import { loadUsers, toggleStateUser, upinsertUser, resetUserPwd, userIdentities, userAuthFarms, changeUserIdentities } from '@/api/user'
import { allOrganizes } from '@/api/organize'
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      size: 10,
      userFarmTableData: [],
      loading: false,
      userFarmDataloading: false,
      submiting: false,
      organizesloading: false,
      organizes: [],
      formObj: {
        userId: '',
        userName: '',
        phoneNo: '',
        email: '',
        organizeId: ''
      },
      identityloading: false,
      identityFormObj: {
        userId: '',
        userName: '',
        identities: []
      },
      userAuthFarmsloading: false,
      baseFormModel: false,
      detailModel: false,
      userIdentityModel: false,
      userAuthFarmModel: false,
      deleting: false,
      resetpwding: false,
      current: 1,
      searchValue: '',
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
        key: 'userId',
        sortable: 'custom',
        width: 200,
        tooltip: true
      },
      {
        title: this.$t('user_name'),
        key: 'userName',
        sortable: 'custom',
        width: 200,
        tooltip: true
      },
      {
        title: this.$t('phone_no'),
        key: 'phoneNo',
        sortable: 'custom',
        width: 140,
        tooltip: true
      },
      {
        title: this.$t('email'),
        key: 'email',
        sortable: 'custom',
        width: 140,
        tooltip: true
      },
      {
        title: this.$t('account_state'),
        key: 'accountState',
        width: 120,
        sortable: 'custom',
        render: (h, params) => {
          const row = params.row
          const color = row.accountState === 0 ? 'success' : 'warning'
          const text = row.accountState === 0 ? this.$t('normal') : this.$t('disabled')
          return h('Tag', {
            props: {
              color: color
            }
          }, text)
        }
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
                title: this.$t('table_handle_toggle_state_tip')
              },
              on: {
                'on-ok': () => {
                  this.handleToggleState(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'ios-swap',
                  loading: this.deleting
                }
              }, this.$t('toggle_state'))
            ]),
            h('Poptip', {
              props: {
                confirm: true,
                title: this.$t('table_handle_reset_pwd_tip')
              },
              on: {
                'on-ok': () => {
                  this.handleResetPwd(params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'ios-unlock-outline',
                  loading: this.resetpwding
                }
              }, this.$t('reset_pwd'))
            ]),
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'ios-bulb-outline'
              },
              on: {
                'click': () => {
                  this.showUserIdentityModel(params)
                }
              }
            }, this.$t('user_identity')),
            h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'md-heart-outline'
              },
              on: {
                'click': () => {
                  this.showUserAuthFarmModel(params)
                }
              }
            }, this.$t('user_auth_farms'))
          ])
        }
      }]
    },
    userFarmColumns () {
      return [{
        type: 'index',
        width: 60,
        align: 'center'
      },
      {
        title: this.$t('record_id'),
        key: 'farmId',
        width: 220,
        tooltip: true
      },
      {
        title: this.$t('farm_name'),
        key: 'farmName',
        width: 220,
        tooltip: true
      },
      {
        title: this.$t('farm_code'),
        key: 'farmCode',
        width: 190,
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
        width: 120,
        tooltip: true
      },
      {
        title: this.$t('handle_at'),
        key: 'handleAt',
        width: 150,
        tooltip: true
      },
      {
        title: this.$t('handle_user_id'),
        key: 'handleUserId',
        width: 150,
        tooltip: true
      }]
    },
    ruleValidate () {
      return {
        userName: [{
          required: true,
          message: this.$t('please_input') + this.$t('user_name'),
          trigger: 'blur'
        }],
        phoneNo: [{
          required: true,
          message: this.$t('please_input') + this.$t('phone_no'),
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: this.$t('please_input') + this.$t('email'),
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
      loadUsers({ searchValue, page, size, orderField, orderType }).then(res => {
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
    handleToggleState (params) {
      const _this = this
      _this.deleting = true
      toggleStateUser({ resultId: params.row.userId }).then(res => {
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
    handleResetPwd (params) {
      const _this = this
      _this.resetpwding = true
      resetUserPwd({ resultId: params.row.userId }).then(res => {
        _this.resetpwding = false
        if (res.status === 200 && res.data.code === 200) {
          _this.$Modal.success({
            title: _this.$t('new_pwd_is') + res.data.data
          })
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.resetpwding = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showUserIdentityModel (params) {
      this.userIdentityModel = true
      this.identityloading = true
      this.identityFormObj.userId = params.row.userId
      this.identityFormObj.userName = params.row.userName
      const _this = this
      userIdentities({ resultId: params.row.userId }).then(res => {
        _this.identityloading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.identityFormObj.identities = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.identityloading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handleChangeUserIdentity (identities) {
      this.identityloading = true
      const _this = this
      changeUserIdentities({ userId: _this.identityFormObj.userId, identities }).then(res => {
        _this.identityloading = false
        if (res.status === 200 && res.data.code === 200) {
        } else {
          _this.userIdentityModel = false
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.identityloading = false
        _this.userIdentityModel = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showUserAuthFarmModel (params) {
      this.userAuthFarmModel = true
      this.userAuthFarmsloading = true
      const _this = this
      userAuthFarms({ resultId: params.row.userId }).then(res => {
        _this.userAuthFarmsloading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.userFarmTableData = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.userAuthFarmsloading = false
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
      this.formObj.userId = ''
      this.formObj.userName = ''
      this.formObj.phoneNo = ''
      this.formObj.email = ''
      this.formObj.organizeId = ''
      this.organizesloading = true
      this.baseFormModel = true
      const _this = this
      allOrganizes().then(res => {
        _this.organizesloading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.organizes = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.organizesloading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showEditForm (params) {
      this.$refs['baseForm'].resetFields()
      this.formObj.userId = params.row.userId
      this.formObj.userName = params.row.userName
      this.formObj.phoneNo = params.row.phoneNo
      this.formObj.email = params.row.email
      this.formObj.organizeId = params.row.organizeId
      this.organizesloading = true
      this.baseFormModel = true
      const _this = this
      allOrganizes().then(res => {
        _this.organizesloading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.organizes = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.organizesloading = false
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
          upinsertUser(_this.formObj).then(res => {
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
      this.formObj.userId = ''
      this.formObj.userName = ''
      this.formObj.phoneNo = ''
      this.formObj.email = ''
      this.formObj.organizeId = ''
      this.baseFormModel = false
    },
    showDetailModel (params) {
      this.detailModel = true
      // 请求
      this.formObj.userName = params.row.userName
      this.formObj.phoneNo = params.row.phoneNo
      this.formObj.email = params.row.email
    },
    detailModelOkHandle () {
      this.detailModel = false
    }
  },
  mounted () {
    this.load()
  }
}
</script>
