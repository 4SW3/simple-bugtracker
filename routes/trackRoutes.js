const express = require('express');
const trackController = require('../controllers/trackController');
const authController = require('../controllers/authController');
const commentRouter = require('./commentRoutes');

const router = express.Router();

router.use('/:trackId/comments', commentRouter);

router.use(authController.protect);

router
  .route('/adm/:id')
  .delete(
    authController.restrictTo('owner', 'admin'),
    trackController.deleteTrack
  );

router
  .route('/admdeltrk')
  .delete(
    authController.restrictTo('owner', 'admin'),
    trackController.deleteAllTrksForUser
  );

router
  .route('/byname')
  .get(trackController.aliasByName, trackController.getAllTracks);

router.route('/search').get(trackController.searchTracks);

// router.route('/track-stats').get(trackController.getTrackStats);

router
  .route('/')
  .get(trackController.getAllTracks)
  .post(trackController.setUserId, trackController.createTrack);

router
  .route('/:id')
  .get(trackController.getTrack2, trackController.filterDelCmts)
  .patch(trackController.updateTrack)
  .delete(trackController.restrictTrackUser, trackController.hideOne);

module.exports = router;
