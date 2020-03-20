/* ********** DOM Elements ********** */
const DOM = {
  userDataForm: document.querySelector('.form-user-data'),
  userPasswordForm: document.querySelector('.form-user-password'),
  commentForm: document.querySelector('.form-comment'),
  createTrackBtn: document.querySelector('.btn__create-track'),
  btnDot: document.querySelector('.btn--dot'),
  btnDel: document.querySelector('.btn__del'),
  searchForm: document.querySelector('.nav__search'),
  signupForm: document.querySelector('.form--signup'),
  loginForm: document.querySelector('.form--login'),
  logOutBtn: document.querySelector('.nav__el--logout'),
  filterForm: document.querySelector('.filter__form'), // No axios request done!
  commentContainer: document.querySelector('.comment__container'),
  admCmtWrapper: document.querySelector('.adm-cmt-wrapper'),
  myTracksContainer: document.querySelector('.mycards-flex'),
  manageTracksContainer: document.querySelector('.mycards-flex-adm'),
  myCommentsContainer: document.querySelector('.my-cmts-container'),
  usersContainer: document.querySelector('.users'),
  hideUser: document.querySelector('.hide-user'),
  admCmtContent: document.querySelectorAll('[id^=adm-cmt-content]'),
  cmtContent: document.querySelectorAll('[id^=cmt-content]'),
  quillEditorContainer: document.getElementById('editor-container')
};

export default DOM;
