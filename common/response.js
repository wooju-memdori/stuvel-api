module.exports.success = data => {
  return {
    data,
  };
};

module.exports.failed = (message, code) => {
  return {
    code: code || 500,
    message,
  };
};
