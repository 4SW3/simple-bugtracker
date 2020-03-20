const axios = require('axios');
import { showAlert } from './alerts';

export const admDelTrack = async idParam => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/tracks/adm/${idParam}`,
      data: null
    });

    if (res.status === 204) {
      showAlert('success', 'Track deleted successfully');
      if (location.pathname === '/manageTracks')
        window.setTimeout(() => {
          location.reload();
        }, 1000);
      else
        window.setTimeout(() => {
          location.assign('/');
        }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const admDelComment = async commentId => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/comments/adm/${commentId}`,
      data: null
    });

    if (res.status === 204) {
      showAlert('success', 'Comment deleted successfully');

      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const admDelUser = async (userId, userName) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`
    });

    if (res.status === 204) {
      await axios({
        method: 'DELETE',
        url: '/api/v1/tracks/admdeltrk'
      });
      await axios({
        method: 'DELETE',
        url: '/api/v1/comments/admdelcmt'
      });

      showAlert(
        'success',
        `User deleted! All ${userName}'s tracks and comments deleted successfully!`
      );
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
