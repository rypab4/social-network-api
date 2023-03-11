//get models
const { User, Thought } = require('../models');

const userController = {
    //get all users
    getUsers(req, res) {
        User.find()
            .select('-__v')
            .then((dbUserData) => {
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //GET a single user by its _id and populated thought and friend data
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('friends')
            .populate('thoughts')
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'User does not exist.' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //POST (Create) new user
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => {
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //PUT (update) a user by id
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            {
                $set: req.body,
            },
            {
                runValidators: true,
                new: true,
            }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'User with this ID does not exist.' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //BONUS: Delete to remove user by its id
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'No user id' });
                }

                // get user id and delete their associate thoughts
                return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
            })
            .then(() => {
                res.json({ message: 'User and associated thoughts deleted' });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // add friend
    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message:  'ID does not exist.' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    //Remove a friend
    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: 'ID does not exist.' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
};


module.exports = userController;


