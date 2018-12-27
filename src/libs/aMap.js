export const mapLoader = (k) => {
  return new Promise(function (resolve, reject) {
    window.initTheMap = function () {
      resolve(AMap)
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initTheMap&key=' + k
    script.onerror = reject
    document.head.appendChild(script)
  })
}
