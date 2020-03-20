const axios = require('axios');
import { showAlert } from './alerts';

export const getAllComentsForTrack = async trackId => {
  try {
    const res = await axios.get(`/api/v1/tracks/${trackId}/comments`);

    return res;
  } catch (err) {
    //showAlert('error', err); // Error: Request failed with status code 401
    showAlert('error', 'Error: You must be logged in to see all the comments'); // Temporary
  }
};

//{{URL}}api/v1/tracks/5e3c9255340e2713208e89b1/comments
export const createComment = async (comment, trackId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tracks/${trackId}/comments`,
      data: {
        comment
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Comment created with success!');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const editComment = async (comment, commentId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/comments/${commentId}`,
      data: {
        comment
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Comment edited with success!');
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteComment = async commentId => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/comments/${commentId}`,
      data: null
    });

    if (res.status === 204) {
      showAlert('success', `Comment deleted successfully`);
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
