module.exports.success = async data => {
  return {
    data,
  };
};

module.exports.error = async (message, code) => {
  return {
    code: code ? 500 : code,
    message,
  };
};
