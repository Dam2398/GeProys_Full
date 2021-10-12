var express = require('express');
var socket = require('socket.io');
const mysql =require('mysql');  //Solo estas dependencias


//Base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'dimerica2398',
    database: 'mydbdos'
});
connection.connect( (e) =>{
    if(e) throw e
    console.log('Conexion base de datos exitosa')
})

//prueba
/* connection.query('SELECT * FROM message', (e,rows)=>{
    if(e) throw e
    console.log(rows)
}) */
const insertarMsg = "INSERT INTO message (userId,projectId,message) VALUES ";//(2,2,'asdasdasdasd')
const insertNot = "INSERT INTO notification (userId,projectId,notification) VALUES "

// App setup
var app = express();
var server = app.listen(3001, function(){
    console.log('listening for requests on port 3001');
});

/////////////////////////////////////////////////////

//const rooms = new Object(),room={users:{}};


const rooms= {};
/* rooms['1c'] ={ users: {} };
rooms['3c'] ={ users: {} };
rooms['6c'] ={ users: {} };

rooms['1n'] ={ users: {} };
rooms['3n'] ={ users: {} };
rooms['6n'] ={ users: {} }; 
*/
connection.query(`SELECT id FROM project `,(e,rows)=>{//Para crear las salas y tenerlas preparadas
    if(e) throw e
    //console.log(rows)
    for (let i = 0; i < rows.length; i++) {
        //console.log(`${rows[i].id}n`)
        rooms[`n${rows[i].id}`] ={ users: {} }//ojo
        rooms[`c${rows[i].id}`] ={ users: {} }
    }
})

//////////////////////////////////////////////////////
 
// Socket setup
var io = socket(server);

