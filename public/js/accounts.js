$(document).ready(function(){
  inicializar()
  leerDatos()
  $('#module-form').hide()
  $('#editardata').hide()
})

var formulario
var accounts
var submit = $('#enviardata').text()
var elementoEditar

function inicializar(){
  accounts = firebase.database().ref().child('accounts')
}

function enviarDatos(){
  var nombre = $('#name').val()
  var tipo = $('#tipo').val()
  var identificador = $('#cuenta').val()
  accounts.push({
    nombre: nombre,
    tipo: tipo,
    identificador : identificador
  })  
  $('#module-form').hide()
  $('#nueva-cuenta').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatos()
}

function editarDatos(){
  var nombre = $('#name').val()
  var tipo = $('#tipo').val()
  var identificador = $('#cuenta').val()
  elementoEditar.update({
      nombre: nombre,
    tipo: tipo,
    identificador : identificador
    })
  $('#module-form').hide()
  $('#nueva-cuenta').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatos()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatos(){
  $("#cuentas-rows > tr").remove()
  accounts.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      var nuevaFila='<tr>'
          nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="borrar(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='<td>'+datos[key].nombre+'</td>'
          nuevaFila+='<td>'+datos[key].tipo+'</td>'
          nuevaFila+='<td><a href="#!" onclick="editar(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='</tr>'
          $("#cuentas-rows").append(nuevaFila)
    }
  })
}

function borrar(key){
  var checkstr =  confirm('Deseas eliminar la cuenta?');
    if(checkstr === true){
      var elementoABorrar = accounts.child(key)
      elementoABorrar.remove()
      leerDatos()
    }else{
    return false;
    }
}

function editar(key){
  $('#module-form').show()
  $('#nueva-cuenta').hide()
  var elementoAEditar = accounts.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#name').val(datos.nombre)
    $('#tipo').val(datos.tipo)
    $('#cuenta').val(datos.identificador)
  })
  $('#enviardata').hide()
  M.updateTextFields()
  $('#editardata').show()
}