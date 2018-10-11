$(document).ready(function(){
  $('.btn-floating').hide()
  $('.estado_data').hide()
  $('#clasificacion-otro').hide()
  $('#destino-otro').hide()
  $('#adeudo-form').hide()
  $('#tabla-cuenta').hide()
  $('#menu1').css('color','#4FC3F7');
  inicializar()
  listaBusqueda()
})

function inicializar(){
  var account = $('#id_cuenta').val() 
  owners = firebase.database().ref().child('owners')
  earnings = firebase.database().ref().child('earnings')
}

$("#clasificacion").on('change', function() {
  if($(this).val() == 'otro'){
    $('#clasificacion-otro').show();
  }
});

$("#destino").on('change', function() {
  if($(this).val() == 'otro'){
    $('#destino-otro').show();
  }
});

function listaBusqueda(){
  owners.on('value',function(snap){
    var datos = snap.val()
    var data = {}
    var myConvertedData = {}
    for(var key in datos){
      //data.push(datos[key].cliente)
      data[key] = datos[key].cliente
      //data.push( [key] : datos[key].cliente )
    }
    $.each(data, function(index, value) {
      myConvertedData[value] = null;
    })
    $('input.autocomplete').autocomplete({
        data: myConvertedData,
      limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
      onAutocomplete: function(val) {
        $.each(data, function(index, value) {
          if(value == val){
            $('#id_cuenta').val(index)
            cargarDatosCuenta()
          }
        })
      }
      })
    $('.loader-back').hide();
  })
}


//Cargar movimientos del estado de cuenta actual
function cargarDatosCuenta(){
  var cuenta = $('#id_cuenta').val();
  $('.estado_data').show()
  cliente = firebase.database().ref().child('owners').child(cuenta);
  cliente.once('value',function(snap){
    var datos = snap.val();
    $('#desarrollo_name').text(datos.desarrollo);
    $('#calle_name').text(datos.calle);
    $('#mz_lt').text(datos.mz + ' / ' + datos.lt + ' / ' + datos.no_interior);
    $('#referencia_name').text(datos.referencia);
  });
  estado_cuenta = firebase.database().ref().child('estado_cuenta').child(cuenta);
  estado_cuenta.once('value',function(snap){
    $("#cuenta-rows > tr").remove();
    var datos = snap.val();
    var nuevaFila = '';
    for(var key in datos){
          nuevaFila+='<tr>';
          nuevaFila+='<td>'+datos[key].fecha+'</td>';
          nuevaFila+='<td>'+datos[key].fecha_vencimiento+'</td>';
          nuevaFila+='<td>'+datos[key].clasificacion+'</td>';
          nuevaFila+='<td>'+datos[key].concepto+'</td>';
          if(datos[key].fecha_vencimiento > today || datos[key].status != 'Adeudo pendiente'){
            nuevaFila+='<td>$'+number_format(datos[key].cargo,2)+'</td>';
            nuevaFila+='<td>$'+number_format(datos[key].abono,2)+'</td>';
            nuevaFila+='<td>$'+number_format((datos[key].cargo - datos[key].abono),2)+'</td>';
          }else{
            nuevaFila+='<td>$'+number_format((datos[key].cargo)*1.045,2)+'</td>';
            nuevaFila+='<td>$'+number_format(datos[key].abono,2)+'</td>';
            nuevaFila+='<td>$'+number_format((datos[key].cargo - datos[key].abono)*1.045,2)+'</td>';
          }
          if(datos[key].status == 'Adeudo pendiente'){
           nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="movimientoEditar(\''+key+'\');">'+datos[key].status+'</a></td>' ;
            nuevaFila+='<td><a class="green-text text-lighten-3" href="#!" onclick="abonarAdeudo(\''+key+'\');"><i class="material-icons">attach_money</i></a></td>';
          }else{
           nuevaFila+='<td class="green-text text-lighten-3">'+datos[key].status+'</td>';
           nuevaFila+='<td></td>';
          }
          nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="borrarMovimiento(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>';
          nuevaFila+='</tr>';
    }
    $("#cuenta-rows").append(nuevaFila);
    $('.btn-floating').show();
    $('#tabla-cuenta').show();
    $('.loader-back').hide();
    datatable()
  });
}

//Guardar adeudo en movimientos de la cuenta del cliente
function guardarAdeudo(){
  $('.loader-back').show();
  var fecha = $('#fecha').val()
  var fecha_vencimiento = $('#fecha_vencimiento').val()
  var monto = $('#monto').val()
  var concepto = $('#concepto').val()
  if($('#clasificacion').val() == 'otro'){
    var clasificacion = $('#clasificacion-otro').val()
  }else{
    var clasificacion = $('#clasificacion').val()
  }
  if($('#destino').val() == 'otro'){
    var destino = $('#destino-otro').val()
  }else{
    var destino = $('#destino').val()
  }
  estado_cuenta.push({
    fecha: fecha,
    fecha_vencimiento: fecha_vencimiento,
    cargo : monto,
    concepto : concepto,
    clasificacion : clasificacion,
    destino : destino,
    status : 'Adeudo pendiente',
    tipo : 'Adeudo'
  })  
  $('#adeudo-form').hide()
  cargarDatosCuenta()
  M.toast({html: 'Adeudo registrado!', classes: 'rounded'}); 
}

//Borrar movimiento de la listaBusquedafunction borrar(key){
 function borrarMovimiento(key){
  var checkstr =  confirm('Deseas eliminar este campo?');
    if(checkstr === true){
      var elementoABorrar = estado_cuenta.child(key)
      elementoABorrar.remove()
      cargarDatosCuenta()
    }else{
    return false;
    }
}

