const options = require('../../options/sqlite3.config.js');
const knex = require('knex');
const database = knex(options);

class ChatManager {
    createTable = async () => {
         await database.schema.createTable('chat', table => {
            table.increments('id');
            table.string('email', 20);
            table.string('message', 100);
            table.string('date', 30);
        })
        .then(()=> console.log('Table created!'))
        .catch(err=> console.log('ya existe la tabla chat'))
    }
     insertData = async (chat) => {
         await database('chat').insert(chat)
        .then(() => console.log('chat inserted'))
        .catch(err => console.log(err))
    }
    getAll = async () => {
       let history = await database.from('chat').select('*')
       return history
    }
    
}

const chatManager = new ChatManager
module.exports = chatManager
