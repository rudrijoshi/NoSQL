
const { User, Thought } = require('../models');

module.exports = {
    // Get all users

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get a single user by id
    async getSingleUser(req, res) {
        try {
            const users = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('thoughts')
                .populate('friends');
            if (!users) {
                return res.status(404).json({ message: "No user with that ID" });
            }
            res.json(users);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    //Post a new user
    async createUser(req, res) {
        try {
            const users = await User.create(req.body);
            if (!users) {
                return res.status(404).json({ message: "No user created" });
            }
            res.json(users);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    //Update a user
    async updateUser(req, res) {
        try {
            const users = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            )
            if (!users) {
                return res.status(404).json({ message: 'No user with this id' });
            }
            res.status(200).json(users);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
    //Delete a user
    async deleteUser(req, res) {
        try {
            const users = await User.findOneAndDelete({ _id: req.params.userId });
            const thought = await Thought.findOneAndDelete({ thoughts: users.thoughts });
            if (!users) {
                return res.status(404).json({ message: 'No user with this id' });
            }
            res.json({ message: 'User and associated thought deleted' });
        }
        catch (err) {
            res.status(500).json(err);
        }

    },
    //Create a friend
    async createFriend(req, res) {
        console.log('You have created a friend');
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { friends: req.params.friendId } },
                { runValidators: true, new: true })
            if (!user) {
                return res.status(404).json({ message: 'No user found for that userId' });
            }
            res.json(user);
        }
        catch (err) {
            res.status(500).json(err.message);
        }
    },
    //Delete a friend
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true });
            if (!user) {
                return res.status(404).json({ message: 'No user foubd with that userId' });
            }
            res.json(user);
        }
        catch (err) {
            res.status(500).json(err.message);
        }
    }

}

