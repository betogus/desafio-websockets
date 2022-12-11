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
            .catch(err=> console.log('Ya existe la tabla products'))
        }
       
     insertData = async (product) => {
         await database('products').insert(product)
        .then(() => console.log('product inserted'))
        .catch(err => console.log(err))
    }
    getAll = async () => {
        let data = await database.from('products').select('*')
        return (JSON.parse(JSON.stringify(data)))
    }
    
}

const productManager = new ProductManager
module.exports = productManager
