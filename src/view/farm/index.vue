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
          <Icon type="md-arrow-dropright" />
          <span>{{ $t('farm_change_owner') }}</span>
      </p>
      <div>
        <div>
          <Form :model="farmOwnerFormObj" :label-width="140" ref="farmOwnerForm">
            <FormItem label="当前所有者">
              {{ farmOwnerFormObj.ownerUserName }} ({{ farmOwnerFormObj.ownerUserPhone }})
            </FormItem>
            <FormItem label="新所有者">
              <Select
                v-model="farmOwnerFormObj.newOwnerUserId"
                filterable
                placeholder="请输入新所有者账号名或手机号"
                remote
                :remote-method="remoteGetUsers"
                clearable
                :loading="usersLoading"
                style="width: 240px">
                <Option v-for="option in users" :value="option.value" :key="option.value">{{option.label}}({{option.phoneNo}})</Option>
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
          <Icon type="md-arrow-dropright" />
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
          <Icon type="md-arrow-dropright" />
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
          :height="260"
          :highlight-row="true"
        ></Table>
      </div>
      <div slot="footer"></div>
      <Spin size="large" fix v-if="farmAuthUsersloading"></Spin>
    </Modal>
    <Modal
      v-model="farmPictruesModel"
      scrollable
      width="520"
      mask
      :mask-closable="false">
      <p slot="header">
        <Icon type="md-arrow-dropright" />
        <span>{{ $t('farm_picture_upload') }}</span>
      </p>
      <div>
        <div>
            <Upload
              multiple
              type="drag"
              accept=".jpg,.png"
              :format="uploadFormat"
              :headers="uploadHeaders"
              :before-upload="uploadFarmPicBeforeHandle"
              :on-success="uploadFarmPicSuccessHandle"
              :on-error="uploadFarmPicErrorHandle"
              :on-format-error="uploadFarmPicErrorFormatHandle"
              :on-exceeded-size="uploadFarmPicErrorSizeHandle"
              :on-remove="removeFarmPicHandle"
              :max-size="4096"
              ref="farmPictureUploadForm"
              :action="baseUrl + 'upload'">
                <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>{{ $t('upload_tip') }}</p>
                </div>
            </Upload>
            <Form :model="farmPictureFormObj" :label-width="140" ref="farmPictureForm">
              <FormItem :label="$t('farm_name')" prop="farmName" style="margin-bottom: 4px">
                <p>{{ farmPictureFormObj.farmName }}</p>
              </FormItem>
              <FormItem :label="$t('order')" prop="sortNum" style="margin-bottom: 4px">
                <InputNumber v-model="farmPictureFormObj.sortNum" :min="1" :max="999" :placeholder="$t('please_input')+$t('order')" style="width: 240px"></InputNumber>
              </FormItem>
              <FormItem :label="$t('pic_title')" prop="title" style="margin-bottom: 4px">
                <Input v-model="farmPictureFormObj.title" :placeholder="$t('please_input')+$t('pic_title')" style="width: 240px"></Input>
              </FormItem>
              <FormItem :label="$t('farm_area')" style="margin-bottom: 4px">
                <Select
                  v-model="farmPictureFormObj.farmAreaId"
                  clearable
                  style="width: 240px">
                  <Option v-for="item in farmPictureAreas" :key="item.areaId" :value="item.areaId">{{ item.areaName }}</Option>
                </Select>
              </FormItem>
            </Form>
          </div>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" size="large" :loading="farmPicSubmiting" @click="saveFarmPicHandle">{{ $t('save') }}</Button>
      </div>
      <Spin size="large" fix v-if="farmPictrueUploading || farmPictureAreasLoading"></Spin>
    </Modal>
  </div>
