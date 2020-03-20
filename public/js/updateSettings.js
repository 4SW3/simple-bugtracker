const axios = require('axios');
import { showAlert } from './alerts';

// It could be either password or data
export const updateSettings = async (data, type) => {
  const url =
    type === 'password'
      ? '/api/v1/users/updateMyPassword'
      : '/api/v1/users/updateMe';

  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success')
      showAlert('success', `User ${type} updated successfully`);

    window.setTimeout(() => {
      location.assign('/me');
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