// Listen for new connection and print a message in console 
io.on('connection', (socket) => {

    console.log(`New connection ${socket.id}`)

    socket.on('room-created', (room, id) =>{///                                       AQUI (listo)
        console.log('Alguien creo la sala '+room);

        const chat = room.substr(1);//ID DEL PROYECTO
        connection.query(`SELECT projectId FROM urp WHERE userId = ${id}`, (e, pro)=>{
            if(e) throw e
            var mal = true;
            //console.log(pro)
            for (let i = 0; i < pro.length; i++) {
                if(chat==pro[i].projectId){
                    connection.query(`SELECT * FROM message WHERE projectId = ${chat}`, (e,rows)=>{
                        if(e) throw e
                        //console.log(rows)  RowDataPacket
                        var string =JSON.stringify(rows);///////////PARA PASARLO A JSON
                        var json = JSON.parse(string);
                        console.log('Envio de mensajes')
                        socket.emit('old-msg',json)
                    })
                    mal = false;
                }
            }
            if(mal){
                socket.emit('mal','No autorizado mensajes')
                console.log(' no autorizado')
            }
        })
    })

    socket.on('room-created-not',id =>{

        connection.query(`SELECT projectId FROM urp WHERE userId = ${id}`, (e, pro)=>{
            for (let i = 0; i < pro.length; i++) {
                connection.query(`SELECT * FROM notification WHERE projectId = ${pro[i].projectId}`,(e,notifis)=>{
                    if(e) throw e
                    var string = JSON.stringify(notifis);
                    var json = JSON.parse(string);
                    //console.log(json)
                    socket.emit('old-not', json);
                })
                
            }
        })
        
/*         connection.query(`SELECT * FROM notification WHERE userId = ${id}`,(e,notifis)=>{
            if(e) throw e
            var string = JSON.stringify(notifis);
            var json = JSON.parse(string);
            console.log(json)
            socket.emit('old-not', json);
        }) */
    })



    try {
        socket.on('new-user-not', (room,name)=>{// room = projectId+'n'

            connection.query(`SELECT firstName FROM user WHERE id = ${name}`, (e,rows)=>{
                if(e) throw e
                const nombre = String(rows[0].firstName);
                connection.query(`SELECT projectId FROM urp WHERE userId = ${name}`, (error,projects)=>{
                    if(error) throw error
                    //console.log(projects)
                    
                    for (let i = 0; i < projects.length; i++) {
                        //if (rooms[`${projects[i].projectId}n`].users[socket.id] != '') console.log('hola')
                        if (rooms[`n${projects[i].projectId}`].users[socket.id] != '') {
                            rooms[`n${projects[i].projectId}`].users[socket.id] = nombre;
                            socket.join(`n${projects[i].projectId}`);
                            console.log(`se conecto ${rooms[`n${projects[i].projectId}`].users[socket.id]} a la sala n${projects[i].projectId}`);   
                        } 
                     
                    }
                    console.log(rooms)
                })//proyectos donde trabaja usuario
                //console.log(typeof rows[0].firstName);
            })
        })

        socket.on('new-user',(room, name) => {// room = projectId+'c'                       AQUI

            connection.query(`SELECT firstName FROM user WHERE id = ${name}`, (e,rows)=>{
                if(e) throw e
                const nombre = String(rows[0].firstName);
                var mal = true;
                const chat = room.substr(1);//ID DEL PROYECTO

                connection.query(`SELECT projectId FROM urp WHERE userId = ${name}`, (error,projects)=>{
                    if(error) throw error
                    for (let i = 0; i < projects.length; i++) {//lo saco de todas las salas de chat anteriores si es que existe en alguna
                        socket.leave(`c${projects[i].projectId}`)
                        //socket.to(`c${projects[i].projectId}`).broadcast.emit('user-disconnected', rooms[`c${projects[i].projectId}`].users[socket.id])
                        if(chat==projects[i].projectId){
                            mal = false
                        }
                    }
                    if(mal){
                        socket.emit('mal','No autorizado')
                        console.log('No autorizado')
                    }else{
                        rooms[room].users[socket.id] = nombre;
                        socket.join(room);
                        console.log(`se conecto ${rooms[room].users[socket.id]} a la sala ${room}`);
                        socket.to(room).broadcast.emit('user-connected', rooms[room].users[socket.id]);
                    }
                })
                //console.log(typeof rows[0].firstName)
                //rooms[room].users[socket.id] = String(rows[0].firstName);
                //socket.join(room);//se crea la sala para las notificaciones     || lo meto en la sala de chat
                //console.log(`se conecto ${rooms[room].users[socket.id]} a la sala ${room}`);
                //socket.to(room).broadcast.emit('user-connected', rooms[room].users[socket.id]);
            })
        })
    } catch (error) {
        console.log(error);
        socket.emit('error', error.message);
    }

    try {
        socket.on('send-chat-message', (room, message,id) => {//se recibe la sala y el mensaje          AQUI
            const pr = room.substr(1);
            connection.query(`${insertarMsg}(${id},${pr},'${message}')`)//lo guardamos en la base de datos
            socket.to(room).broadcast.emit('chat-message', message)//enviar mensaje recibido a la sala correspondiente
            console.log(`mensaje: ${message} enviado de ${rooms[room].users[socket.id]} a la sala ${room}`);
        })
    } catch (error) {
        console.log(error);
        socket.emit('error', error.message);
        return
    }

    try {
        socket.on('disconnect', () => {            // AQUI
            getUserRooms(socket).forEach(room => {
                socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
                delete rooms[room].users[socket.id]//sacamos al usuario de la sala de chat(projectId)
                //no elimino al usuario de la room2 
                console.log('Usuario salio');
            });
        })
    } catch (error) {
        console.log(error);
        socket.emit('error', error.message);
        return
    }

    try {
        // Listening for typing event
    socket.on('typing', (room)=>{//cada que meto una letra en el message                AQUI
        //console.log(`Server in ${room} received ${rooms[room].users[socket.id]} is typing`);//nombre del miembro
        // console.log('need to inform all the clients about this');
        socket.to(room).broadcast.emit('typing',rooms[room].users[socket.id]);
        //io.sockets.emit('typing', data);//nombre del miembro
        //socket.broadcast.emit('typing', data);//lo mismo
    });
    } catch (error) {
        console.log(error);
        socket.emit('error', error.message);
        return
    }


    //creo "rooms2" para separar la conexion entre mensajes y notificaciones
    try {//se recibe el name pero podria usar la id del usuario
        socket.on('send-notification',(room, notification, id)=>{//Envio de notificaiones           AQUI
            const pr = room.substr(1);
            connection.query(`SELECT name FROM project WHERE id = ${pr}`, (e,nombre)=>{
                if(e) throw e
                console.log(nombre)
                connection.query(`${insertNot}(${id},${pr},'${rooms[room].users[socket.id]} ${notification} en ${nombre[0].name}')`)
                socket.to(room).broadcast.emit('notification-received',{pr,notification:notification, name:rooms[room].users[socket.id], project:nombre[0].name});//aqui solo reenvio el mensaje del cliente
                console.log(`notificaion: ${notification} de ${rooms[room].users[socket.id]} to ${room}`)
                console.log(rooms[room])
            })
        })
    } catch (error) {
        console.log(error);
        socket.emit('error', error.message);
        return
    }

    try {
        socket.on("salir", (room)=>{
            console.log("Usuario salio del chat "+rooms[room].users[socket.id])
            socket.leave(room)
            socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
        })
    } catch (error) {
        console.log(error);
        socket.emit('error', error.message);
        return
    }
});

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
  }