$(document).ready(function(){
  inicializar()
  leerDatos()
  $('#module-form').hide()
  $('#editardata').hide()
  $('.loader-back').hide();
  $('.message').hide();
})

var formulario
var condos
var submit = $('#enviardata').text()
var elementoEditar

function inicializar(){
  condos = firebase.database().ref().child('condos')
}

function enviarDatos(){
  var nombre = $('#first_name').val()
  var direccion = $('#address').val()
  condos.push({
    nombre: nombre,
    direccion: direccion
  })  
  $('#module-form').hide()
  $('#nuevo-condominio').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatos()
}

function editarDatos(){
  var nombre = $('#first_name').val()
  var direccion = $('#address').val()
  elementoEditar.update({
      nombre: nombre,
      direccion: direccion
    })
  $('#module-form').hide()
  $('#nuevo-condominio').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatos()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatos(){
  $("#condominios-rows > tr").remove()
  condos.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="borrar(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td>'+datos[key].direccion+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editar(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='</tr>'
          $("#condominios-rows").append(nuevaFila)
    }
  })
  //$('#condominios-rows').fadeIn().delay(2000);
}

function borrar(key){
  var checkstr =  confirm('Deseas eliminar el condominio?');
    if(checkstr === true){
      var elementoABorrar = condos.child(key)
      elementoABorrar.remove()
      leerDatos()
    }else{
    return false;
    }
}

function editar(key){
  $('#module-form').show()
  $('#nuevo-condominio').hide()
  var elementoAEditar = condos.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#first_name').val(datos.nombre)
    $('#address').val(datos.direccion)
  })
  $('#enviardata').hide()
  M.updateTextFields()
  $('#editardata').show()
}

//Check offline
setInterval(function() {
    if(!navigator.onLine)
{
  $('.message').show();
  $('.message').text('Modo sin conexión | Revisa tu conectividad');
  $('.message').css('background-color', '#f44336');
}else{
  $('.message').hide();
}
  }, 5000)
  
  function datatable(){
  $('.table').DataTable({
    retrieve: true,
      "language": {
                    "sProcessing":     "Procesando...",
                    "sLengthMenu":     "Mostrar _MENU_ registros",
                    "sZeroRecords":    "No se encontraron resultados",
                    "sEmptyTable":     "Ningún dato disponible en esta tabla",
                    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix":    "",
                    "sSearch":         "Buscar:",
                    "sUrl":            "",
                    "sInfoThousands":  ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst":    "Primero",
                        "sLast":     "Último",
                        "sNext":     "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    }
                }
    });
  $("select").val('10');
  //$('select').addClass("browser-default");
  $('select').formSelect();
}