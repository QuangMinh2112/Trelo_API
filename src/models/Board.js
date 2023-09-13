const mongoose = require('mongoose')

const Board = new mongoose.Schema(
  {
    boardId: String,
    title: {
      type: String,
      required: true
    },
    columnId: String,
    description: String,
    images: String,
    memberIds: [],
    ownerIds: [],
    columnOrderIds: []
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

//Export the model
module.exports = mongoose.model('Board', Board)