</template>
<script>
import { loadFarms, deleteFarm, farmOwnerInfo, changeFarmOwner, farmAuthUsers, savePictures, resetFarmQR } from '@/api/farm'
import { query, authFarmVisit, handleAuthApply } from '@/api/user'
import { farmAllAreas } from '@/api/farmArea'
import config from '@/config'
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
      farmAuthUsersloading: false,
      farmPictruesModel: false,
      farmPictruesLoading: false,
      farmPictrueUploading: false,
      farmPictrues: [],
      baseUrl: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro,
      uploadFormat: ['jpg', 'png'],
      uploadHeaders: {
        type: 'farm'
      },
      farmPictureAreasLoading: false,
      farmPictureAreas: [],
      farmPicSubmiting: false,
      farmPictureFormObj: {
        farmId: '',
        farmName: '',
        farmAreaId: '',
        title: '',
        fileList: [],
        sortNum: 999
      }
    }
  },
  computed: {
    columns () {
      return [{
        title: ' ',
        key: 'action',
        fixed: 'left',
        width: 240,
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
            }, '农场管理'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                'click': () => {
                  this.openEditFormTab(params)
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                'click': () => {
                  this.openFarmAreasTab(params)
                }
              }
            }, '厂区管理'),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                'click': () => {
                  this.showChangeOwnerModel(params)
                }
              }
            }, '变更所有者'),
            h('Dropdown', {
              props: {
                transfer: true,
                trigger: 'hover'
              },
              on: {
                'on-click': (name) => {
                  switch (name) {
                    case 'farm_picture_upload' : this.showFarmPictrueUploadModel(params)
                      break
                    case 'farm_picture_manage' : this.openFarmPicturesTab(params)
                      break
                    case 'delete' : this.handleDelete(params)
                      break
                    case 'reset_qr' : this.handleResetQR(params)
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
              }, '更多操作'),
              h('DropdownMenu', {
                slot: 'list'
              }, [
                h('DropdownItem', {
                  props: {
                    name: 'farm_picture_upload'
                  }
                }, this.$t('farm_picture_upload')),
                h('DropdownItem', {
                  props: {
                    name: 'farm_picture_manage'
                  }
                }, this.$t('farm_picture_manage')),
                h('DropdownItem', {
                  props: {
                    name: 'farm_auth_new_user'
                  }
                }, '授权新访问者'),
                h('DropdownItem', {
                  props: {
                    name: 'farm_had_auth_users'
                  }
                }, this.$t('farm_had_auth_users')),
                h('DropdownItem', {
                  props: {
                    name: 'reset_qr'
                  }
                }, '重新生成二维码'),
                h('DropdownItem', {
                  props: {
                    name: 'delete'
                  }
                }, [
                  h('span', {
                    style: {
                      color: '#ed4014'
                    }
                  }, '删除农场记录')
                ])
              ])
            ])
          ])
        }
      }, {
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: this.$t('farm_name'),
        key: 'farmName',
        sortable: 'custom',
        minWidth: 200,
        tooltip: true
      }, {
        title: this.$t('farm_code'),
        key: 'farmCode',
        sortable: 'custom',
        minWidth: 180,
        tooltip: true
      }, {
        title: this.$t('province'),
        key: 'provinceName',
        minWidth: 120,
        tooltip: true
      }, {
        title: this.$t('city'),
        key: 'cityName',
        minWidth: 120,
        tooltip: true
      }, {
        title: this.$t('county'),
        key: 'countyName',
        minWidth: 120,
        tooltip: true
      }, {
        title: this.$t('weather_city'),
        key: 'weatherCityName',
        minWidth: 100,
        tooltip: true
      }, {
        title: this.$t('address'),
        key: 'address',
        minWidth: 220,
        tooltip: true
      }, {
        title: this.$t('create_at'),
        sortable: 'custom',
        width: 210,
        key: 'createAt'
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
        key: 'resId',
        width: 120,
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
          if (row.applyState === 'N') {
            return h('Tag', {
              props: {
                color: color
              }
            }, text)
          }
          return h('div', [
            h('Tag', {
              props: {
                color: color
              }
            }, text),
            h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                'click': () => {
                  this.userFarmApplyHandle(false, params)
                }
              }
            }, this.$t('remove_auth'))
          ])
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
    handleResetQR (params) {
      const _this = this
      _this.$Modal.confirm({
        title: _this.$t('table_handle_reset_qr_tip'),
        loading: true,
        onOk: () => {
          resetFarmQR({ farmId: params.row.farmId }).then(res => {
            _this.$Modal.remove()
            if (res.status === 200 && res.data.code === 200) {
              _this.$Modal.success({
                title: _this.$t('option_success')
              })
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
        meta: {
          title: this.$t('farm_edit')
        }
      }
      window.localStorage.setItem('page_farm_edit_farm_id', params.row.farmId)
      this.$router.push(route)
    },
    openFarmAreasTab (params) {
      const route = {
        name: 'farm_area',
        meta: {
          title: this.$t('farm_area')
        }
      }
      window.localStorage.setItem('page_farm_area_farm_id', params.row.farmId)
      window.localStorage.setItem('page_farm_area_farm_name', params.row.farmName)
      this.$router.push(route)
    },
    openFarmPicturesTab (params) {
      const route = {
        name: 'farm_picture',
        meta: {
          title: this.$t('farm_picture')
        }
      }
      window.localStorage.setItem('page_farm_picture_farm_id', params.row.farmId)
      this.$router.push(route)
    },
    openFarmConsoleTab (params) {
      const route = {
        name: 'farm_console',
        meta: {
          title: this.$t('farm_console')
        }
      }
      window.localStorage.setItem('page_farm_console_farm_id', params.row.farmId)
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
    showFarmPictrueUploadModel (params) {
      const _this = this
      _this.farmPictureFormObj.farmId = params.row.farmId
      _this.farmPictureFormObj.farmName = params.row.farmName
      _this.farmPictureFormObj.farmAreaId = ''
      _this.farmPictureFormObj.title = ''
      _this.farmPictureFormObj.sortNum = 999
      _this.farmPictureFormObj.fileList = []
      _this.$refs['farmPictureUploadForm'].fileList = []
      _this.farmPictruesModel = true
      _this.farmPictureAreasLoading = true
      farmAllAreas({ farmId: _this.farmPictureFormObj.farmId }).then(res => {
        _this.farmPictureAreasLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.farmPictureAreas = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.farmPictureAreasLoading = false
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
          handleAuthApply({ resId: params.row.resId, applyState: type ? 'Y' : 'N' }).then(res => {
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
    },
    uploadFarmPicBeforeHandle () {
      this.farmPictrueUploading = true
    },
    uploadFarmPicSuccessHandle (response, file, fileList) {
      this.farmPictureFormObj.fileList = fileList
      this.farmPictrueUploading = false
    },
    uploadFarmPicErrorHandle (file, fileList) {
      const _this = this
      _this.farmPictrueUploading = false
      _this.$Modal.error({
        title: _this.$t('upload_error')
      })
    },
    uploadFarmPicErrorSizeHandle (file, fileList) {
      const _this = this
      _this.farmPictrueUploading = false
      _this.$Modal.error({
        title: _this.$t('upload_error_size')
      })
    },
    uploadFarmPicErrorFormatHandle (file, fileList) {
      const _this = this
      _this.farmPictrueUploading = false
      _this.$Modal.error({
        title: _this.$t('upload_error_format')
      })
    },
    removeFarmPicHandle (file, fileList) {
      this.farmPictureFormObj.fileList = fileList
    },
    saveFarmPicHandle () {
      const _this = this
      if (_this.farmPictureFormObj.fileList.length === 0) {
        _this.$Modal.error({
          title: _this.$t('upload_error_one')
        })
        return
      }
      let fileList = []
      _this.farmPictureFormObj.fileList.forEach((item) => {
        if (item && item.response) {
          fileList.push(item.response.data)
        }
      })
      _this.farmPictureFormObj.fileList = fileList
      _this.farmPicSubmiting = true
      savePictures(_this.farmPictureFormObj).then(res => {
        _this.farmPicSubmiting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.$Modal.success({
            title: _this.$t('save_success')
          })
          _this.farmPictruesModel = false
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.farmPicSubmiting = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    }
  },
  mounted () {
    const _this = this
    _this.load()
  }
}
</script>
