require("dotenv").config()
const multer = require('multer')
const { extname } = require('path')
const { GridFsStorage } = require('multer-gridfs-storage')

const storage =  new GridFsStorage({
    url: process.env.DB_CONNECTION,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = Date.now() + extname(file.originalname);
            return filename;
        }

        return {
            bucketName: file.fieldname,
            filename: Date.now() + extname(file.originalname),
        };
    },
});

const upload = multer({ storage });

module.exports = upload