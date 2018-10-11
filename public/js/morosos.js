$(document).ready(function(){
  inicializar()
  leerDatos()
  $('#module-form').hide()
  $('#editardata').hide()
})

var formulario
var owners
var submit = $('#enviardata').text()
var elementoEditar

function inicializar(){
  owners = firebase.database().ref().child('owners')
}

function enviarDatos(){
  var nombre = $('#name').val()
  var nss = $('#nss').val()
  var desarrollo = $('#desarrollo').val()
  var mz = $('#mz').val()
  var lt = $('#lt').val()
  var no_interior = $('#nointerior').val()
  var referencia = $('#referencia').val()
  var calle = $('#calle').val()
  var telefono_casa = $('#telefono_casa').val()
  var movil = $('#telefono_movil').val()
  var telefono_trabajo = $('#telefono_trabajo').val()
  var correo = $('#email').val()
  var cargo_mesa = $('#mesa').val()
  var tipo_credito = $('#tipo_credito').val()
  var subsidio = $('#subsidio').val()
  var aviso_retencion = $('#aviso_retencion').val()
  var fecha_cobro = $('#fecha_cobro').val()
  var precio_final = $('#precio_final').val()
  var cuota_mensual = $('#cuota_mensual').val()
  var fecha_escrituracion = $('#fecha_escrituracion').val()
  var fecha_entrega = $('#fecha_entrega').val()
  var estatus = $('#status').val()
  var hipoteca_servicio = $('#hipoteca_servicio').val()
  var pago_directo = $('#pago_directo').val()
  var fondo_reserva = $('#fondo').val()
  owners.push({
    cliente: nombre,
    nss: nss,
    desarrollo : desarrollo,
    mz : mz,
    lt : lt,
    no_interior : no_interior,
    referencia : referencia,
    calle : calle,
    telefono_casa : telefono_casa,
    movil : movil,
    telefono_trabajo : telefono_trabajo,
    correo : correo,
    cargo_mesa : cargo_mesa,
    tipo_credito : tipo_credito,
    subsidio : subsidio,
    aviso_retencion : aviso_retencion,
    fecha_cobro : fecha_cobro,
    precio_final : precio_final,
    cuota_mensual : cuota_mensual,
    fecha_escrituracion : fecha_escrituracion,
    fecha_entrega : fecha_entrega,
    estatus : estatus,
    hipoteca_servicio : hipoteca_servicio,
    pago_directo : pago_directo,
    fondo_reserva : fondo_reserva
  })  
  $('#module-form').hide()
  $('#nuevo-propietario').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatos()
}

function editarDatos(){
 var nombre = $('#name').val()
  var nss = $('#nss').val()
  var desarrollo = $('#desarrollo').val()
  var mz = $('#mz').val()
  var lt = $('#lt').val()
  var no_interior = $('#nointerior').val()
  var referencia = $('#referencia').val()
  var calle = $('#calle').val()
  var telefono_casa = $('#telefono_casa').val()
  var movil = $('#telefono_movil').val()
  var telefono_trabajo = $('#telefono_trabajo').val()
  var correo = $('#email').val()
  var cargo_mesa = $('#mesa').val()
  var tipo_credito = $('#tipo_credito').val()
  var subsidio = $('#subsidio').val()
  var aviso_retencion = $('#aviso_retencion').val()
  var fecha_cobro = $('#fecha_cobro').val()
  var precio_final = $('#precio_final').val()
  var cuota_mensual = $('#cuota_mensual').val()
  var fecha_escrituracion = $('#fecha_escrituracion').val()
  var fecha_entrega = $('#fecha_entrega').val()
  var estatus = $('#status').val()
  var hipoteca_servicio = $('#hipoteca_servicio').val()
  var pago_directo = $('#pago_directo').val()
  var fondo_reserva = $('#fondo').val()
  elementoEditar.update({
      cliente: nombre,
      nss: nss,
      desarrollo : desarrollo,
      mz : mz,
      lt : lt,
      no_interior : no_interior,
      referencia : referencia,
      calle : calle,
      telefono_casa : telefono_casa,
      movil : movil,
      telefono_trabajo : telefono_trabajo,
      correo : correo,
      cargo_mesa : cargo_mesa,
      tipo_credito : tipo_credito,
      subsidio : subsidio,
      aviso_retencion : aviso_retencion,
      fecha_cobro : fecha_cobro,
      precio_final : precio_final,
      cuota_mensual : cuota_mensual,
      fecha_escrituracion : fecha_escrituracion,
      fecha_entrega : fecha_entrega,
      estatus : estatus,
      hipoteca_servicio : hipoteca_servicio,
      pago_directo : pago_directo,
      fondo_reserva : fondo_reserva
    })
  $('#module-form').hide()
  $('#nuevo-propietario').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatos()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatos(){
  owners.on('value',function(snap){
    $("#propietarios-rows > tr").remove()
    var datos = snap.val();
     var nuevaFila='';
    for(var key in datos){
          nuevaFila+='<tr>';
          nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="borrar(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>';
          nuevaFila+='<td>'+datos[key].cliente+'</td>';
          nuevaFila+='<td>'+datos[key].desarrollo+'</td>';
          nuevaFila+='<td class="hide-on-small-only">'+datos[key].calle+'</td>';
          nuevaFila+='<td>'+datos[key].movil+'</td>';
          nuevaFila+='<td class="hide-on-small-only">'+datos[key].correo+'</td>';
          nuevaFila+='<td><a href="#!" onclick="editar(\''+key+'\');"><i class="material-icons">edit</i></a></td>';
          nuevaFila+='</tr>';
    }
    $("#propietarios-rows").append(nuevaFila);
  })
}

function borrar(key){
  var checkstr =  confirm('Deseas eliminar el propietario?');
    if(checkstr === true){
      var elementoABorrar = owners.child(key)
      elementoABorrar.remove()
      leerDatos()
    }else{
    return false;
    }
}

function editar(key){
  $('#module-form').show()
  $('#nuevo-propietario').hide()
  var elementoAEditar = owners.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#name').val(datos.cliente)
    $('#nss').val(datos.nss)
    $('#desarrollo').val(datos.desarrollo)
    $('#mz').val(datos.mz)
    $('#lt').val(datos.lt)
    $('#nointerior').val(datos.no_interior)
    $('#referencia').val(datos.referencia)
    $('#calle').val(datos.calle)
    $('#telefono_casa').val(datos.telefono_casa)
    $('#telefono_movil').val(datos.movil)
    $('#telefono_trabajo').val(datos.telefono_trabajo)
    $('#email').val(datos.correo)
    $('#mesa').val(datos.cargo_mesa)
    $('#tipo_credito').val(datos.tipo_credito)
    $('#subsidio').val(datos.subsidio)
    $('#aviso_retencion').val(datos.aviso_retencion)
    $('#fecha_cobro').val(datos.fecha_cobro)
    $('#precio_final').val(datos.precio_final)
    $('#cuota_mensual').val(datos.cuota_mensual)
    $('#fecha_escrituracion').val(datos.fecha_escrituracion)
    $('#fecha_entrega').val(datos.fecha_entrega)
    $('#status').val(datos.estatus)
    $('#hipoteca_servicio').val(datos.hipoteca_servicio)
    $('#pago_directo').val(datos.pago_directo)
    $('#fondo').val(datos.fondo_reserva)
  })
  $('#enviardata').hide()
  M.updateTextFields()
  $('#editardata').show()
}