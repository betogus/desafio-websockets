const express = require('express')
const { Server } = require('socket.io')
const app = express()
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => console.log('Server Up'))
app.use(express.static('./src/public')) 
const fs = require("fs");

//HANDLEBARS
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine())
app.set('views', './src/public/views/handlebars')

app.set('view engine', 'handlebars')
const io = new Server(server)


app.get('/', (req, res) => {
    res.render('home') 
})

let productos = []
let history = []




io.on('connection', socket => {
    console.log('Socket connected!')
    socket.on('product', data => {
        productos.push(data)
        io.emit('products', productos)
    })
    socket.emit('products', productos) //Para que el que se conecte, le lleguen todos los productos
    history = readHistoryOfMessages()
    socket.on('chat', data => {
        console.log(history)
        history.push(data)
        io.emit('history', history)
        writeHistoryOfMessages(history)
    })
    socket.emit('history', history) //Para que el que se conecte, le lleguen todos los chats
})

/* Agregamos el historial de chat a un archivo messages.txt */

const writeHistoryOfMessages = (messages) => {
    console.log(messages)
    messages = JSON.stringify((messages),null,2)
    try {
        fs.writeFileSync("messages.txt", messages)
        console.log({message: "se añadio con exito", messages})
    } catch(err){
        console.log('Error en la escritura',err)
    }
}

const readHistoryOfMessages = () => {
    try {
        let data = fs.readFileSync("messages.txt", 'utf8');
        history = data.length > 0 ? JSON.parse(data) : [] ; 
    } catch(err) {
        console.log('Error en la lectura del archivo', err)
    }
    return history
}











