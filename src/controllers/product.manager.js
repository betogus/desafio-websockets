const options = require('../../options/mysql.config');
const knex = require('knex');
const database = knex(options);


class ProductManager {
    createTable = async () => {
         await database.schema.createTable('products', table => {
            table.increments('id');
            table.string('nombre', 20);
            table.integer('precio')
            table.string('foto');
        })
        .then(()=> console.log('Table created!'))
        .catch(err=> console.log(err))
    }
     insertData = async (product) => {
         await database('products').insert(product)
        .then(() => console.log('product inserted'))
        .catch(err => console.log(err))
    }
    getAll = async () => {
        await database.from('products').select('*')
        .then(response => {
            return (JSON.parse(JSON.stringify(response)))
        })
        .catch(err=> console.log(err))

    }

}

const productManager = new ProductManager
module.exports = productManager
