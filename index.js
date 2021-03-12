var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var userList = [];
var typingUsers = {};
var roomList = [];


io.on('connection', function(clientSocket){
  console.log('a user connected');
  clientSocket.on('disconnect', function(){
    console.log('user disconnected');
    var clientNickname;
    for (var i=0; i<userList.length; i++) {
      if (userList[i]["f3"] == clientSocket.id) {
        userList[i]["f2"] = false;
        clientNickname = userList[i]["f1"];      
      }
    } 
    delete typingUsers[clientNickname];
    io.emit("userList", {key:userList});
    userListExcept = userList.slice();
        for (var i=0; i<userListExcept.length; i++) {
          if (userListExcept[i]["f3"] == clientSocket.id) {
            userListExcept.splice(i, 1);
            io.emit("userList", {key:userListExcept});          
          }
        }
        i
    io.emit("userExitUpdate", {key:clientNickname});
    io.emit("userTypingUpdate", typingUsers);
  });

  clientSocket.on("exitUser", function(clientNickname){
    for (var i=0; i<userList.length; i++) {
      if (userList[i]["f3"] == clientSocket.id) {
        userList.splice(i, 1);
        break;
      }
    }
    io.emit("userExitUpdate", {key:clientNickname});
  });


  clientSocket.on('chatMessage', function(clientNickname, message){
    var currentDateTime = new Date().toLocaleString();
    delete typingUsers[clientNickname];
    io.emit("userTypingUpdate", typingUsers);
    io.emit('newChatMessage', clientNickname, message, currentDateTime);
  });
  clientSocket.on('connectUser', function(clientNickname) {
      var message = `User ${clientNickname} was connected`;
      console.log(message);    
      var userInfo = {};
            var foundUser = false;
            for (var i=0; i<userList.length; i++) {
             if (userList[i]["f1"] == value) {
              userList[i]["f2"] = true
              userList[i]["f3"] = clientSocket.id;
              userInfo = userList[i];
              foundUser = true;
              break;
          }
        }  
        if (!foundUser) {       
          userInfo["f1"] = value;
          userInfo["f2"] = true;
          userInfo["f3"] = clientSocket.id;
          userList.push(userInfo);
        }
       
        io.emit("userList", {key:userList});      
        io.emit("userExitUpdate", {key:clientNickname});
        io.emit("userConnectUpdate",{key:userInfo} );
  });

  clientSocket.on('room',data=>{
        if(room.length!=0){
            const temp = data.room.split('!@!@2@!@!').reverse().join('!@!@2@!@!');
            if(room.includes(temp)){
                socket.join(temp)
                console.log('joined room',temp)
                socket.emit('joined',{room:temp})
                console.log(room);
            } else if(room.includes(data.room)){
                socket.join(data.room)
                console.log('joined room', data.room)
                socket.emit('joined', { room: data.room})
                console.log(room);

            }
        }else{
            socket.join(data.room);
            room.push(data.room)
            console.log('joined room',data.room);
            socket.emit('joined', { room: data.room })
            console.log(room);
        }

    })


  clientSocket.on("startType", function(clientNickname){
    console.log("User " + clientNickname + " is writing a message...");
    typingUsers[clientNickname] = 1;
    io.emit("userTypingUpdate", typingUsers);
  });


  clientSocket.on("stopType", function(clientNickname){
    console.log("User " + clientNickname + " has stopped writing a message...");
    delete typingUsers[clientNickname];
    io.emit("userTypingUpdate", typingUsers);
  });

});

app.get('/', function(req, res){
  res.send('<h1>Socket.io</h1>');
});


http.listen(3000, function(){
  console.log('Listening on *:3000');
});


