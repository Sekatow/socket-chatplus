const { io } = require('../server');
// const { usuarios } = require("../classes/usuarios");
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require("../utils/utils");

const users = new Usuarios();

io.on('connection', (client) => {

    client.on("entrarChat", (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: "El nombre/sala es necesario"

            });

        }


        client.join(data.sala);


        let personas = users.agregarPersona(client.id, data.nombre, data.sala);

        //  callback(personas);
        // console.log(personas);
        // callback(personas);
        client.broadcast.to(data.sala).emit("listaPersona", users.getPersonasporSala(data.sala));
        client.broadcast.to(data.sala).emit("crearMensaje", crearMensaje("Administrador", `${data.nombre} se unio al chat`));


        callback(users.getPersonasporSala(data.sala));

    });

    client.on("crearMensaje", (data, callback) => {

        let persona = users.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
        callback(mensaje);

    })

    client.on("disconnect", () => {

        let personaBorrada = users.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit("crearMensaje", crearMensaje("Administrador", `${personaBorrada.nombre} Salio`));
        client.broadcast.to(personaBorrada.sala).emit("listaPersona", users.getPersonasporSala(personaBorrada.sala));

    });

    //MENSAJES PRIVADOS

    client.on("mensajePrivado", (data) => {

        let persona = users.getPersona(client.id);
        client.broadcast.to(data.para).emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje))


    });


});