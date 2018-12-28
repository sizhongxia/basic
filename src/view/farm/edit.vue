<style lang="less">
@import "./add.less";
</style>
<template>
  <div>
    <Row>
      <Col span="20" offset="2">
        <Form ref="formValidate" :model="formModel" :rules="ruleValidate" :label-width="140">
          <FormItem :label="$t('farm_code')" prop="farmCode">
            <Input v-model="formModel.farmCode" :disabled="true" :placeholder="$t('please_input')+$t('farm_code')" style="width: 240px"></Input>
          </FormItem>
          <FormItem :label="$t('farm_name')" prop="farmName">
            <Input v-model="formModel.farmName" :placeholder="$t('please_input')+$t('farm_name')" style="width: 240px"></Input>
          </FormItem>
          <FormItem :label="$t('organize')">
            <Select v-model="formModel.organizeId" clearable filterable style="width: 240px">
              <Option v-for="item in organizes" :key="item.organizeId" :value="item.organizeId">{{ item.organizeName }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('area')">
            <Cascader :data="areaData" :load-data="loadAreaLevelData" v-model="formModel.farmArea" trigger="hover" clearable style="width: 420px"></Cascader>
          </FormItem>
          <FormItem :label="$t('weather_city')">
            <Select
              v-model="formModel.weatherCityCode"
              filterable
              setQuery=""
              remote
              :remote-method="remoteGetWeatherCitys"
              clearable
              :loading="weatherCitysLoading"
              style="width: 240px">
              <Option v-for="option in weatherCitys" :value="option.value" :key="option.value" :label="option.label">
                <span>{{ option.cityPinyin }}{{ option.provincePinyin }}</span>
                <span>{{ option.cityName }}</span>
                <span style="float:right;color:#ccc">{{ option.provinceName }}</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('address')">
            <Input v-model="formModel.farmAddress" :placeholder="$t('please_input')+$t('address')" style="width: 420px"></Input>
          </FormItem>
          <FormItem :label="$t('lnglat')">
            <Input v-model="formModel.longitude" :placeholder="$t('please_input')+$t('longitude')" style="width: 210px"></Input>
            <Input v-model="formModel.latitude" :placeholder="$t('please_input')+$t('latitude')" style="width: 210px"></Input>
            <Button type="text" @click="showSelectMapLngLatModel">{{ $t('select') }}</Button>
            <p><a href="https://lbs.amap.com/console/show/picker" target="_blank">https://lbs.amap.com/console/show/picker</a></p>
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
          <Spin size="large" fix v-if="loading || areasLoading || organizesloading || submiting"></Spin>
        </Form>
      </Col>
    </Row>
    <Modal
      v-model="selectMapLngLatModel"
      width="720"
      mask
      :mask-closable="false">
      <p slot="header">
        <Icon type="ios-image-outline"></Icon>
        <span>{{ $t('select_lng_lat') }}</span>
      </p>
      <div>
        <div id="farm_add_map" style="height: 360px"></div>
        <Spin size="large" fix v-if="mapLoading"></Spin>
      </div>
      <div slot="footer" style="text-align:center">
        <Button v-if="longitude && latitude" type="primary" size="large" @click="selectMapLngLatHandle">{{ $t('select') }} ({{ longitude }}, {{ latitude }})</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { areaLevels, weatherCities } from '@/api/basic'
import { allOrganizes } from '@/api/organize'
import { query } from '@/api/user'
import { upinsertFarm, farmDetail } from '@/api/farm'
import { mapMutations } from 'vuex'
import { mapLoader } from '@/libs/aMap'
export default {
  data () {
    return {
      farmId: '',
      formModel: {
        farmId: '',
        farmName: '',
        farmCode: '',
        organizeId: '',
        farmArea: [],
        weatherCityCode: '',
        farmAddress: '',
        longitude: '',
        latitude: '',
        website: '',
        farmRemark: ''
      },
      loading: false,
      areasLoading: false,
      areaData: [],
      organizesloading: false,
      organizes: [],
      submiting: false,
      weatherCitysLoading: false,
      weatherCitys: [],
      selectMapLngLatModel: false,
      mapLoading: false,
      zoom: 10,
      marker: false,
      longitude: '',
      latitude: ''
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
          if (!_this.formModel.farmId) {
            return
          }
          _this.submiting = true
          upinsertFarm(_this.formModel).then(res => {
            _this.submiting = false
            if (res.status === 200 && res.data.code === 200) {
              this.$Modal.confirm({
                title: _this.$t('save_success') + ',' + _this.$t('confirm_close_current_page'),
                onOk: () => {
                  _this.closeTag({
                    name: 'farm_edit'
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
    },
    remoteGetWeatherCitys (searchValue) {
      const _this = this
      _this.weatherCitys = []
      if (searchValue !== '') {
        this.weatherCitysLoading = true
        weatherCities({ searchValue }).then(res => {
          _this.weatherCitysLoading = false
          if (res.status === 200 && res.data.code === 200) {
            _this.weatherCitys = res.data.data
          } else {
            _this.$Modal.error({
              title: _this.$t('error_message_info') + res.data.message
            })
          }
        }).catch(function (reason) {
          _this.weatherCitysLoading = false
          _this.$Modal.error({
            title: _this.$t('error_message_info') + reason.message
          })
        })
      } else {
        _this.users = []
      }
    },
    loadDetail () {
      const _this = this
      _this.loading = true
      farmDetail({ resultId: _this.farmId }).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          _this.loading = false
          _this.formModel = res.data.data
        }
      }).catch(function (reason) {
        console.error(reason)
      })
    },
    loadAreaLevelData (item, callback) {
      const _this = this
      item.loading = true
      areaLevels({ searchValue: item.value }).then(res => {
        item.loading = false
        if (res.status === 200 && res.data.code === 200) {
          item.children = res.data.data
          callback()
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        item.loading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showSelectMapLngLatModel () {
      const _this = this
      _this.selectMapLngLatModel = true
      _this.mapLoading = true
      mapLoader().then(AMap => {
        _this.map = new AMap.Map(document.getElementById('farm_add_map'), {
          mapStyle: 'amap://styles/light',
          center: [_this.longitude || 117.000923, _this.latitude || 36.675807],
          resizeEnable: true,
          zoom: _this.zoom
        })
        _this.map.on('click', function (e) {
          if (!_this.marker) {
            _this.marker = new AMap.Marker({ map: _this.map })
          }
          let lnglat = e.lnglat
          _this.marker.setPosition([lnglat.getLng(), lnglat.getLat()])
          _this.map.setCenter([lnglat.getLng(), lnglat.getLat()])
          _this.longitude = lnglat.getLng()
          _this.latitude = lnglat.getLat()
        })
        _this.map.on('complete', function () {
          _this.mapLoading = false
          _this.marker = new AMap.Marker({ map: _this.map })
          if (_this.longitude && _this.latitude) {
            _this.marker.setPosition([_this.longitude, _this.latitude])
          } else if (_this.formModel.longitude && _this.formModel.latitude) {
            _this.marker.setPosition([_this.formModel.longitude, _this.formModel.latitude])
          } else {
            _this.marker.setPosition([116.406658, 39.91447])
          }
          _this.map.setCenter(_this.marker.getPosition())
          _this.map.setDefaultCursor('crosshair')
        })
        _this.map.on('zoomend', function () {
          _this.zoom = _this.map.getZoom()
        })
      })
    },
    selectMapLngLatHandle () {
      const _this = this
      _this.formModel.longitude = _this.longitude
      _this.formModel.latitude = _this.latitude
      _this.selectMapLngLatModel = false
      _this.map.destroy()
    }
  },
  mounted () {
    this.farmId = window.localStorage.getItem('page_farm_edit_farm_id')
    const _this = this
    _this.areasLoading = true
    areaLevels({ searchValue: '' }).then(res => {
      _this.areasLoading = false
      if (res.status === 200 && res.data.code === 200) {
        _this.areaData = res.data.data
        _this.loadDetail()
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
    _this.organizesloading = true
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
