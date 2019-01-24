<template>
  <div>
    <div id="map" :style="'width: 100%;height:' + height + 'px'"></div>
  </div>
</template>

<script>
// import InforCard from '_c/info-card'
import { mapLoader } from '@/libs/aMap'
// import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/component/tooltip'

export default {
  name: 'home',
  // components: {
  //   InforCard
  // },
  data () {
    return {
      map: null,
      marker: null,
      height: 200
    }
  },
  mounted () {
    const _this = this
    mapLoader().then(AMap => {
      _this.map = new AMap.Map(document.getElementById('map'), {
        /**
         *    幻影黑 dark
         *    月光银 light
         *    远山黛 whitesmoke
         *    草色青 fresh
         *    雅士灰 grey
         *    涂鸦 graffiti
         *    马卡龙 macaron
         *    靛青蓝 blue
         *    极夜蓝 darkblue
         *    酱籽 wine
         */
        mapStyle: 'amap://styles/fresh',
        resizeEnable: true,
        zoom: 10
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
    // console.info(echarts)
    _this.height = window.document.body.offsetHeight - 140
    var ctimer = false
    window.addEventListener('resize', () => {
      if (ctimer) {
        window.clearTimeout(ctimer)
      }
      ctimer = window.setTimeout(() => {
        _this.height = window.document.body.offsetHeight - 140
      }, 100)
    })
  }
}
</script>
