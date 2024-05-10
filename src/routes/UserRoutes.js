const express = require('express')
const UserRouter = express.Router()
const { findAll, findById, create, update, login, deleteById, logout, getImg, auth } = require('../controller/UserController')
const validationToken = require("../middleware/ValidationToken")
const upload = require('../config/multer')

UserRouter.get("/", findAll)
UserRouter.get("/:id", findById)
UserRouter.post("/", upload.single('file'), create)
UserRouter.post("/login", login)
UserRouter.get("/auth", auth)
UserRouter.get("/image/:filename", getImg)
UserRouter.put("/:id", validationToken, upload.single('file'), update)
UserRouter.post("/logout", validationToken, logout)
UserRouter.delete("/:id", validationToken, deleteById)

module.exports = UserRouter