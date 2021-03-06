import API from '../api/Base/index';
import Cookies from 'js-cookie';

const getUser = () => {
  return API.get('/user');
};

const authenticated = () => {
  return Cookies.get('access_token') ? true : false;
};

const isAdmin = () => {
  return Cookies.get('user_type') === 'admin' ? true : false;
};

const login = (email, password) => {
  return API.post('/login', {
    email: email,
    password: password
  });
};

const logout = () => {
  return API.post('/logout');
};

const AuthService = {
  getUser,
  authenticated,
  isAdmin,
  login,
  logout
};

export default AuthService;
