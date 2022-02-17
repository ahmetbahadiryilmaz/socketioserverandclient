# chat-example

This is the source code for a very simple chat example used for
the [Getting Started](http://socket.io/get-started/chat/) guide
of the Socket.IO website.

Please refer to it to learn how to run this application.


#Server
create ssl pfx cert exported from iis  and put pem/1.pfx and set password from index.js
npm install
node index.js


#Client
edit client/examp_files/main.js 

var socket = io("https://demo.ekullanici.com:3000/");
edit this line for server ip

run client/index.html