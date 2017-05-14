$(document).ready(cargarMapaBase);

function cargarMapaBase() {
  // Creando la capa de OSM
  var capaOSM = new ol.layer.Tile({source: new ol.source.OSM()});
  var capaParadas = crearCapa("paradas");
  var capaCalles = crearCapa("calles");

  //Creando la vista del mapa, configurada para el centro del área metropolitana.
  var view = new ol.View({
    projection: 'EPSG:4326',
    center: [-89.18015, 13.73789],
    zoom: 11.8
  });

  var map = new ol.Map({
    layers: [capaOSM, capaCalles, capaParadas],
    view: view,
    target: 'map'
  });
}


//Cargar una capa del NameSpace rutas de buses.
function crearCapa(nombreCapa){
  var nombre = "RutasBuses:" + nombreCapa
  var wms =  new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/RutasBuses/wms',
    params: {
      'LAYERS': nombre
    }
  });

  return new ol.layer.Tile({source: wms});
}
