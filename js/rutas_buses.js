// Variable global, para acceder al mapa en todos los puntos del código.
var map;

$(document).ready(function(){
  // Cargar el mapa inicial
  cargarMapaBase();

  // Agregar estilo a los checkbox de toggle de capas.
  $('#checkCalles, #checkParadas').checkboxpicker({
    html: true,
    offLabel: '<span class="glyphicon glyphicon-remove">',
    onLabel: '<span class="glyphicon glyphicon-ok">'
  });

  // Agregando la funcionalidad de toggle de capas.
  $("#checkCalles").change(function(){
    cambiarVisibilidadCapa(1, this.checked);
  });

  $("#checkParadas").change(function(){
    cambiarVisibilidadCapa(2, this.checked);
  });

  // Cuando se selecciona el tab base, se ponen invisibles las capas de recorrido y visibles las de la base.
  $("#tabBase").click(function(){
    capasBusquedaVisible(false);

    cambiarVisibilidadCapa(1, $("#checkCalles").is(':checked'));
    cambiarVisibilidadCapa(2, $("#checkParadas").is(':checked'));
  });

  // Lo opuesto, invisible la base y visible la capa de recorridos.
  $("#tabRutas").click(function(){
    capasBusquedaVisible(true);

    cambiarVisibilidadCapa(1, false);
    cambiarVisibilidadCapa(2, false);
  });

  // Al dar click en el botón de búsqueda, se eliminan las capas de búsqueda anterior y ase agregan las nuevas capas de búsqueda.
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
  // Creando la capa de OSM, usando como fuente la capa de Wikimedia
  var capaOSM = new ol.layer.Tile({source: new ol.source.OSM({"url":"https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"})});

  //Creando las dos capas base, las calles y las paradas.
  //El formato de la capa calles es definido por defecto para mostrar el grosor distinto de las líneas.
  var capaParadas = crearCapa("paradas", "null");
  var capaCalles = crearCapa("calles", "null");

  //Creando la vista del mapa, configurada para el centro del área metropolitana.
  var view = new ol.View({
    projection: 'EPSG:4326',
    center: [-89.18015, 13.73789],
    zoom: 11.8
  });

  // Creando el mapa.
  window.map = new ol.Map({
    layers: [capaOSM, capaCalles, capaParadas],
    view: view,
    target: 'map'
  });
}

//Cargar una capa del NameSpace rutas de buses.
//Se manda el param "nombreRuta" para las capas SQLViews.
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

// Cambiando la visibilidad de una capa, según su número dentro del mapa.
function cambiarVisibilidadCapa(numCapa, visible){
  window.map.getLayers().item(numCapa).setVisible(visible);
}

// Remover las capas de la búsqueda, si existen.
function eliminarCapasBusqueda(){
  if(window.map.getLayers().getLength() > 3){
    window.map.getLayers().removeAt(3);
    window.map.getLayers().removeAt(3);
  }
}

// Cambiar la visibilidad de las capas de la búsqueda, si existen. 
function capasBusquedaVisible(visible){
  if(window.map.getLayers().getLength() > 3){
    window.map.getLayers().item(3).setVisible(visible);
    window.map.getLayers().item(4).setVisible(visible);
  }
}
