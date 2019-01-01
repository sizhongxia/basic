<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Row :gutter="20">
      <i-col :md="24" :lg="24" style="margin-bottom: 18px;">
        <Card shadow>
          <p>{{ $t('current_farm') }} : {{ farmObj.farmName }}</p>
          <p><img style="float:right;width:80px;height:80px" :src="farmObj.qrCodeUrl"/></p>
          <div style="clear:both"></div>
        </Card>
      </i-col>
      <i-col :md="24" :lg="10" style="margin-bottom: 18px;">
        <Card shadow>
          <p slot="title">{{ $t('farm_area') }} ({{ farmAreas.length }})</p>
          <CellGroup>
            <Cell v-if="farmAreas.length === 0">{{ $t('i.table.noDataText') }}</Cell>
            <Cell v-for="item in farmAreas" v-bind:key="item.areaId">
              <Icon type="ios-grid-outline" slot="icon" />
              {{ item.areaName }}
            </Cell>
          </CellGroup>
          <Spin size="small" fix v-if="farmAreasLoading"></Spin>
        </Card>
      </i-col>
      <i-col :md="24" :lg="14" style="margin-bottom: 18px;">
        <Card shadow>
          <p slot="title">{{ $t('equipment') }} ({{ farmEquipments.length }})</p>
          <a href="#" slot="extra" @click.prevent="showCreateEquipmentModel">{{ $t('create') }}</a>
          <CellGroup @on-click="showEditEquipmentModel">
            <Cell v-if="farmEquipments.length === 0">{{ $t('i.table.noDataText') }}</Cell>
            <Cell v-for="item in farmEquipments" v-bind:key="item.equipmentId" :name="item.equipmentId">
              <Icon type="ios-pulse-outline" slot="icon" />
              {{ item.equipmentName }}
              <p slot="label">{{ $t('equipment_code') + ' : '+ item.equipmentSn }} <Divider type="vertical" /> {{ item.typeName }} <Divider type="vertical" /> {{ item.modelName }}</p>
              <p slot="extra">{{ 'SN: '+ item.equipmentCode }}</p>
            </Cell>
          </CellGroup>
        </Card>
      </i-col>
      <i-col :md="24" :lg="10" style="margin-bottom: 18px;">
        <Card shadow>
          <p slot="title">{{ $t('weather_info') }} - {{ weather.location }}</p>
          <p><img :src="weather.pic"/></p>
          <p>{{ $t('weather_weather') }} : {{ weather.weather }}</p>
          <p>{{ $t('weather_tmp') }} : {{ weather.tmp }}</p>
          <p>{{ $t('weather_tmp_fl') }} : {{ weather.tmpFl }}</p>
          <p>{{ $t('weather_pcpn') }} : {{ weather.pcpn }}</p>
          <p>{{ $t('weather_hum') }} : {{ weather.hum }}</p>
          <p>{{ $t('weather_update_loc') }} : {{ weather.updateLoc }}</p>
          <Spin size="large" fix v-if="weatherLoading"></Spin>
        </Card>
      </i-col>
      <Spin size="large" fix v-if="loading"></Spin>
    </Row>
    <Modal
      v-model="equipmentFormModel"
      :title="equipmentFormObj.equipmentId === '' ? $t('create') : $t('update')"
      scrollable
      width="720"
      mask
      :mask-closable="false"
      class-name="vertical-center-modal"
      :closable="false">
      <Form :model="equipmentFormObj" :label-width="120" :rules="equipmentFormRuleValidate" ref="equipmentForm">
        <Row style="padding-right: 60px;">
          <Col span="12">
            <FormItem :label="$t('farm_area')" prop="farmAreaId">
              <Select v-model="equipmentFormObj.farmAreaId" clearable filterable>
                <Option v-for="item in farmAreas" :key="item.areaId" :value="item.areaId">{{ item.areaName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('equipment_name')" prop="equipmentName">
                <Input v-model="equipmentFormObj.equipmentName" :placeholder="$t('please_input')+$t('equipment_name')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('equipment_code')" prop="equipmentCode">
                <Input v-model="equipmentFormObj.equipmentCode" :placeholder="$t('please_input')+$t('equipment_code')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('equipment_sn')" prop="equipmentSn">
                <Input v-model="equipmentFormObj.equipmentSn" :placeholder="$t('please_input')+$t('equipment_sn')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('equipment_type')" prop="typeId">
              <Select v-model="equipmentFormObj.typeId" clearable @on-change="loadEquipmentModels">
                <Option v-for="item in types" :key="item.typeId" :value="item.typeId">{{ item.typeName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('equipment_model')" prop="modelId">
              <Select v-model="equipmentFormObj.modelId" clearable>
                <Option v-for="item in models" :key="item.modelId" :value="item.modelId">{{ item.modelName }}</Option>
              </Select>
              <Spin size="large" fix v-if="modelsLoading"></Spin>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('operator')">
                <Input v-model="equipmentFormObj.operator" :placeholder="$t('please_input')+$t('operator')"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem :label="$t('remark')">
                <Input v-model="equipmentFormObj.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="$t('please_input')+$t('remark')"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Spin size="large" fix v-if="equipmentFormSubmiting || typesLoading || equipmentDetailLoading"></Spin>
      <div slot="footer">
        <Button v-if="equipmentFormObj.equipmentId != ''" type="error" @click="deleteEquipmentHandle">{{ $t('delete') }}</Button>
        <Button type="text" @click="closeEquipmentFormHandle">{{ $t('i.modal.cancelText') }}</Button>
        <Button type="primary" @click="submitEquipmentFormHandle">{{ $t('i.modal.okText') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { farmAllAreas } from '@/api/farmArea'
import { farmDetail } from '@/api/farm'
import { farmAllEquipments, upinsertEquipment, equipmentDetail, deleteEquipment } from '@/api/equipment'
import { allEquipmentTypes } from '@/api/equipmentType'
import { allEquipmentModels } from '@/api/equipmentModel'
import { weatherInfo } from '@/api/basic'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      farmId: '',
      loading: false,
      farmObj: {},
      farmAreasLoading: false,
      farmAreas: [],
      farmEquipmentsLoading: false,
      farmEquipments: [],
      equipmentFormModel: false,
      equipmentFormSubmiting: false,
      equipmentFormObj: {
        equipmentId: '',
        equipmentName: '',
        equipmentCode: '',
        equipmentSn: '',
        typeId: '',
        typeName: '',
        modelId: '',
        modelName: '',
        farmId: '',
        farmName: '',
        farmAreaId: '',
        farmAreaName: '',
        operator: '',
        remark: ''
      },
      typesLoading: false,
      types: [],
      modelsLoading: false,
      models: [],
      equipmentDetailLoading: false,
      weatherLoading: false,
      weather: {}
    }
  },
  computed: {
    equipmentFormRuleValidate () {
      return {
        equipmentName: [{
          required: true,
          message: this.$t('please_input') + this.$t('equipment_name'),
          trigger: 'blur'
        }],
        equipmentCode: [{
          required: true,
          message: this.$t('please_input') + this.$t('equipment_code'),
          trigger: 'blur'
        }],
        equipmentSn: [{
          required: true,
          message: this.$t('please_input') + this.$t('equipment_sn'),
          trigger: 'blur'
        }],
        typeId: [{
          required: true,
          message: this.$t('i.select.placeholder') + this.$t('equipment_type'),
          trigger: 'blur'
        }],
        modelId: [{
          required: true,
          message: this.$t('i.select.placeholder') + this.$t('equipment_model'),
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    showCreateEquipmentModel () {
      this.$refs['equipmentForm'].resetFields()
      this.equipmentFormObj.farmId = this.farmId
      this.equipmentFormObj.equipmentId = ''
      this.equipmentFormObj.equipmentName = ''
      this.equipmentFormObj.equipmentCode = ''
      this.equipmentFormObj.equipmentSn = ''
      this.equipmentFormObj.farmAreaId = ''
      this.equipmentFormObj.typeId = ''
      this.equipmentFormObj.typeName = ''
      this.equipmentFormObj.modelId = ''
      this.equipmentFormObj.modelName = ''
      this.equipmentFormObj.operator = ''
      this.equipmentFormObj.remark = ''
      this.equipmentFormModel = true
      this.typesLoading = false
      const _this = this
      allEquipmentTypes().then(res => {
        _this.typesLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.types = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.typesLoading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    closeEquipmentFormHandle () {
      this.equipmentFormModel = false
    },
    submitEquipmentFormHandle () {
      const _this = this
      _this.$refs['equipmentForm'].validate((valid) => {
        if (valid) {
          _this.equipmentFormSubmiting = true
          upinsertEquipment(_this.equipmentFormObj).then(res => {
            _this.equipmentFormSubmiting = false
            if (res.status === 200 && res.data.code === 200) {
              _this.loadAllFarmEquipments()
              _this.closeEquipmentFormHandle()
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.equipmentFormSubmiting = false
            _this.closeEquipmentFormHandle()
            _this.$Modal.error({
              title: _this.$t('error_message_info') + reason.message
            })
          })
        }
      })
    },
    loadEquipmentModels () {
      const _this = this
      _this.models = []
      if (!_this.equipmentFormObj.typeId) {
        return
      }
      _this.modelsLoading = true
      allEquipmentModels({ typeId: _this.equipmentFormObj.typeId }).then(res => {
        _this.modelsLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.models = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.modelsLoading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    loadAllFarmEquipments () {
      const _this = this
      _this.farmEquipmentsLoading = true
      farmAllEquipments({ farmId: _this.farmId }).then(res => {
        _this.farmEquipmentsLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.farmEquipments = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.farmEquipmentsLoading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    showEditEquipmentModel (resultId) {
      if (!resultId) {
        return
      }
      const _this = this
      _this.equipmentDetailLoading = true
      _this.equipmentFormObj = {}
      equipmentDetail({ resultId }).then(res => {
        _this.equipmentDetailLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.equipmentFormObj = res.data.data
          _this.equipmentFormModel = true
          _this.typesLoading = false
          allEquipmentTypes().then(res => {
            _this.typesLoading = false
            if (res.status === 200 && res.data.code === 200) {
              _this.types = res.data.data
              _this.loadEquipmentModels()
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.typesLoading = false
            _this.$Modal.error({
              title: _this.$t('error_message_info') + reason.message
            })
          })
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.equipmentDetailLoading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    deleteEquipmentHandle () {
      const _this = this
      _this.$Modal.confirm({
        title: _this.$t('table_handle_delete_tip'),
        loading: true,
        onOk: () => {
          deleteEquipment({ resultId: _this.equipmentFormObj.equipmentId }).then(res => {
            if (res.status === 200 && res.data.code === 200) {
              _this.equipmentFormObj = {}
              _this.equipmentFormModel = false
              _this.$Modal.remove()
              _this.loadAllFarmEquipments()
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.$Modal.error({
              title: _this.$t('error_message_info') + reason.message
            })
          })
        }
      })
    },
    getWeatherInfo (cid) {
      const _this = this
      _this.weatherLoading = true
      weatherInfo({ cid }).then(res => {
        if (res.status === 200 && res.data.code === 200) {
          _this.weatherLoading = false
          _this.weather = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    }
  },
  mounted () {
    const _this = this
    _this.farmId = window.localStorage.getItem('page_farm_console_farm_id')
    _this.loading = true
    farmDetail({ resultId: _this.farmId }).then(res => {
      if (res.status === 200 && res.data.code === 200) {
        _this.loading = false
        _this.farmObj = res.data.data
        _this.getWeatherInfo(_this.farmObj.weatherCityCode)
      }
    }).catch(function (reason) {
      console.error(reason)
    })
    _this.farmAreasLoading = true
    farmAllAreas({ farmId: _this.farmId }).then(res => {
      _this.farmAreasLoading = false
      if (res.status === 200 && res.data.code === 200) {
        _this.farmAreas = res.data.data
      } else {
        _this.$Modal.error({
          title: _this.$t('error_message_info') + res.data.message
        })
      }
    }).catch(function (reason) {
      _this.farmAreasLoading = false
      _this.$Modal.error({
        title: _this.$t('error_message_info') + reason.message
      })
    })
    _this.loadAllFarmEquipments()
  }
}
</script>
