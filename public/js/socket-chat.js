var socket = io();

var paras = new URLSearchParams(window.location.search);

if (!paras.has("nombre") || !paras.has("sala")) {
    window.location = "index.html";
    throw new Error("El nombre y sala son necesario");

}

var usuario = {
    nombre: paras.get("nombre"),
    sala: paras.get("sala")

}


socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit("entrarChat", usuario, function(resp) {

        console.log("usuarios conectados", resp);

    })

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });





// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//ESCUCHAR CAMBIOS DE USUARIOS !! CUANDO UN USUARIOSENTRA O SALE DEL CHAT
socket.on('listaPersona', function(users) {

    console.log(users);

});

//MENSAJES PRIVADOS

socket.on("mensajePrivado", function(mensaje) {

    console.log("mensaje Privado", mensaje);

});