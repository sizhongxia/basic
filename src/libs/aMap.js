export const mapLoader = () => {
  return new Promise(function (resolve, reject) {
    window.initTheMap = function () {
      resolve(AMap)
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initTheMap&key=463486f9226366a6bd043b5000e63180'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
