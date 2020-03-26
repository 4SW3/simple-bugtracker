const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsController.getLoginForm);
router.get('/signUp', viewsController.getSignUpForm);
router.get('/forgotPass', viewsController.getForgotPassForm);
router.get('/resetPass', viewsController.getResetPassForm);

router.get('/overview', authController.protect, viewsController.getOverview);
router.get('/track/:slug', authController.protect, viewsController.getTrack);
router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/createTrack',
  authController.protect,
  viewsController.getCreateTrackForm
);
router.get('/myTracks', authController.protect, viewsController.getMyTracks);
router.get(
  '/myComments',
  authController.protect,
  viewsController.getMyComments
);
router.get('/search', authController.protect, viewsController.searchTracks);

router.get(
  '/manageTracks',
  authController.protect,
  authController.restrictTo('owner', 'admin'),
  viewsController.manageTracks
);
router.get(
  '/manageComments',
  authController.protect,
  authController.restrictTo('owner', 'admin'),
  viewsController.manageComments
);
router.get(
  '/manageUsers',
  authController.protect,
  authController.restrictTo('owner', 'admin'),
  viewsController.manageUsers
);

module.exports = router;
