const mongoose = require('mongoose');
require('dotenv').config()

const dbConnection = process.env.DB_CONNECTION

async function main(){
    await mongoose.connect(dbConnection);

    console.log("Conectado com sucesso");

}
main().catch((err) => console.log(err))
module.exports = main;