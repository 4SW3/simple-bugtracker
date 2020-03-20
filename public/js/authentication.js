const axios = require('axios');
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created with success!');
    }
    window.setTimeout(() => {
      location.assign('/overview');
    }, 1000);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
    }
    window.setTimeout(() => {
      location.assign('/overview');
    }, 1000);
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.response);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });

    if (res.data.status === 'success')
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const deleteMe = async () => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: 'http://127.0.0.1:3000/api/v1/users/deleteMe'
    });

    console.log(res);
    if (res.status === 204) {
      showAlert('success', 'User deleted successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err);
  }
};
