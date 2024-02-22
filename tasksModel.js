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
        enum: {
            values: ['low', 'medium', 'high'],
            message: 'priorities are: low, medium, high'
        } 
    },
    category: [{ type: String}],
    points: {
        enum: {
            values: [3, 5, 8, 11, 13, 18, 21],
            message: 'Fibonacci values only: 3, 5, 8, 11, 13, 18, 21'
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
    user_id: [{
        uid: mongoose.Schema.ObjectId, 
        ref:'User'
    }]
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;