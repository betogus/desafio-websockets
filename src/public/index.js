
const socket = io()

/* CONFIGURACION DEL FORMULARIO PARA CARGAR PRODUCTOS */

let product = []
let productForm = document.getElementById('form')
const onHandleSubmit = (e, form) => {
    e.preventDefault()
    let formData = new FormData(form)
     let obj = {}
    formData.forEach((value, key) => obj[key]= value)
    if (obj.nombre && obj.precio && obj.foto) {
        console.log(obj)
        socket.emit('product', obj)
        document.getElementById('emptyFields').innerHTML = ``
    }
    else {
    document.getElementById('emptyFields').innerHTML = `<p>Hay campos sin completar</p>`
    }
}
 
productForm.addEventListener('submit', (e) => {
    onHandleSubmit(e, e.target)
})


const tablaDeProductos = (productos) => {
    let contenido=""
    let contenidoSup="";
    let contenidoInf="";
    if ( productos.length>0) {
        contenidoSup=
        `
        <table class="table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>
            </thead>
        `
        productos.forEach((producto) => {
            contenidoInf +=
          `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td><img src=${producto.foto} class="foto"></td>
                </tr>
          `
      })
      contenido = contenidoSup.concat(contenidoInf)
    } else {
       contenido = `<p>No se encontraron productos</p>`
    }
    
    return contenido
} 

socket.on('products', data => {
    let tabla = tablaDeProductos(data)
    document.getElementById('table').innerHTML = tabla

})


/* CONFIGURACION DEL CHAT Y DEL EMAIL*/

let chatBox = document.getElementById('chatBox')
let inputEmail = document.getElementById('email')

const onHandleSubmitChat = (e) => {
    e.preventDefault()
    let message = e.target[0].value
    let email = inputEmail.value
    if (message && email) {
        let date = new Date().toLocaleString()
        let chat = {email, message, date} 
        console.log(chat)
        socket.emit('chat', chat)
        document.getElementById('emptyChatFields').innerHTML = ``
    }
    else {
    document.getElementById('emptyChatFields').innerHTML = `<p>Hay campos sin completar</p>`
    }
   
}
chatBox.addEventListener('submit', (e) => onHandleSubmitChat(e))

//MOSTRAR EL CHAT

let history = document.getElementById('history')
socket.on('history', data => {
    let messages = ''

    data.forEach(text => {
        messages += `<p> <span class="user">${text.email}</span> <span class="date">[${text.date}]</span><span class="message">: ${text.message}</span> `
    })
    history.innerHTML = messages
    socket.emit('messagesString', messages)
})