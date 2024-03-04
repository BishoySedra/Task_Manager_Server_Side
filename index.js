const express = require("express");
const mongoose = require("mongoose");
const tasksRouter = require('./routes/tasksRouter')
const globalErrorHandler = require('./utils/globalErrorHandler')
const app = require('./app');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
    console.log(err.name , err.message);
    console.log('Unhandled Exception, shutting down');
    process.exit(1);
});


const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASS);

mongoose.connect(DB).then(con => {
    console.log('db connection succesfful');
})

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`CORS-enabled App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(err.name , err.message);
    console.log('Unhandled Rejection, shutting down');
    server.close(() => {
        process.exit(1);
    });
});


