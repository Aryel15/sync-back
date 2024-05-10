const User = require('../models/User')
const { GridFSBucket } =  require("mongodb");
const mongoose = require("mongoose");
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = new GridFSBucket(conn.db, {
        bucketName: 'avatars',
    });
});

async function findUsers(){
    try {
        const users = await User.find()      
        return users;
    } catch (error) {
        throw new Error(error.message);
    }

}

async function findUserById(id){
    try{
        const user = await User.findById(id)
        return user
    }catch (error) {
        throw new Error(error.message);
    }
}

async function createUser(avatar, nome, idade, rua, bairro, estado, biografia, email, senha){
    try{
        const user = await User.create({
            avatar: avatar, 
            nome: nome, 
            idade: idade, 
            rua: rua, 
            bairro: bairro, 
            estado: estado,
            biografia: biografia,
            email: email,
            senha: senha
        })
        return user
    }catch (error) {
        throw new Error(error.message);
    }
}

async function updateUser(id, avatar, nome, idade, rua, bairro, estado, biografia){
    try{
        const user = await User.findById(id)
        if(user){
            return await user.updateOne({avatar, nome, idade, rua, bairro, estado, biografia})
        }
        return null
    
    }catch (error) {
        throw new Error(error.message);
    }
}

async function loginUser(email){
    try{
        const user = await User.findOne({email})
        return user
    }catch (error) {
        throw new Error(error.message);
    }
}

async function deleteUser(id){
    try{
        await User
    }catch (error) {
        throw new Error(error.message);
    }
}

async function deleteImg(img){
    try{
        const oldFile = await gfs.find({filename: img}).toArray();

        if(oldFile && oldFile.length !== 0) {
            gfs.delete(oldFile[0]._id)
        }
    }catch (error) {
        throw new Error(error.message);
    }

}

async function getAvatar(filename){
    try{
        const file = await gfs.find({filename}).toArray();

        if(!file || file.length === 0) {
            return null
        }

        const readStream = gfs.openDownloadStreamByName(filename)
        return readStream
    }catch (error) {
        throw new Error(error.message);
    }

}

module.exports = {
    findUsers,
    findUserById,
    createUser,
    updateUser,
    loginUser,
    deleteUser,
    deleteImg,
    getAvatar
}

