const Quill = require('quill');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html')
  .QuillDeltaToHtmlConverter;
import { quillOptions } from './quill';
import DOM from './dom';
import { showAlert } from './alerts';
import { admDelTrack, admDelUser, admDelComment } from './admin';
import {
  signup,
  login,
  logout,
  deleteMe,
  forgotPass,
  resetPass
} from './authentication';
import { createTrack, deleteTrack, searchTrack } from './track';
import { updateSettings } from './updateSettings';
import {
  getAllComentsForTrack,
  createComment,
  editComment,
  deleteComment
} from './comments';

/* ********** Quill ********** */
// quick temporary fix for invalid quillEditorContainer
const quill = DOM.quillEditorContainer
  ? new Quill(DOM.quillEditorContainer, quillOptions.opt)
  : '';

let quillz = [];
const renderCmtQuills = async () => {
  if (DOM.quillEditorContainer) {
    const trackIdSpan = document
      .getElementById('trackIdSpan')
      .textContent.split(' ')[1];
    // const commentLength = document
    //   .querySelector('.cmt-length')
    //   .textContent.split('(')[1]
    //   .split(')')[0];

    const state = await getAllComentsForTrack(trackIdSpan);
    if (!state) return; // Temporary getAllComentsForTrack on retrieves for logged in users
    const commentsIds = state.data.data.comments;

    for (let i = 0; i < commentsIds.length; i++) {
      if (!commentsIds[i].deletedComment) {
        quillz[i] = new Quill(
          `#editor-cmt-container-${commentsIds[i]._id}`,
          quillOptions.optA
        );
        quillz[i].setContents(JSON.parse(commentsIds[i].comment));
      }
    }
  }
};
renderCmtQuills();

/* ********** Delegation ********** */
/**
 * Sign up
 */
if (DOM.signupForm)
  DOM.signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });

/**
 * Login || logout
 */
if (DOM.loginForm)
  DOM.loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (DOM.logOutBtn) DOM.logOutBtn.addEventListener('click', logout);

/**
 * Forgot Password
 */
const forgotPassForm = document.querySelector('.forgot--form');
if (forgotPassForm)
  forgotPassForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--sendemail-passtoken').textContent =
      'Sending Email...';

    const email = document.getElementById('email').value;
    await forgotPass(email);

    document.querySelector('.btn--sendemail-passtoken').textContent = 'Send';
  });

/**
 * Reset Password
 */
const resetPassForm = document.querySelector('.form--reset_pass');
if (resetPassForm)
  resetPassForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--resetpass').textContent = 'Updating...';

    const token = document.getElementById('token').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    await resetPass(token, password, passwordConfirm);

    document.querySelector('.btn--resetpass').textContent = 'Update';
  });

/**
 * Update settings || password
 */
if (DOM.userDataForm)
  DOM.userDataForm.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (DOM.userPasswordForm)
  DOM.userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn--save-password').textContent = 'Save password';
  });

/**
 * Create track
 */
if (DOM.hideUser)
  DOM.hideUser.addEventListener('click', e => {
    deleteMe();
  });

/**
 * Create track
 */
if (DOM.createTrackBtn) {
  let status = document.forms.statusForm.addEventListener('change', e => {
    if (e.target.name === 'status') {
      // console.log('Previous:', prev ? prev.value : null);
      // status = e.target;
      status = e.target.value;
      // console.log('Current:', e.target.value);
    }
  });

  DOM.createTrackBtn.addEventListener('click', e => {
    e.preventDefault();
    const title = document.getElementById('name').value;
    const priority = document.getElementById('add__priority').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value || 'None';
    createTrack({ title, priority, description, category, status });
  });
}

/**
 * Delete track
 */
if (DOM.btnDot)
  DOM.btnDot.addEventListener('click', () =>
    document.querySelector('.comment__items').classList.toggle('change')
  );

if (DOM.btnDel)
  DOM.btnDel.addEventListener('click', () => {
    const trackIdSpan = document
      .getElementById('trackIdSpan')
      .textContent.split(' ')[1];
    deleteTrack(trackIdSpan);
  });

/**
 * Search track
 */
if (DOM.searchForm)
  DOM.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput').value;
    searchTrack(searchInput);
  });

/**
 * filter track
 */
if (DOM.filterForm)
  DOM.filterForm.addEventListener('submit', () =>
    console.log('Need to finish implementing it properly...')
  );

/**
 * Create comment
 */
