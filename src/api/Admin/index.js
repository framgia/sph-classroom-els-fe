import API from '../Base/index';

const AdminApi = {
  createAdmin: ({ name, email }) => {
    const options = {
      method: 'POST',
      url: '/admin/create',
      data: {
        name: name,
        email: email
      }
    };

    return API.request(options);
  },

  setNewPassword: ({ email, password, password_confirmation }) => {
    const options = {
      method: 'PATCH',
      url: '/admin/set-password',
      data: {
        email: email,
        password: password,
        password_confirmation: password_confirmation
      }
    };

    return API.request(options);
  },

  getAllUsers: (id) => {
    const options = {
      method: 'GET',
      url: `/users/${id}`
    };
    return API.request(options);
  },

  updatePassword: ({ password, new_password, password_confirmation }) => {
    const options = {
      method: 'PATCH',
      url: '/admin/password-edit',
      data: {
        password: password,
        new_password: new_password,
        password_confirmation: password_confirmation
      }
    };

    return API.request(options);
  },

  getAdminAccounts: ({ ...params }) => {
    const options = {
      method: 'GET',
      url: '/admin/users',
      params: {
        ...params
      }
    };
    return API.request(options);
  },

  deleteAdmin: (admin_id) => {
    const options = {
      method: 'DELETE',
      url: `/admin/delete-admin/${admin_id}`
    };

    return API.request(options);
  }
};

export default AdminApi;
