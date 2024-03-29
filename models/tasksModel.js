const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Task name must be provided'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: 'priorities are: low, medium, high'
        }
    },
    category: {
        type: String,
    },
    points: {
        type: Number,
        enum: {
            values: [1, 2, 3, 5, 8, 11, 13, 18, 21],
            message: 'Fibonacci values only: 1, 2, 3, 5, 8, 11, 13, 18, 21'
        }
    },
    deadline: {
        type: Date
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    started_at: {
        type: Date,
    },
    finished_at: {
        type: Date,
    },
    modified_at: {
        type: Date,
    },
    estimated_time: {
        type: Number
    },
    subtasks: [{
        type: String,
    }],
    user_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;