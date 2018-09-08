const axios = require('axios');

module.exports.HelperFunctions = {
  demandParams: (params = {}) => {

    return {
      model:              "BMW",
      type:               "CABRIOLET",
      color:              "BLUE",
      infotainmentSystem: "BLUETOOTH",
      pickupLocation:     {xPickup: 14, yPickup: 27},
      dropoffLocation:    {xDropoff: 14, yDropoff: 27},
      pickupTime:         new Date(new Date().setDate(new Date().getDate() + 5)).toString(),
      dropoffTime:        new Date(new Date().setDate(new Date().getDate() + 10)).toString(),
      isLeatherInterior:  true,
      ...params};
  },
  sanitizeError: (error) => {
    return error.message.split(",")
  },
  demandAttributes: () => {
    return ['userID', 'model', 'type', 'color', 'infotainmentSystem', 'pickupLocation', 'dropoffLocation', 
      'isLeatherInterior', 'pickupTime', 'dropoffTime', 'createdAt', 'updatedAt', '_id'];
  },
  createUser: () => {
    return axios.post('http://users-app:3000/users', {
      user: {
        name:   'Omar',
        age:    24,
        gender: "M"
      }
    })
    .then(function (response) {
      return response.data
    })
  }
}