require([
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/widgets/BasemapGallery',
  'esri/widgets/AreaMeasurement2D',
  'esri/layers/FeatureLayer',
  'esri/widgets/Search',
  'esri/request',
], function (
  esriConfig,
  Map,
  MapView,
  BasemapGallery,
  AreaMeasurement2D,
  FeatureLayer,
  Search,
  esriRequest
) {
  esriConfig.apiKey =
    'AAPK2791149d68d848348a618346dd9768f5OWdBoNB_KWEXwT4z6pUhOGUKlpe2WWA151q98zjM0rFnjQHEKfUvbWEzAbVpukth'
  //the map is used to manage overlaying Layers 2D or 3D
  //you have to render this map in sceneView or mapView

  var renderer = {
    type: 'class-breaks', // autocasts as new SimpleRenderer()
    field: 'POP',
    classBreakInfos: [
      {
        minValue: 0,
        maxValue: 10000,
        symbol: {
          type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
          style: 'diamond',
          color: 'white',
        },
      },
      {
        minValue: 10001,
        maxValue: 1000000,
        symbol: {
          type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
          style: 'diamond',
          color: 'blue',
        },
      },
      {
        minValue: 1000001,
        maxValue: 10000000000000,
        symbol: {
          type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
          style: 'diamond',
          color: 'red',
        },
      },
    ],
    defaultSymbol: {
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      style: 'diamond',
      color: 'green',
    },
    // symbol: {
    //   type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
    //   size: 6,

    //   outline: {
    //     //autocasts as new SimpleLineSymbol()
    //     width: 0.5,
    //     color: 'white',
    //   },
    // },
  }

  var renderer2 = {
    type: 'unique-value', // autocasts as new SimpleRenderer()
    field: 'CNTRY_NAME',
    uniqueValueInfos: [
      {
        value: 'Egypt',
        symbol: {
          type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
          style: 'diamond',
          color: 'white',
        },
      },
      {
        value: 'Libya',
        symbol: {
          type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
          style: 'diamond',
          color: 'blue',
        },
      },
      {
        value: 'Italy',
        symbol: {
          type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
          style: 'diamond',
          color: 'red',
        },
      },
    ],
    // defaultSymbol: {
    //   type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
    //   style: 'diamond',
    //   color: 'green',
    // },
    // symbol: {
    //   type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
    //   size: 6,

    //   outline: {
    //     //autocasts as new SimpleLineSymbol()
    //     width: 0.5,
    //     color: 'white',
    //   },
    // },
  }

  var featureLayer = new FeatureLayer({
    url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/world_cities/FeatureServer/0',
    // definitionExpression: "CNTRY_NAME = 'EGYPT'", //displays only Egypt
    popupTemplate: {
      title: '{CNTRY_NAME}',
      content: '{CITY_NAME} <br/>  It has pop of {POP}',
    },
    renderer: renderer2,
  })
  //class breaks takes min and max
  //unique-value makes it unique on Display
  //simple makes it very simple

  var mymap = new Map({
    basemap: 'arcgis-topographic',
    layers: [featureLayer],
  })

  var view = new MapView({
    map: mymap,
    container: 'map',
    center: [33, 33],
    zoom: 3,
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

  document.getElementById('go').addEventListener('click', (e) => {
    var value = document.getElementById('query').value

    var QueryUrl =
      'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/world_cities/FeatureServer/0/query'
    var reqOpts = {
      query: {
        where: value,
        outFields: '*',
        f: 'json',
      },
    }
    esriRequest(QueryUrl, reqOpts).then((r) => {
      console.log(r.data.features[0].attributes)
      var text = JSON.stringify(r.data.features[0].attributes)
      document.getElementById('output').textContent = text
    })
  })
})