//Editar adeudo
function movimientoEditar(key){
  $('.loader-back').show()
  $('#adeudo-form').show()
  var cuenta = $('#id_cuenta').val() 
  var elementoAEditar = firebase.database().ref().child('estado_cuenta').child(cuenta).child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#fecha').val(datos.fecha)
    $('#fecha_vencimiento').val(datos.fecha_vencimiento)
    $('#monto').val(datos.cargo)
    $('#concepto').val(datos.concepto)
    $('#clasificacion').val(datos.clasificacion)
    $('#destino').val(datos.destino)
    $('select').formSelect()
    $('.loader-back').hide()
  })
  $('#enviardata').hide()
  $('#editardata').show()
}

function editarAdeudo(){
  $('.loader-back').show()
  var fecha = $('#fecha').val()
  var fecha_vencimiento = $('#fecha_vencimiento').val()
  var monto = $('#monto').val()
  var concepto = $('#concepto').val()
  var clasificacion = $('#clasificacion').val()
  var destino = $('#destino').val()
  elementoEditar.update({
      fecha: fecha,
      fecha_vencimiento: fecha_vencimiento,
      cargo : monto,
      concepto : concepto,
      clasificacion : clasificacion,
      destino : destino
    })
  $('#adeudo-form').hide()
  M.toast({html: 'Adeudo actualizado!', classes: 'rounded'});
  cargarDatosCuenta()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

//Registrar pago en adeudo
function abonarAdeudo(key){
  $('#modal_abono').modal('open')
  $('.loader-back').show()
  $('#key_abono').val(key)
  var cuenta = $('#id_cuenta').val() 
  var elementoAEditar = firebase.database().ref().child('estado_cuenta').child(cuenta).child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#fecha_abono').text(datos.fecha)
    $('#fecha_vencimiento_abono').text(datos.fecha_vencimiento)
    var cargo = parseFloat(datos.cargo)
    var abon = parseFloat(datos.abono) || 0
    var dife = cargo - abon
    if(datos.fecha_vencimiento < today){
      $('#monto_abono').text('$'+number_format((datos.cargo * 1.045),2))
      $('#monto_abono2').text('$'+number_format((dife * 1.045),2))
    }else{
      $('#monto_abono').text('$'+number_format(datos.cargo,2))
      $('#monto_abono2').text('$'+number_format(dife,2))
    }
    $('#monto_abono_hide').val(datos.abono)
    $('#adeudo_hide').val(datos.cargo)
    $('#concepto_abono').text(datos.concepto)
    $('#clasificacion_abono').text(datos.clasificacion)
    $('#destino_abono').text(datos.destino)
    M.updateTextFields()
    $('.loader-back').hide()
  })
}

function registrarAbono(){
  $('.loader-back').show()
  $('#modal_abono').modal('close')
  var key = $('#key_abono').val()
  var cuenta = $('#id_cuenta').val() 
  var fecha = new Date();
  var dd = fecha.getDate();
  var mm = fecha.getMonth()+1; //January is 0!
  var yyyy = fecha.getFullYear();
  if(dd<10) { dd = '0'+dd } 
  if(mm<10) { mm = '0'+mm } 
  fecha = dd + '/' + mm + '/' + yyyy;
  var adeudo = parseFloat($('#adeudo_hide').val())
  var abono_real = parseFloat($('#abono').val())
  var abono_hide = parseFloat($('#monto_abono_hide').val()) || 0
  var abono_val = abono_real + abono_hide
  var abono = 0
  if(isNaN(abono_val) || abono_val === 0){abono = 0}else{
    abono = abono_val
    estado_cuenta = firebase.database().ref().child('estado_cuenta').child(cuenta).child(key)
     if(abono >= adeudo){
        estado_cuenta.update({
          abono: abono,
          status : 'Pagado'
        })
       earnings.push({
         cliente: cuenta,
         concepto: 'Pago adeudo',
         fecha : fecha,
         monto : abono_real
       })
        cargarDatosCuenta()
        M.toast({html: 'Pago registrado!', classes: 'rounded'})
     }else{
        estado_cuenta.update({
          abono: abono
        })
       earnings.push({
         cliente: cuenta,
         concepto: 'Abono adeudo',
         fecha : fecha,
         monto : abono_real
       })
        cargarDatosCuenta()
        M.toast({html: 'Pago registrado!', classes: 'rounded'})
     }
  }
}

//Imprimir estado de cuenta
function imprimirCuenta(){
  $('.material-icons').hide()
  $('.btn-floating').hide()
  $('label').hide()
  $('#slide-out').hide()
  $('#work-place').css('margin-left','-240px')
  $('#autocomplete-input').css('border','solid 1px #FFF')
  //window.print()
}

var mediaQueryList = window.matchMedia('print');
mediaQueryList.addListener(function(mql) {
    if (mql.matches) {
        console.log('before print dialog open');
    } else {
        console.log('after print dialog closed');
        $('.material-icons').show()
          $('.btn-floating').show()
          $('label').show()
          $('#slide-out').show()
          $('#work-place').css('margin-left','0px')
          $('#autocomplete-input').css('border','bottom 0.5px solid')
    }
})

//Fecha actual
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) {
    dd = '0'+dd
} 
if(mm<10) {
    mm = '0'+mm
} 
today = dd + '/' + mm + '/' + yyyy;


//Convertir a moneda
function number_format(amount, decimals) {
    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto
    decimals = decimals || 0; // por si la variable no fue fue pasada
    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);
    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);
    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;
    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
    return amount_parts.join('.');
}