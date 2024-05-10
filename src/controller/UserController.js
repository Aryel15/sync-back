const { 
    findUsers, 
    findUserById, 
    createUser, 
    updateUser, 
    loginUser, 
    deleteUser, 
    deleteImg,
    getAvatar
} = require('../services/UserService')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

function findAll(req, res){
    findUsers()
    .then((users) => {
        if(users.length !== 0){
            const usersRes = users.map((user) => {
                return {
                    _id: user._id, 
                    avatar: user.avatar, 
                    nome: user.nome, 
                    idade: user.idade, 
                    rua: user.rua, 
                    bairro: user.bairro, 
                    estado: user.estado, 
                    biografia: user.biografia,
                    email: user.email
                }})
            res.status(200).json(usersRes)
        }else{
            res.status(404).json({message: 'Usuários não encontrados'})
        }
    })
    .catch((error) => res.status(500).send(error))
}

function findById(req, res){
    const { id } = req.params
    findUserById(id)
    .then((user) => {
        if(!user){
            res.status(404).json({message: 'Usuário não encontrado'})
        }else{
            const userRes = {
                _id: user._id, 
                avatar: user.avatar, 
                nome: user.nome, 
                idade: user.idade, 
                rua: user.rua, 
                bairro: user.bairro, 
                estado: user.estado, 
                biografia: user.biografia,
                email: user.email
            }
            res.status(200).json(userRes)
        }
    })
    .catch((error) => {res.status(500).send(error)})
}

async function create(req, res){
    const { nome, idade, rua, bairro, estado, biografia, email, senha } =  req.body
    const file = req.file
    let avatar
    if(file){
        avatar = file.filename
    }else{
        avatar = "1715341086428.png"
    }

    const senhaHash = bcrypt.hashSync(senha, 8)
    
    createUser(avatar, nome, idade, rua, bairro, estado, biografia, email, senhaHash)
    .then((userCreated) => {
        if(userCreated){
            const token = jwt.sign({id: userCreated.senha, email: userCreated.email}, SECRET)

            res.cookie("token", token, { httpOlnly: true, secure: true }).status(200).json({message: 'Login realizado com sucesso!', id:userCreated._id})
        }else{
            res.status(400).json({message: 'Usuário não foi criado'})
        }
    })
    .catch((error) => res.status(500).send(error))
    
}

function update(req, res){
    const { nome, idade, rua, bairro, estado, biografia } =  req.body
    let avatar = req.body.avatar
    const file = req.file
    const { id } = req.params

    if(file){
        deleteImg(avatar)
        avatar = file.filename
    }
    updateUser(id, avatar, nome, idade, rua, bairro, estado, biografia)
    .then((userUpdated) => {
        if(userUpdated){
            res.status(201).json({message: 'Usuário atualizado com sucesso', data: userUpdated})
        }else{
            res.status(400).json({message: 'Usuário não foi criado'})
        }

    })
    .catch((error) => res.status(500).send(error))
    
}

async function login(req, res){
    try {
        
        const { email, senha } = req.body;
        
        const user = await loginUser(email);
        
        if(user){
            const validationPassword = bcrypt.compareSync(senha, user.senha);
            
            if(!validationPassword){
                res.status(401).json({message: 'Senha incorreta'});
            } else {
                const token = jwt.sign({id: user._id, email: user.email}, SECRET);
                
                res.cookie("token", token, { httpOlnly: true, secure: true }).status(200).json({message: 'Login realizado com sucesso!', id:user._id})
            }
        } else {
            res.status(401).json({message: 'Usuário não encontrado', data: user});
        }
    } catch(error) {
        console.error("Erro durante o login:", error);
        res.status(500).send("Ocorreu um erro durante o login");
    }
}


function logout(req, res){
    res.clearCookie("token").status(200).json({ message: "Você foi deslogado!" });
}

function deleteById(req, res){
    const { id } = req.params

    findUserById(id)
    .then((user) => {
        deleteImg(user.avatar)
        deleteUser(id)
        .then(() => {
            res.status(200).json({message: 'Usuário deletado com sucesso'})
        }).catch((error) => res.status(500).send(error))
    }).catch((error) => res.status(500).send(error))
}

function getImg(req, res){
    const { filename } = req.params

    getAvatar(filename)
    .then((readStream) => {
        if(!readStream){
            res.status(404).json({message: 'Arquivo não encontrado'})
        }else{
            readStream.pipe(res)
        }
    })
    .catch((error) => res.status(500).send(error))
}

async function auth(req, res){
    const token = req.cookies.token;
    if(!token){
        res.status(404).json(false)
    }else{
        try{
            jwt.verify(token, SECRET)
            res.status(200).json(true);

        } catch(error) {
            console.error(error)
            res.status(404).json(false);
        }
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    login,
    deleteById,
    logout,
    getImg,
    auth
}