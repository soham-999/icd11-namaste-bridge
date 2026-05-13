const success = (data) => {
  return {
    success: true,
    data
  };
};

const error = (message) => {
  return {
    success: false,
    error: message
  };
};

module.exports = { success, error };