const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = express();
const serverDir = path.resolve(__dirname, 'src');

require('dotenv').config()

// Porta
let port = process.env.NODE_ENV === 'development' 
            ? process.env.PORT || '8000'
            : process.env.PORT || '3000';

// import todas as models db
fs.readdirSync(serverDir).forEach((diretorios) => {
    let modelsDir = path.resolve(serverDir, diretorios, 'model.js');
    require(modelsDir)(mongoose, mongoose.Schema.Types)
})

// Conexão com DB
const uri = process.env.MONGO_URI;
mongoose.promiseLibrary = global.Promise;
if (process.env.NODE_ENV === 'development') {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(uri, { useNewUrlParser: true }).then(() => {
        console.log('Mongodb is running in localhost')
    });
} else {
    mongoose.connect(uri, { useNewUrlParser: true }).then(() => {
        console.log('Mongodb is running')
    }, err => {
        console.log(`Error connection mongodb: ${err}`)
    });
}

// Config. do express
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import das routes
fs.readdirSync(serverDir).forEach((diretorios) => {
    let controllersDir = path.resolve(serverDir, diretorios, 'controller.js');
    let route = require(controllersDir)
    app.use(`/api/${diretorios}`, route)
})

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});