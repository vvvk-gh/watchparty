const http = require('http')
const express = require('express')
const app = express() 
const socketio = require('socket.io');
const port = process.env.PORT || 8888;
//creating an http server as socket.io works on top of http
//so converting express into http sever
const server = http.createServer(app)
const io = socketio(server);

let Users ={};
let socketMap = {};
io.on('connection', (socket)=>{
    console.log(`Connected to the socket : ${socket.id}`)


    function login(s ,u,d){
        s.join(u)
        s.emit('logged_in' , d)
        //creating an object containing socket.id:user for each login  
        socketMap[s.id] = u
        console.log(socketMap)
    }

    socket.on('login', (data)=>{
        
        if(((data.username).length == 0|| (data.password).length == 0 )){
            socket.emit('unfilled')
        }
        
        else if(Users[data.username]){
            if((data.password).indexOf(Users[data.username]) !== -1){
                //socket.join(data.username);
                //socket.emit('logged_in' , data)
                login(socket , data.username ,data)
            }
            else{
                socket.emit('login_failed')
            }  
            
        }
        else{
            Users[data.username] = data.password
            //socket.join(data.username) 
            //socket.emit('logged_in' , data)
            login(socket , data.username , data)
        }
    
    })

    socket.on('msg_send', (data)=>{
        data.from = socketMap[socket.id]
        if(data.to){
            io.to(data.to).emit('msg_rcvd' ,data)
        }else{
            socket.broadcast.emit('msg_rcvd' ,data)
        }

    })

    socket.on('togglePlay' , ()=>{
        io.emit('toggletoall');
    })

})

app.use('/' , express.static(__dirname + '/public'))

server.listen(port ,()=>{
    console.log(`Listening at http://localhost:${port}`);
})