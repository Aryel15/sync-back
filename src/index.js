const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser");
require("dotenv").config()
require('./config/db')
const UserRouter = require("./routes/UserRoutes")

const app = express()
const port = process.env.PORT || 3000;

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))

app.use("/api/v1/user", UserRouter);


app.listen(port, () => {
    console.log(`Está rodando na porta ${port}!`);
})