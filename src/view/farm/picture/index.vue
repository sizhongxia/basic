<style lang="less">
@import "./index.less";
</style>
<template>
  <div>
    <Card shadow>
      <Form :label-width="80">
        <FormItem :label="$t('farm_area')">
          <Select
            v-model="farmAreaId"
            clearable
            style="width: 240px">
            <Option v-for="item in farmPictureAreas" :key="item.areaId" :value="item.areaId">{{ item.areaName }}</Option>
          </Select>
          <Button style="margin-left: 4px" @click="load" class="search-btn" type="primary"><Icon type="md-search" />{{ $t('search') }}</Button>
        </FormItem>
      </Form>
      <Card style="width:420px" v-for="item in pictures" :key="item.picId" class="pic-img-card">
        <span slot="title">{{ item.picTitle }}</span>
        <div style="text-align:center">
          <img :src="item.picUrl" style="width: 320px;height: 180px">
          <p>
            <Button type="text" style="color:red" @click="handleDelete(item.picId)">{{ $t('delete') }}</Button>
            <Divider type="vertical" />
            <Button type="text" @click="showEditFormModel(item)">{{ $t('edit') }}</Button>
          </p>
        </div>
      </Card>
      <div style="clear:both"></div>
    </Card>
    <Spin size="large" fix v-if="loading || farmPictureAreasLoading"></Spin>
    <Modal
      v-model="farmEditPictrueModel"
      scrollable
      width="520"
      mask
      :mask-closable="false">
      <p slot="header">
        <Icon type="ios-image-outline"></Icon>
        <span>{{ $t('farm_picture_update') }}</span>
      </p>
      <div>
        <div>
            <Form :model="farmPictureFormObj" :label-width="140" ref="farmPictureForm">
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
        <Button type="primary" size="large" :loading="farmPicSubmiting" @click="updateFarmPicHandle">{{ $t('save') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { farmPictures, deleteFarmPicture, updateFarmPicture } from '@/api/farm'
import { farmAllAreas } from '@/api/farmArea'
export default {
  data () {
    return {
      farmId: '',
      farmAreaId: '',
      loading: false,
      pictures: [],
      farmEditPictrueModel: false,
      farmPictureFormObj: {},
      farmPictureAreasLoading: false,
      farmPictureAreas: [],
      farmPicSubmiting: false
    }
  },
  computed: { },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    load () {
      const _this = this
      if (!_this.farmId) {
        _this.closeTag({
          name: 'farm_picture'
        })
      }
      _this.loading = true
      farmPictures({ farmId: _this.farmId, farmAreaId: _this.farmAreaId }).then(res => {
        _this.loading = false
        if (res.status === 200 && res.data.code === 200) {
          _this.pictures = res.data.data
        } else {
          _this.$Modal.error({
            title: _this.$t('error_message_info') + res.data.message
          })
        }
      }).catch(function (reason) {
        _this.loading = false
        _this.$Modal.error({
          title: _this.$t('error_message_info') + reason.message
        })
      })
    },
    handleDelete (picId) {
      const _this = this
      _this.$Modal.confirm({
        title: _this.$t('table_handle_delete_tip'),
        loading: true,
        onOk: () => {
          deleteFarmPicture({ picId }).then(res => {
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
    showEditFormModel (picObj) {
      const _this = this
      _this.farmPictureFormObj.farmId = picObj.farmId
      _this.farmPictureFormObj.farmAreaId = picObj.farmAreaId
      _this.farmPictureFormObj.picId = picObj.picId
      _this.farmPictureFormObj.title = picObj.picTitle
      _this.farmPictureFormObj.sortNum = picObj.sortNum
      _this.farmEditPictrueModel = true
    },
    updateFarmPicHandle () {
      const _this = this
      _this.farmPicSubmiting = true
      updateFarmPicture(_this.farmPictureFormObj).then(res => {
        _this.farmPicSubmiting = false
        if (res.status === 200 && res.data.code === 200) {
          _this.farmEditPictrueModel = false
          _this.load()
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
    _this.farmId = window.localStorage.getItem('page_farm_picture_farm_id')
    _this.load()
    _this.farmPictureAreasLoading = false
    farmAllAreas({ farmId: _this.farmId }).then(res => {
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
  }
}
</script>
