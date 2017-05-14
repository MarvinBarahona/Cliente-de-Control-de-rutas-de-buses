var map;

$(document).ready(function(){
  cargarMapaBase();

  $('#checkCalles, #checkParadas').checkboxpicker({
    html: true,
    offLabel: '<span class="glyphicon glyphicon-remove">',
    onLabel: '<span class="glyphicon glyphicon-ok">'
  });

  $("#checkCalles").change(function(){
    cambiarVisibilidadCapa(1, this.checked);
  });

  $("#checkParadas").change(function(){
    cambiarVisibilidadCapa(2, this.checked);
  });

  $("#tabBase").click(function(){
    capasBusquedaVisible(false);

    cambiarVisibilidadCapa(1, $("#checkCalles").is(':checked'));
    cambiarVisibilidadCapa(2, $("#checkParadas").is(':checked'));
  });

  $("#tabRutas").click(function(){
    capasBusquedaVisible(true);

    cambiarVisibilidadCapa(1, false);
    cambiarVisibilidadCapa(2, false);
  });

  $("#btnBuscar").click(function(){
    eliminarCapasBusqueda();

    var nombre = $("#nombreRuta").val();
    var capaRecorrido = crearCapa("Rutas", nombre);
    var capaParadasRecorrido = crearCapa("Paradas_Rutas", nombre);

    window.map.getLayers().push(capaRecorrido);
    window.map.getLayers().push(capaParadasRecorrido);
  });
});


function cargarMapaBase() {
  // Creando la capa de OSM
  var capaOSM = new ol.layer.Tile({source: new ol.source.OSM()});
  var capaParadas = crearCapa("paradas", "null");
  var capaCalles = crearCapa("calles", "null");

  //Creando la vista del mapa, configurada para el centro del área metropolitana.
  var view = new ol.View({
    projection: 'EPSG:4326',
    center: [-89.18015, 13.73789],
    zoom: 11.8
  });

  window.map = new ol.Map({
    layers: [capaOSM, capaCalles, capaParadas],
    view: view,
    target: 'map'
  });
}

//Cargar una capa del NameSpace rutas de buses.
function crearCapa(nombreCapa, param){
  var nombre = "RutasBuses:" + nombreCapa
  var params = "nombre:" + param;
  var wms =  new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/RutasBuses/wms',
    params: {
      'LAYERS': nombre,
      'VIEWPARAMS': params
    }
  });

  return new ol.layer.Tile({source: wms});
}

function cambiarVisibilidadCapa(numCapa, visible){
  window.map.getLayers().item(numCapa).setVisible(visible);
}

function eliminarCapasBusqueda(){
  if(window.map.getLayers().getLength() > 3){
    window.map.getLayers().removeAt(3);
    window.map.getLayers().removeAt(3);
  }
}

function capasBusquedaVisible(visible){
  if(window.map.getLayers().getLength() > 3){
    window.map.getLayers().item(3).setVisible(visible);
    window.map.getLayers().item(4).setVisible(visible);
  }
}
