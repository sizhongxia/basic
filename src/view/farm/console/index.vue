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
          <p slot="title">{{ $t('collect_equipment') }} ({{ farmEquipments.length }})</p>
          <a href="#" slot="extra" @click.prevent="showCreateEquipmentModel">{{ $t('create') }}</a>
          <CellGroup @on-click="showEditEquipmentModel">
            <Cell v-if="farmEquipments.length === 0">{{ $t('i.table.noDataText') }}</Cell>
            <Cell v-for="item in farmEquipments" v-bind:key="item.equipmentId" :name="item.equipmentId">
              <Icon type="ios-pulse-outline" slot="icon" />
              {{ item.equipmentName }}
              <p slot="label">{{ $t('equipment_code') + ' : '+ item.equipmentCode }} <Divider type="vertical" /> {{ item.typeName }} <Divider type="vertical" /> {{ item.modelName }}</p>
              <p slot="extra">{{ item.equipmentSn }}</p>
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
      <i-col :md="24" :lg="14" style="margin-bottom: 18px;">
        <Card shadow>
          <p slot="title">{{ $t('video_equipment') }} ({{ farmCameras.length }})</p>
          <a href="#" slot="extra" @click.prevent="showCreateCameraModel">{{ $t('create') }}</a>
          <CellGroup @on-click="showEditCameraModel">
            <Cell v-if="farmCameras.length === 0">{{ $t('i.table.noDataText') }}</Cell>
            <Cell v-for="item in farmCameras" v-bind:key="item.cameraId" :name="item.cameraId">
              <Icon type="ios-pulse-outline" slot="icon" />
              {{ item.cameraName }}
            </Cell>
          </CellGroup>
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
            <FormItem :label="$t('equipment_dtu_id')" prop="equipmentDtuId">
                <Input v-model="equipmentFormObj.equipmentDtuId" :placeholder="$t('please_input')+$t('equipment_dtu_id')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('equipment_485_addr')" prop="equipment485Addr">
                <Input v-model="equipmentFormObj.equipment485Addr" :placeholder="$t('please_input')+$t('equipment_485_addr')"/>
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
    <Modal
      v-model="cameraFormModel"
      :title="cameraFormObj.cameraId === '' ? $t('create') : $t('update')"
      scrollable
      width="960"
      mask
      :mask-closable="false"
      class-name="vertical-center-modal"
      :closable="false">
      <Form :model="cameraFormObj" :label-width="120" :rules="cameraFormRuleValidate" ref="cameraForm">
        <Row style="padding-right: 60px;">
          <Col span="8">
            <FormItem :label="$t('camera_id')" prop="cameraId">
              <Input v-model="cameraFormObj.cameraId" disabled />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_name')" prop="cameraName">
              <Input v-model="cameraFormObj.cameraName" :placeholder="$t('please_input')+$t('camera_name')"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('farm_area')" prop="farmAreaId">
              <Select v-model="cameraFormObj.farmAreaId" clearable filterable>
                <Option v-for="item in farmAreas" :key="item.areaId" :value="item.areaId">{{ item.areaName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('camera_rtsp_url')" prop="rtspUrl">
              <Input v-model="cameraFormObj.rtspUrl" :placeholder="$t('please_input')+$t('camera_rtsp_url')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('camera_push_rtmp_url')" prop="pushRtmpUrl">
              <Input v-model="cameraFormObj.pushRtmpUrl" :placeholder="$t('please_input')+$t('camera_push_rtmp_url')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('camera_play_rtmp_url')" prop="playRtmpUrl">
              <Input v-model="cameraFormObj.playRtmpUrl" :placeholder="$t('please_input')+$t('camera_play_rtmp_url')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('camera_play_hls_url')" prop="playHlsUrl">
              <Input v-model="cameraFormObj.playHlsUrl" :placeholder="$t('please_input')+$t('camera_play_hls_url')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('camera_play_flv_url')" prop="playFlvUrl">
                <Input v-model="cameraFormObj.playFlvUrl" :placeholder="$t('please_input')+$t('camera_play_flv_url')"/>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem :label="$t('camera_voperation')" prop="voperation">
              <Select v-model="cameraFormObj.voperations" multiple>
                <Option v-for="item in voperations" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_deploy_time')" prop="deployTime">
              <Input v-model="cameraFormObj.deployTime" :placeholder="'格式:yyyy-MM-dd'"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_brand_name')" prop="brandName">
              <Input v-model="cameraFormObj.brandName" :placeholder="$t('please_input')+$t('camera_brand_name')"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_type')" prop="type">
              <Select v-model="cameraFormObj.type" clearable filterable>
                <Option v-for="item in farmCameraTypes" :key="item.value" :value="item.value">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_push_flow_mode')" prop="pushFlowMode">
              <Select v-model="cameraFormObj.pushFlowMode" clearable filterable>
                <Option v-for="item in farmCameraPushFlowModes" :key="item.value" :value="item.value">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_ip')" prop="ip">
              <Input v-model="cameraFormObj.ip" :placeholder="$t('please_input')+$t('camera_ip')"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_port')" prop="port">
              <Input v-model="cameraFormObj.port" :placeholder="$t('please_input')+$t('camera_port')"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_user_name')" prop="userName">
              <Input v-model="cameraFormObj.userName" :placeholder="$t('please_input')+$t('camera_user_name')"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem :label="$t('camera_password')" prop="password">
              <Input v-model="cameraFormObj.password" :placeholder="$t('please_input')+$t('camera_password')"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Spin size="large" fix v-if="cameraFormSubmiting || cameraDetailLoading"></Spin>
      <div slot="footer">
        <Button v-if="cameraFormObj.cameraId != ''" type="error" @click="deleteCameraHandle">{{ $t('delete') }}</Button>
        <Button type="text" @click="closeCameraFormHandle">{{ $t('i.modal.cancelText') }}</Button>
        <Button type="primary" @click="submitCameraFormHandle">{{ $t('i.modal.okText') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { farmAllAreas } from '@/api/farmArea'
import { farmDetail } from '@/api/farm'
import { farmAllEquipments, upinsertEquipment, equipmentDetail, deleteEquipment } from '@/api/equipment'
import { farmAllCameras, upinsertCamera, cameraDetail, deleteCamera } from '@/api/camera'
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
      farmCamerasLoading: false,
      cameraFormModel: false,
      cameraFormSubmiting: false,
      cameraDetailLoading: false,
      farmCameras: [],
      farmCameraTypes: [{
        value: '1',
        name: '球机'
      }, {
        value: '2',
        name: '枪机'
      }],
      farmCameraPushFlowModes: [{
        value: '0',
        name: '呼叫'
      }, {
        value: '1',
        name: '长期'
      }],
      voperations: [{
        value: '1',
        name: '变焦'
      }, {
        value: '2',
        name: '旋转'
      }, {
        value: '3',
        name: '焦点'
      }, {
        value: '4',
        name: '光圈'
      }],
      cameraFormObj: {
        cameraId: '',
        cameraName: '',
        farmId: '',
        farmName: '',
        farmAreaId: '',
        farmAreaName: '',
        rtspUrl: '',
        pushRtmpUrl: '',
        playRtmpUrl: '',
        playHlsUrl: '',
        playFlvUrl: '',
        deployTime: '',
        brandName: '',
        type: '',
        voperation: '',
        voperations: [],
        pushFlowMode: '',
        ip: '',
        port: '',
        userName: '',
        password: '',
        state: '',
        lastTime: '',
        onvifStatus: '',
        createAt: '',
        updateAt: ''
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
    },
    cameraFormRuleValidate () {
      return {
        cameraName: [{
          required: true,
          message: this.$t('please_input') + this.$t('camera_name'),
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
      this.equipmentFormObj.equipmentDtuId = ''
      this.equipmentFormObj.equipment485Addr = ''
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
    showCreateCameraModel () {
      this.$refs['cameraForm'].resetFields()
      this.cameraFormObj.farmId = this.farmId
      this.cameraFormObj.cameraId = ''
      this.cameraFormObj.cameraName = ''
      this.cameraFormObj.farmAreaId = ''
      this.cameraFormObj.rtspUrl = ''
      this.cameraFormObj.pushRtmpUrl = ''
      this.cameraFormObj.playRtmpUrl = ''
      this.cameraFormObj.playHlsUrl = ''
      this.cameraFormObj.playFlvUrl = ''
      this.cameraFormObj.deployTime = ''
      this.cameraFormObj.brandName = ''
      this.cameraFormObj.type = ''
      this.cameraFormObj.voperation = ''
      this.cameraFormObj.voperations = []
      this.cameraFormObj.pushFlowMode = ''
      this.cameraFormObj.ip = ''
      this.cameraFormObj.port = ''
      this.cameraFormObj.userName = ''
      this.cameraFormObj.password = ''
      this.cameraFormModel = true
    },
    closeEquipmentFormHandle () {
      this.equipmentFormModel = false
    },
    closeCameraFormHandle () {
      this.cameraFormModel = false
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
              if (!_this.equipmentFormObj.equipmentId) {
                _this.closeEquipmentFormHandle()
              }
              _this.$Modal.success({
                title: '保存成功'
              })
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
    submitCameraFormHandle () {
      const _this = this
      _this.$refs['cameraForm'].validate((valid) => {
        if (valid) {
          _this.cameraFormSubmiting = true
          upinsertCamera(_this.cameraFormObj).then(res => {
            _this.cameraFormSubmiting = false
            if (res.status === 200 && res.data.code === 200) {
              _this.loadAllFarmCameras()
              if (!_this.cameraFormObj.cameraId) {
                _this.closeCameraFormHandle()
              }
              _this.$Modal.success({
                title: '保存成功'
              })
            } else {
              _this.$Modal.error({
                title: _this.$t('error_message_info') + res.data.message
              })
            }
          }).catch(function (reason) {
            _this.cameraFormSubmiting = false
            _this.closeCameraFormHandle()
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
    loadAllFarmCameras () {
      const _this = this
      _this.farmCamerasLoading = true
      farmAllCameras({ farmId: _this.farmId }).then(res => {
        _this.farmCamerasLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.farmCameras = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.farmCamerasLoading = false
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
    showEditCameraModel (resultId) {
      if (!resultId) {
        return
      }
      const _this = this
      _this.cameraDetailLoading = true
      _this.cameraFormObj = {}
      cameraDetail({ resultId }).then(res => {
        _this.cameraDetailLoading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.cameraFormObj = res.data.data
          _this.cameraFormModel = true
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.cameraDetailLoading = false
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
    deleteCameraHandle () {
      const _this = this
      _this.$Modal.confirm({
        title: _this.$t('table_handle_delete_tip'),
        loading: true,
        onOk: () => {
          deleteCamera({ resultId: _this.cameraFormObj.cameraId }).then(res => {
            if (res.status === 200 && res.data.code === 200) {
              _this.cameraFormObj = {}
              _this.cameraFormModel = false
              _this.$Modal.remove()
              _this.loadAllFarmCameras()
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
    _this.loadAllFarmCameras()
  }
}
</script>