if (DOM.commentForm)
  DOM.commentForm.addEventListener('submit', e => {
    e.preventDefault();
    const content = JSON.stringify(quill.getContents());
    // const content = quill.root.innerHTML;
    const trackIdSpan = document
      .getElementById('trackIdSpan')
      .textContent.split(' ')[1];
    if (content.length > 25) createComment(content, trackIdSpan);
  });

/**
 * Edit & Delete comment
 */
const rcuCheck = (cmtUserId, curUserId) => {
  const check = cmtUserId === curUserId ? true : false;
  if (!check) showAlert('error', `You don't have permission for this!`);
  return check;
};

if (DOM.commentContainer)
  DOM.commentContainer.addEventListener('click', e => {
    e.preventDefault();
    const commentId = e.target.classList[1] || null;

    let ulComment = document.getElementById(`ul-${commentId}`);
    if (ulComment === null) return;
    ulComment.classList.forEach(el => {
      if (el === 'change') {
        ulComment.classList.remove('change');
      } else {
        ulComment.classList.add('change');
      }
    });

    const btnEditComment = document.getElementById(`bec-${commentId}`);
    const btnDelComment = document.getElementById(`bdc-${commentId}`);
    let formContent;

    if (btnEditComment) {
      btnEditComment.onclick = event => {
        const commentUserId = event.target.classList[2].split('-')[1];
        const currentUserId = event.target.classList[3].split('-')[1];
        const check = rcuCheck(commentUserId, currentUserId);
        const divBtnSend = document.getElementById(`det-btn-ctm-${commentId}`);
        if (check) divBtnSend.classList.toggle('hid-btn');

        // filterFindContainer filter the quill containers that aren't deleted
        // then find the one with the same commentId
        const filterFindContainer = quillz
          .filter(el => el.container.id !== undefined)
          .find(el => el.container.id.split('-')[3] === commentId);

        if (!divBtnSend.classList[1]) {
          formContent = filterFindContainer.getContents();
          filterFindContainer.enable();
        } else {
          if (check) filterFindContainer.setContents(formContent);
          filterFindContainer.enable(false);
        }

        const send = document.getElementById(`btn-send-${commentId}`);
        if (send) {
          send.onclick = () => {
            const content = JSON.stringify(filterFindContainer.getContents());
            editComment(content, commentId);
          };
        }
      };
    }

    if (btnDelComment) {
      btnDelComment.onclick = () => deleteComment(commentId);
    }
  });

/**********************************************************************/
/*************************** User section ***************************/
/********************************************************************/
/**
 * Hide track. My tracks route (/myTracks)
 */
if (DOM.myTracksContainer)
  DOM.myTracksContainer.addEventListener('click', e => {
    const trackId = e.target.id;
    if (!trackId) return;
    deleteTrack(trackId);
  });

if (DOM.myCommentsContainer)
  DOM.myCommentsContainer.addEventListener('click', e => {
    if (e.target.id) deleteComment(e.target.id);
  });

/**********************************************************************/
/*************************** Admin section ***************************/
/********************************************************************/
/**
 * Delete track
 */
if (DOM.manageTracksContainer)
  DOM.manageTracksContainer.addEventListener('click', e => {
    const trackId = e.target.id;
    if (!trackId) return;
    admDelTrack(trackId);
  });

/**
 * Delete comment
 */
if (DOM.admCmtWrapper)
  DOM.admCmtWrapper.addEventListener('click', e => {
    let commentId = e.target.id;
    if (!commentId) return;
    commentId = commentId.split('-')[2];
    admDelComment(commentId);
  });

/**
 * Delete user
 */
if (DOM.usersContainer)
  DOM.usersContainer.addEventListener('click', e => {
    if (e.target !== undefined || e.target !== null || e.target) {
      const userId =
        e.target.parentNode.parentNode.previousSibling.children[1].textContent;

      const userName = e.target.parentNode.parentNode.previousSibling.previousSibling.children[0].textContent.split(
        ' '
      )[0];

      for (let i = 0; i < e.target.classList.length; i++) {
        if (e.target.classList[i] === 'delete') admDelUser(userId, userName);
      }
    }
  });

const factor = typeCmt => {
  const content = [];
  typeCmt.forEach((el, i) => {
    content[i] = JSON.parse(el.innerHTML);
    const converter = new QuillDeltaToHtmlConverter(content[i].ops, {});
    const html = converter.convert();
    el.innerHTML = html;
  });
};

if (DOM.admCmtContent) factor(DOM.admCmtContent);
if (DOM.cmtContent) factor(DOM.cmtContent);
