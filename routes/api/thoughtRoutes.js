const router = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    createThought,
    deleteThought,
    updateThought,
    createReaction,
    deleteReaction
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:thoughtId').get(getSingleThought).delete(deleteThought).put(updateThought);

// router.route('/:thoughtId/reactions/');

router.route('/:thoughtId/reactions/:reactionId').post(createReaction).delete(deleteReaction);

module.exports = router;