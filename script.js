require([
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/widgets/BasemapGallery',
  'esri/widgets/AreaMeasurement2D',
  'esri/layers/FeatureLayer',
  'esri/widgets/Search',
], function (
  esriConfig,
  Map,
  MapView,
  BasemapGallery,
  AreaMeasurement2D,
  FeatureLayer,
  Search
) {
  esriConfig.apiKey =
    'AAPK2791149d68d848348a618346dd9768f5OWdBoNB_KWEXwT4z6pUhOGUKlpe2WWA151q98zjM0rFnjQHEKfUvbWEzAbVpukth'
  //the map is used to manage overlaying Layers 2D or 3D
  //you have to render this map in sceneView or mapView
  var featureLayer = new FeatureLayer({
    url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/world_cities/FeatureServer/0',
    // definitionExpression: "CNTRY_NAME = 'EGYPT'", //displays only Egypt
    popupTemplate: {
      title: '{CNTRY_NAME}',
      content: '{CITY_NAME}',
    },
  })
  var mymap = new Map({
    basemap: 'arcgis-topographic',
    layers: [featureLayer],
  })
  var NewfeatureLayer = new FeatureLayer({
    url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/covid_population_counties_polygons/FeatureServer/0',
  })
  mymap.layers.add(NewfeatureLayer)
  var view = new MapView({
    map: mymap,
    container: 'map',
    center: [33, 33],
    zoom: 6,
  })
  featureLayer.on('layerview-create', (e) => {
    console.log(e)
    featureLayer.queryExtent().then((q) => {
      console.log(q)
      view.goTo(q.extent, { duration: 5000 })
    })
  })
  view.on('click', (event) => {
    console.log(event)
    //gotTo
    /**
     * @param  {center}
     * @param  {duration}
     */
    view.goTo(
      {
        center: [event.mapPoint.longitude, event.mapPoint.latitude],
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

  var flag = true
  //twhen we make mapView we called ui during auto casting
  /**ui.add()
   * @param baseMapGallary
   */
  view.ui.add(baseMapGallary, 'bottom-left')
  var button = document.getElementById('BMGwidget')
  const search = new Search({
    view: view,
  })
  view.ui.add(search, 'top-right')
  button.addEventListener('click', () => {
    if (flag == false) {
      view.ui.remove(baseMapGallary)
      flag = !flag
      button.textContent = 'show'
    } else if (flag == true) {
      view.ui.add(baseMapGallary, 'bottom-left')
      flag = !flag
      button.textContent = 'hide'
    }
  })
})
