module.exports.HelperFunctions = {
  carParams: (params = {}) => {
    return {
      model:              "BMW",
      type:               "CABRIOLET",
      color:              "BLUE",
      infotainmentSystem: "BLUETOOTH",
      engineNumber:       `${Math.random().toString(36).substr(2,1)}-${Math.random().toString(36).substr(2, 6)}`,
      location:           {x: 14, y: 27},
      isLeatherInterior:  true,
      ...params};
  },
  sanitizeError: (error) => {
    return error.message.split(",")
  },
  carAttributes: () => {
    return ['model', 'type', 'color', 'infotainmentSystem', 'engineNumber', 'location', 'isLeatherInterior', 'traveledDistance', 'createdAt', 'updatedAt', '_id'];
  }
}