require([
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/widgets/BasemapGallery',
  'esri/widgets/AreaMeasurement2D',
  'esri/layers/FeatureLayer',
], function (
  esriConfig,
  Map,
  MapView,
  BasemapGallery,
  AreaMeasurement2D,
  FeatureLayer
) {
  esriConfig.apiKey =
    'AAPK2791149d68d848348a618346dd9768f5OWdBoNB_KWEXwT4z6pUhOGUKlpe2WWA151q98zjM0rFnjQHEKfUvbWEzAbVpukth'
  //the map is used to manage overlaying Layers 2D or 3D
  //you have to render this map in sceneView or mapView
  var mymap = new Map({
    basemap: 'arcgis-topographic',
  })
  var view = new MapView({
    map: mymap,
    container: 'map',
    center: [33, 33],
    zoom: 6,
  })

  view.on('click', (event) => {
    console.log(event)

    view.goTo(
      {
        center: [event.mapPoint.longitude, event.mapPoint.latitude],
        zoom: 6,
      },
      { duration: 5000 }
    )
  })
  var areaMeasurement = new AreaMeasurement2D({
    view: view,
  })
  view.ui.add(areaMeasurement, 'top-right')
  var baseMapGallary = new BasemapGallery({
    view: view,
  })

  view.ui.add(baseMapGallary, 'bottom-left')

  var flag = false
  var button = document.getElementById('BMGwidget')

  button.addEventListener('click', () => {
    if (flag == false) {
      view.ui.remove(baseMapGallary)
      flag = true
      button.textContent = 'show'
    } else if (flag == true) {
      view.ui.add(baseMapGallary, 'bottom-left')
      flag = false
      button.textContent = 'hide'
    }
  })

  var FeatureLayer = new FeatureLayer({
    Url: '',
  })
})
