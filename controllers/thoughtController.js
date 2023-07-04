const { User, Thought } = require('../models');

module.exports = {
    // Get all courses
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Get a course
    async getSingleThought(req, res) {
        try {
            const thoughts = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');

            if (!thoughts) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Create a course
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate({ username: req.body.username }, { $push: { thoughts: thought._id } }, { new: true });
            if (!user) {
                return res.status(404).json({ message: "Thought created with no userId" });
            }
            res.json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // Delete a course
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that Id' });
            }
            const user = User.findOneAndUpdate({ username: thought.username }, { $pull: { thoughts: req.params.thoughtId } }, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'No user with that Id' })
            }
            res.json({ message: 'Thought and username deleted!' });
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //Create a reaction
    async createReaction(req, res) {
        console.log("You have added a reaction");
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.params.reactionId } },
                { runValidators: true, new: true }
            )
            if (!thought) {
                return res.status(404).json({ message: 'No reaction with that thoughtId' });
            }
            res.json(thought);
            console.log(thought);
        }
        catch (err) {
            res.status(500).json(err.message);
            console.log(err);
        }
    },
    //Delete a reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reaction: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true })
            if (!thought) {
                return res.status(404).json({ message: 'No thought found for that reactionId' });
            }
            res.json(thought);
        }
        catch (err) {
            res.status(404).json({ message: 'No reaction with that thoughtId' })
        }
    }
};

