const Task=require("../models/tasksModel");
const asyncHandler=require("../utils/asyncHandler");

const getAllTasks = asyncHandler(async(req, res, next)=> {
	const tasks = await Task.find({user_id: req.user._id});
	return res.status(200).json({
		status: 'success',
		data: tasks
	})
})

const getFinishedTasks = asyncHandler(async(req, res, next)=> {
	const tasks = await Task.find({finished_at: {$ne: null}});
	return res.status(200).json({
		status: 'success',
		data: tasks
	})
})

const getTasksInProgress = asyncHandler(async(req, res, next)=> {
	const tasks = await Task.find({started_at: {$ne: null}, finished_at: null});
	return res.status(200).json({
		status: 'success',
		data: tasks
	})
})

const getTasksCloseToDeadline = asyncHandler(async(req, res, next)=> {
	const {days} = req.params;
	const deadline = new Date().setTime(new Date().getTime() + (days * 24 * 60 * 60 * 1000));

	const tasks = await Task.find({deadline: {$lte: deadline}});
	return res.status(200).json({
		status: 'success',
		data: tasks
	})
})

module.exports = {
	getFinishedTasks,
	getTasksInProgress,
	getTasksCloseToDeadline,
	getAllTasks
}