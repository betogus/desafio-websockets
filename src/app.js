const express = require('express')
const { Server } = require('socket.io')
const app = express()
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => console.log('Server Up'))
app.use(express.static('./src/public')) 
const fs = require("fs");


//Configuracion para la base de datos
const productManager = require('./controllers/product.manager')
const chatManager = require('./controllers/chat.manager')
//HANDLEBARS
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine())
app.set('views', './src/public/views/handlebars')

app.set('view engine', 'handlebars')
const io = new Server(server)


app.get('/', (req, res) => {
    res.render('home') 
})

let history = []

let productos = []
io.on('connection', async socket => {
    console.log('Socket connected!')
    await chatManager.createTable()
    await productManager.createTable()
    socket.on('product',  async data => {
        await productManager.insertData(data)
        productos = await productManager.getAll()
        io.emit('products', productos)
    })
    socket.emit('products', productos) //Para que el que se conecte, le lleguen todos los productos
    //history = readHistoryOfMessages()
    history = await chatManager.getAll()
    socket.on('chat', async data => {

        // history.push(data)
        await chatManager.insertData(data)
        history = await chatManager.getAll()
        io.emit('history', history)
        //writeHistoryOfMessages(history)
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
        let data = 
        history = data.length > 0 ? JSON.parse(data) : [] ; 
    } catch(err) {
        console.log('Error en la lectura del archivo', err)
    }
    return history
}











