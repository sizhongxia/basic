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
      <Input clearable placeholder="请输入登录账号查询" class="search-input" v-model="searchValue"/>
      <Select clearable v-model="searchUserIndentity" style="width:200px;margin-left:4px;" placeholder="请选择一个身份">
        <Option value="super_admin" key="super_admin">超级管理员</Option>
        <Option value="admin" key="admin">运维管理员</Option>
        <Option value="customer" key="customer">客户</Option>
      </Select>
      <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="ios-search-outline" /> {{ $t('search') }}</Button>
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
      @on-sort-change="handleSortChange"
    ></Table>
    <div class="page">
      <Page :total="total" :current="current" :page-size="size" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
    </div>
    <Modal
      v-model="baseFormModel"
      :title="formObj.userId === '' ? $t('create') : $t('update')"
      scrollable
      :width="820"
      mask
      :mask-closable="false"
      :closable="false"
      class-name="vertical-center-modal">
      <Form :model="formObj" :label-width="120" :rules="ruleValidate" ref="baseForm">
        <Row style="padding-right: 60px;">
          <Col span="12">
            <FormItem label="登录账号" prop="userName">
              <Input v-model="formObj.userName" :disabled="formObj.userId !== ''" placeholder="请输入登录账号"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('organize')">
              <Select v-model="formObj.organizeId" clearable filterable>
                <Option v-for="item in organizes" :key="item.organizeId" :value="item.organizeId">{{ item.organizeName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('phone_no')" prop="phoneNo">
              <Input v-model="formObj.phoneNo" :placeholder="$t('please_input')+$t('phone_no')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('email')" prop="email">
              <Input v-model="formObj.email" :placeholder="$t('please_input')+$t('email')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="农场数量" prop="maxFarmNum">
              <InputNumber style="width:100%" :max="9999" :min="0" v-model="formObj.maxFarmNum" placeholder="请输入最大可创建农场数量"/>
            </FormItem>
          </Col>
        </Row>
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
      :mask-closable="false"
      class-name="vertical-center-modal">
      <p slot="header">
          <Icon type="md-arrow-dropright" />
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
                  <span>运维管理员</span>
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
      :mask-closable="false"
      class-name="vertical-center-modal">
      <p slot="header">
          <Icon type="md-arrow-dropright" />
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
          :height="260"
          :highlight-row="true"
        ></Table>
      </div>
      <div slot="footer"></div>
      <Spin size="large" fix v-if="userAuthFarmsloading"></Spin>
    </Modal>
    <Modal
      v-model="userAuthMenuModel"
      scrollable
      width="420"
      mask
      :mask-closable="false"
      class-name="vertical-center-modal">
      <p slot="header">
        <Icon type="md-arrow-dropright" />
        <span>{{ $t('user_auth_menus') }}</span>
      </p>
      <Tree :data="authMenus" show-checkbox @on-check-change="changeUserMenuAuthHandle" :check-strictly="true" :empty-text="noUserMenuAuth"></Tree>
      <Spin size="large" fix v-if="authMenusLoading"></Spin>
    </Modal>
  </div>
</template>
<script>
import { loadUsers, toggleStateUser, upinsertUser, resetUserPwd, userIdentities, userAuthFarms, changeUserIdentities, userAuthMenus, handleMenuAuth } from '@/api/user'
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
        maxFarmNum: 1,
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
      userIdentityModel: false,
      userAuthFarmModel: false,
      deleting: false,
      resetpwding: false,
      current: 1,
      searchUserIndentity: '',
      searchValue: '',
      orderField: '',
      orderType: '',
      userAuthMenuModel: false,
      authMenusLoading: false,
      authMenus: []
    }
  },
  computed: {
    columns () {
      return [{
        title: ' ',
        key: 'action',
        width: 280,
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
            }, '编辑'),
            h('Poptip', {
              props: {
                confirm: true,
                transfer: true,
                title: '是否要更改用户状态(禁用/启用)？'
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
                  loading: this.deleting
                }
              }, '切换状态')
            ]),
            h('Poptip', {
              props: {
                confirm: true,
                transfer: true,
                title: '是否要重设用户密码？'
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
                  loading: this.resetpwding
                }
              }, '重设密码')
            ]),
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showUserIdentityModel(params)
                }
              }
            }, this.$t('user_identity')),
            h('Button', {
              props: {
                type: 'text'
              },
              on: {
                'click': () => {
                  this.showUserAuthFarmModel(params)
                }
              }
            }, this.$t('user_auth_farms'))
            // h('Button', {
            //   props: {
            //     type: 'text'
            //   },
            //   on: {
            //     'click': () => {
            //       this.showUserAuthMenuModel(params)
            //     }
            //   }
            // }, this.$t('user_auth_menus'))
          ])
        }
      }, {
        type: 'index',
        key: 'index',
        width: 60,
        align: 'center'
      },
      {
        title: '登录账号',
        key: 'userName',
        sortable: 'custom',
        minWidth: 120,
        tooltip: true
      },
      {
        title: this.$t('phone_no'),
        key: 'phoneNo',
        sortable: 'custom',
        minWidth: 140,
        tooltip: true
      },
      {
        title: this.$t('email'),
        key: 'email',
        sortable: 'custom',
        minWidth: 220,
        tooltip: true
      },
      {
        title: '最大农场数量',
        key: 'maxFarmNum',
        sortable: 'custom',
        minWidth: 140,
        align: 'center'
      },
      {
        title: this.$t('account_state'),
        key: 'accountState',
        minWidth: 120,
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
        width: 120,
        tooltip: true
      },
      {
        title: this.$t('farm_name'),
        key: 'farmName',
        minWidth: 220,
        tooltip: true
      },
      {
        title: this.$t('farm_code'),
        key: 'farmCode',
        minWidth: 190,
        tooltip: true
      },
      {
        title: this.$t('identity'),
        key: 'identity',
        minWidth: 150,
        tooltip: true
      },
      {
        title: this.$t('apply_at'),
        key: 'applyAt',
        width: 150,
        tooltip: true
      },
      {
        title: this.$t('apply_state'),
        key: 'applyState',
        width: 120,
        render: (h, params) => {
          const row = params.row
          const text = row.applyState === 'D' ? this.$t('apply_state_d') : row.applyState === 'Y' ? this.$t('apply_state_y') : this.$t('apply_state_n')
          const color = row.applyState === 'D' ? 'warning' : row.applyState === 'Y' ? 'success' : 'error'
          return h('Tag', {
            props: {
              color: color
            }
          }, text)
        }
      },
      {
        title: this.$t('apply_remark'),
        key: 'applyRemark',
        width: 280,
        tooltip: true
      },
      {
        title: '处理时间',
        key: 'handleAt',
        width: 180,
        tooltip: true
      },
      {
        title: '处理人ID',
        key: 'handleUserId',
        width: 120,
        tooltip: true
      }]
    },
    ruleValidate () {
      return {
        userName: [{
          required: true,
          message: '请输入登录账号',
          trigger: 'blur'
        }],
        phoneNo: [{
          required: true,
          message: this.$t('please_input') + this.$t('phone_no'),
          trigger: 'blur'
        }]
      }
    },
    // No authorization required
    noUserMenuAuth () {
      return this.$t('no_authorization_required')
    }
  },
  methods: {
    load () {
      const _this = this
      _this.loading = true
      let searchValue = _this.searchValue
      let searchUserIndentity = _this.searchUserIndentity
      let size = _this.size
      let page = _this.current
      let orderField = _this.orderField
      let orderType = _this.orderType
      loadUsers({ searchValue, searchUserIndentity, page, size, orderField, orderType }).then(res => {
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
      _this.userFarmTableData = []
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
    loadUserMenuAuthData (userId) {
      this.authMenusLoading = true
      const _this = this
      _this.authMenus = []
      userAuthMenus({ userId }).then(res => {
        _this.authMenusLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.authMenus = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.authMenusLoading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showUserAuthMenuModel (params) {
      this.userAuthMenuModel = true
      this.loadUserMenuAuthData(params.row.userId)
    },
    changeUserMenuAuthHandle (selected, cnode) {
      this.authMenusLoading = true
      const _this = this
      handleMenuAuth({ userId: cnode.userId, menuAccessKey: cnode.key, checked: cnode.checked ? 'Y' : 'N' }).then(res => {
        _this.authMenusLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.loadUserMenuAuthData(cnode.userId)
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.authMenusLoading = false
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
      console.info(e)
      this.orderField = e.key
      this.orderType = e.order
      this.load()
    },
    showCreateForm () {
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
      this.formObj.userId = params.row.userId
      this.formObj.userName = params.row.userName
      this.formObj.phoneNo = params.row.phoneNo
      this.formObj.email = params.row.email
      this.formObj.maxFarmNum = params.row.maxFarmNum
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
              _this.load()
              if (!_this.formObj.userId) {
                _this.closeBaseFormHandle()
              }
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
      this.$refs['baseForm'].resetFields()
      this.baseFormModel = false
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
