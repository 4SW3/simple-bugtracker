const express = require('express');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/admdelcmt')
  .delete(
    authController.restrictTo('owner', 'admin'),
    commentController.deleteAllCmtsForUser
  );

router
  .route('/adm/:id')
  .delete(
    authController.restrictTo('owner', 'admin'),
    commentController.deleteComment
  );

router
  .route('/')
  .get(commentController.setUserTrackId, commentController.getAllCmtsForTrack)
  .post(commentController.setUserTrackId, commentController.createComment);

router
  .route('/:id')
  // .get(commentController.getComment)
  .get(commentController.restrictCmtUser, commentController.check)
  .patch(commentController.restrictCmtUser, commentController.updateComment)
  .delete(commentController.restrictCmtUser, commentController.hideOne);

module.exports = router;
