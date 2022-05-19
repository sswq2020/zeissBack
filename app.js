const express = require('express');
const cors = require('cors');
const { default: axios } = require('axios');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
      }
});

io.on("connection", (socket) => {
    console.log("websocket链接成功啦")
    socket.on('init',()=>{
        const obj= {
            id:'00eee2c7-ef69-4df9-94f9-c504ba2ce8a4',
            time:new Date(),
            status:["running","finished","errored","repaired","idle"][Math.floor(Math.random()*(6))]
          }
     console.log('准备推送到机器信息',obj);
     io.emit('push',obj);
   }) 
 });



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");


app.use(function (req, res, next) {
    res.hasHeader('Content-Type', 'application/json');
    next()
})

app.get("/", (req, res) => {
    const responseBody = {
        env: process.env['APP_ENV'] || 'local',
        home: 'hello, Zeiss'
    }
    res.status(200).json(responseBody);
})


app.get('/api/v1/machines', (req, res) => {
    axios.get('http://codingcase.zeiss.services/api/v1/machines').then( result => {
        console.log(result.data)
        res.status(200).send(result.data)
    }
    ).catch(e =>{
        console.info(e)
    })

})

app.get('/api/v1/machines/:id', (req, res) => {
    axios.get(`http://codingcase.zeiss.services/api/v1/machines/${req.params.id}`).then( result => {
        console.log(result.data)
        res.status(200).send(result.data)
    }
    ).catch(e =>{
        const responseBody = {
            msg: 'Sorry,Please Try again'
        }
        res.status(500).send(responseBody)
    })

})


const port = 3300;

httpServer.listen(port, () => {
    console.log(`ZeissBack server at http://localhost:${port}`)
})