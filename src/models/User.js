const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    nome: { type: mongoose.Schema.Types.String, required: [true, "O nome é obrigatório para cadastrar um usuário"] },
    email: { type: mongoose.Schema.Types.String, required: [true, "O email é obrigatório para cadastrar um usuário"] },
    rua: { type: mongoose.Schema.Types.String, required: [true, "A rua é obrigatória para cadastrar um usuário"] },
    bairro: { type: mongoose.Schema.Types.String, required: [true, "O bairro é obrigatório para cadastrar um usuário"] },
    estado: { type: mongoose.Schema.Types.String, required: [true, "O estado é obrigatório para cadastrar um usuário"] },
    biografia: { type: mongoose.Schema.Types.String, required: [true, "A biografia é obrigatória para cadastrar um usuário"] },
    avatar: { type: mongoose.Schema.Types.String, required: [true, "O avatar é obrigatório para cadastrar um usuário"] },
    idade: { type: mongoose.Schema.Types.Number, required: [true, "A idade é obrigatória para cadastrar um usuário"] },
    senha: {
        type: mongoose.Schema.Types.String,
        validate: {
            validator: value => { 
                return value.toString().length >= 16 
            },
            message: "Sua senha precisa ter pelo menos 16 caracteres!"
        },
    },
    
}, { versionKey: false });

const User = mongoose.model("users", usuarioSchema);

module.exports = User
