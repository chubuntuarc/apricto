$(document).ready(function(){
  inicializar()
  leerDatos()
  $('#module-form').hide()
  $('#editardata').hide()
})

var formulario
var earnings
var submit = $('#enviardata').text()
var elementoEditar


function inicializar(){
  earnings = firebase.database().ref().child('earnings')
  owners = firebase.database().ref().child('owners')
  
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
  
}

function enviarDatos(){
  var cliente = $('#cliente').val()
  var concepto = $('#concepto').val()
  var monto = $('#monto').val()
  var tipo = $('#tipo').val()
  var status = $('#status').val()
  earnings.push({
    cliente: cliente,
    concepto: concepto,
    monto : monto,
    tipo : tipo,
    status : status,
    fecha : today
  })  
  $('#module-form').hide()
  $('#nuevo-ingreso').show()
  M.toast({html: 'Guardado!', classes: 'rounded'});
  leerDatos()
}

function editarDatos(){
  var cliente = $('#cliente').val()
  var concepto = $('#concepto').val()
  var monto = $('#monto').val()
  var tipo = $('#tipo').val()
  var status = $('#status').val()
  elementoEditar.update({
      cliente: cliente,
      concepto: concepto,
      monto : monto,
      tipo : tipo,
      status : status,
      fecha : today
    })
  $('#module-form').hide()
  $('#nuevo-ingreso').show()
  M.toast({html: 'Actualizado!', classes: 'rounded'});
  leerDatos()
  $('input').val('')
  $('#enviardata').show()
  $('#editardata').hide()
}

function leerDatos(){
  earnings.on('value',function(snap){
    $("#ingresos-rows > tr").remove()
    var datos = snap.val()
     var nuevaFila
    for(var key in datos){
          nuevaFila+='<tr>'
          nuevaFila+='<td><a class="red-text text-lighten-3" href="#!" onclick="borrar(\''+key+'\');"><i class="tiny material-icons">clear</i></a></td>'
          nuevaFila+='<td><span class="'+datos[key].cliente+'"></span></td>'
          nuevaFila+='<td>'+datos[key].fecha+'</td>'
          nuevaFila+='<td>'+datos[key].concepto+'</td>'
          nuevaFila+='<td>$'+number_format(datos[key].monto,2)+'</td>'
          //nuevaFila+='<td>'+datos[key].status+'</td>'
          //nuevaFila+='<td><a href="#!" onclick="editar(\''+key+'\');"><i class="material-icons">edit</i></a></td>'
          nuevaFila+='</tr>'
    }
    $("#ingresos-rows").append(nuevaFila)
    leerNombres()
  })
}

function leerNombres(){
  owners.on('value',function(snap){
    var datos = snap.val()
    for(var key in datos){
      $('.'+key).text(datos[key].nombre)
    }
    $('.loader-back').hide()
  })
}

function borrar(key){
  var checkstr =  confirm('Deseas eliminar el ingreso?');
    if(checkstr === true){
      var elementoABorrar = earnings.child(key)
      elementoABorrar.remove()
      leerDatos()
    }else{
    return false;
    }
}

function editar(key){
  $('#module-form').show()
  $('#nuevo-ingreso').hide()
  var elementoAEditar = earnings.child(key)
  elementoAEditar.once('value', function(snap){
    var datos = snap.val()
    elementoEditar = elementoAEditar
    $('#cliente').val(datos.cliente)
    $('#concepto').val(datos.concepto)
    $('#monto').val(datos.monto)
    $('#tipo').val(datos.tipo)
    //$('#status').val(datos.status)
  })
  $('#enviardata').hide()
  $('#editardata').show()
}

//Imprimir estado de cuenta
function imprimirIngresos(){
  $('.material-icons').hide()
  $('.btn-floating').hide()
  $('label').hide()
  $('#slide-out').hide()
  $('#work-place').css('margin-left','-240px')
  window.print()
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
    }
})

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