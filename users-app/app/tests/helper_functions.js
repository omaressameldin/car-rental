module.exports.HelperFunctions = {
  userParams: (params = {}) => {
    return {name: "omar", age: 20, gender: "M", ...params};
  },
  sanitizeError: (error) => {
    return error.message.split(",")
  },
  userAttributes: () => {
    return ['name', 'age', 'gender', 'createdAt', 'updatedAt', '_id'];
  }
}