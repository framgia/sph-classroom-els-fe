import API from '../Base';

const DashboardApi = {
  getAll: (id) => {
    const options = {
      method: 'GET',
      url: `/categories-learned/${id}`
    };

    return API.request(options);
  },

  getFriendsActivities: () => {
    const options = {
      method: 'GET',
      url: '/followedLog'
    };

    return API.request(options);
  }
};

export default DashboardApi;
