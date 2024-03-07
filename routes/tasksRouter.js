const Task = require('../models/tasksModel');
const express = require('express');
const tasksController = require('../controllers/commonController');
const { getTasksInProgress, getFinishedTasks, getTasksCloseToDeadline, getAllTasks }=require('../controllers/tasksController');
const {protect}=require('../controllers/authController');

const router = express.Router();


router.get('/',protect,getAllTasks);
router.get('/in-progress', protect, getTasksInProgress);
router.get('/finished', protect, getFinishedTasks);
router.get('/deadline/:days', protect, getTasksCloseToDeadline);
router.get('/:id', protect, tasksController.getOne(Task));
router.post('/', protect, tasksController.createOne(Task));
router.patch('/:id', protect, tasksController.updateOne(Task));
router.delete('/:id', protect, tasksController.deleteOne(Task));

module.exports = router