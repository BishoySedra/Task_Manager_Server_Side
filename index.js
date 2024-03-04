const express = require("express");
const mongoose = require("mongoose");
const tasksRouter = require('./routes/tasksRouter')
const globalErrorHandler = require('./utils/globalErrorHandler')

const app = express();
app.use(express.json());

app.use('/tasks', tasksRouter)

/*app.all('*', (req, res, next) => {
    res.status(404).json({ status: "error", data: { msg: "URL not found" } })
})*/

app.use(globalErrorHandler)

mongoose.connect('mongodb://localhost:27017/task-manager')
	.then(()=> console.log('Connected!'));

app.listen(4000, () =>{
	console.log('Listening on port 4000')
})
