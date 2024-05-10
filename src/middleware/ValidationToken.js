const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET

const validationToken = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        res.status(401).json({message: 'Requisição não autorizada - Token não informado'})
    }else{
        try{
            
            jwt.verify(token, SECRET)
            next()

        } catch(error) {
            console.error(error)
            res.status(500).json({
                message: `Token inválido`,
                error: error.message,
            });
        }
    }
}

module.exports = validationToken;