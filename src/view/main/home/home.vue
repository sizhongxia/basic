<template>
  <div>
    <div id="map"></div>
    <p>农场现场轮播图</p>
    <p>基本信息：位置\Logo\名称\网站</p>
    <p>温度\湿度\氨气实时数据展示</p>
    <p>设备在线\离线数量统计</p>
    <p>接入摄像头统计</p>
    <p>禽畜种类\性别\疫苗接种\产蛋统计</p>
    <p>最近一次投食记录</p>
    <p>最近一次巡检记录</p>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import { mapLoader } from '@/libs/aMap'
export default {
  name: 'home',
  components: {
    InforCard
  },
  data () {
    return {
      map: null,
      marker: null
    }
  },
  mounted () {
    const _this = this
    mapLoader('463486f9226366a6bd043b5000e63180').then(AMap => {
      _this.map = new AMap.Map(document.getElementById('map'), {
        resizeEnable: true,
        zoom: 12
      })
      _this.map.on('click', function (e) {
        if (!_this.marker) {
          _this.marker = new AMap.Marker({ map: _this.map })
        }
        _this.marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()])
      })
      _this.$nextTick(function () {
      })
    })
  }
}
</script>

<style lang="less">
#map {
  width: 100%;
  height: 400px;
}
.count-style{
  font-size: 50px;
}
</style>
