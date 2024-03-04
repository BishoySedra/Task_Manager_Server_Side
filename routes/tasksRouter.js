const Task = require('../models/tasksModel');
const express = require('express');
const tasksController = require('../controllers/commonController')

const router = express.Router();

router.get('/', tasksController.getMany(Task));
router.get('/:id', tasksController.getOne(Task));
router.post('/', tasksController.createOne(Task));
router.patch('/:id', tasksController.updateOne(Task));
router.delete('/:id', tasksController.deleteOne(Task));

module.exports = router