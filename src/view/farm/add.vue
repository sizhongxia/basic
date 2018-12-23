<style lang="less">
@import "./add.less";
</style>
<template>
  <Row>
    <Col span="20" offset="2">
      <Form ref="formValidate" :model="formModel" :rules="ruleValidate" :label-width="140">
        <FormItem :label="$t('farm_name')" prop="farmName">
          <Input v-model="formModel.farmName" :placeholder="$t('please_input')+$t('farm_name')" style="width: 240px"></Input>
        </FormItem>
        <FormItem :label="$t('organize')">
          <Select v-model="formModel.organizeId" clearable filterable style="width: 240px">
            <Option v-for="item in organizes" :key="item.organizeId" :value="item.organizeId">{{ item.organizeName }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('owner_user')">
          <Select
            v-model="formModel.ownerUserId"
            filterable
            remote
            :remote-method="remoteGetUsers"
            clearable
            :loading="usersLoading"
             style="width: 240px">
            <Option v-for="option in users" :value="option.value" :key="option.value">{{option.label}} ({{option.phoneNo}}, {{option.email}})</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('area')">
          <Cascader :data="areaData" v-model="formModel.farmArea" trigger="hover" clearable style="width: 420px"></Cascader>
        </FormItem>
        <FormItem :label="$t('address')">
          <Input v-model="formModel.farmAddress" :placeholder="$t('please_input')+$t('address')" style="width: 420px"></Input>
        </FormItem>
        <FormItem :label="$t('lnglat')">
          <Input v-model="formModel.longitude" :placeholder="$t('please_input')+$t('longitude')" style="width: 210px"></Input>
          <Input v-model="formModel.latitude" :placeholder="$t('please_input')+$t('latitude')" style="width: 210px"></Input>
        </FormItem>
        <FormItem :label="$t('website')">
          <Input v-model="formModel.website" :placeholder="$t('please_input')+$t('website')" style="width: 420px"></Input>
        </FormItem>
        <FormItem :label="$t('remark')">
          <Input v-model="formModel.farmRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('please_input')+$t('remark')" style="width: 420px"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">{{ $t('submit') }}</Button>
        </FormItem>
        <Spin size="large" fix v-if="areasLoading || organizesloading || submiting"></Spin>
      </Form>
    </Col>
  </Row>
</template>
<script>
import { areas } from '@/api/basic'
import { allOrganizes } from '@/api/organize'
import { query } from '@/api/user'
import { upinsertFarm } from '@/api/farm'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      formModel: {
        farmName: '',
        organizeId: '',
        ownerUserId: '',
        farmArea: [],
        farmAddress: '',
        longitude: '',
        latitude: '',
        website: '',
        farmRemark: ''
      },
      areasLoading: false,
      areaData: [],
      organizesloading: false,
      organizes: [],
      usersLoading: false,
      users: [],
      submiting: false
    }
  },
  computed: {
    ruleValidate () {
      return {
        farmName: [{
          required: true,
          message: this.$t('please_input') + this.$t('farm_name'),
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    handleSubmit () {
      const _this = this
      _this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          _this.submiting = true
          upinsertFarm(_this.formModel).then(res => {
            _this.submiting = false
            if (res.status === 200 && res.data.code === 200) {
              _this.formModel = {
                farmName: '',
                organizeId: '',
                ownerUserId: '',
                farmArea: [],
                farmAddress: '',
                longitude: '',
                latitude: '',
                website: '',
                farmRemark: ''
              }
              this.$Modal.confirm({
                title: _this.$t('save_success') + ',' + _this.$t('confirm_close_current_page'),
                onOk: () => {
                  _this.closeTag({
                    name: 'farm_add'
                  })
                }
              })
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.submiting = false
            _this.$Modal.error({
              title: _this.$t('error_message_info') + reason.message
            })
          })
        }
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
    }
  },
  mounted () {
    this.organizesloading = true
    this.areasLoading = true

    const _this = this
    areas().then(res => {
      _this.areasLoading = false
      if (res.status === 200 && res.data.code === 200) {
        _this.areaData = res.data.data
      } else {
        _this.$Modal.error({
          title: _this.$t('error_message_info') + res.data.message
        })
      }
    }).catch(function (reason) {
      _this.areasLoading = false
      _this.$Modal.error({
        title: _this.$t('error_message_info') + reason.message
      })
    })
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
  }
}
</script>
