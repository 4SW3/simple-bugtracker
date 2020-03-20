const axios = require('axios');
import { showAlert } from './alerts';

export const createTrack = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/tracks',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Track created successfully');

      window.setTimeout(() => {
        location.assign('/overview');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteTrack = async idParam => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/tracks/${idParam}`,
      data: null
    });

    if (res.status === 204) {
      showAlert('success', 'Track deleted successfully');
      if (
        location.pathname === '/manageTracks' ||
        location.pathname === '/myTracks'
      )
        window.setTimeout(() => {
          location.reload();
        }, 1000);
      else
        window.setTimeout(() => {
          location.assign('/overview');
        }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const searchTrack = async searchTerm => {
  try {
    const url = `http://127.0.0.1:3000/api/v1/tracks/search?searchTerm=${searchTerm}`;
    const res = await axios({
      method: 'GET',
      url
    });

    if (res.status === 200) {
      const docs = res.data.data.data.length;
      showAlert('success', `We found ${docs} document(s)`);

      window.setTimeout(() => {
        location.assign(`/search?searchTerm=${searchTerm}`);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err);
  }
};
