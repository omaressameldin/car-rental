const axios = require('axios');

module.exports.HelperFunctions = {
  userParams: (params = {}) => {
    return {name: "omar", age: 20, gender: "M", ...params};
  },
  sanitizeError: (error) => {
    return error.message.split(",")
  },
  userAttributes: () => {
    return ['name', 'age', 'gender', 'createdAt', 'updatedAt', '_id'];
  },
  createDemand: (userID) => {
    return axios.post('http://demands-app:3000/demands',  {
      demand: {
        userID: userID,
        model: "VW",
        color: "GREEN",
        type: "SEDAN",
        infotainmentSystem: "CD",
        isLeatherInterior: true,
        pickupLocation: {
          xPickup: 14,
          yPickup: 27
        },
        dropoffLocation: {
          xDropoff: 14,
          yDropoff: 27
        },
        pickupTime: "2018-10-11T11:30:00.000Z",
        dropoffTime: "2018-10-31T11:30:00.000Z",
      }
    })
    .then(function (response) {
      return response.data
    })
  }  
}