const { Schema, model } = require('mongoose');
const { format_date } = require('../utils/helper');
const reactionSchema = require('./reaction');
// Schema to create Student model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: ts => format_date(ts),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
})
const Thought = model('thought', thoughtSchema);

module.exports = Thought;