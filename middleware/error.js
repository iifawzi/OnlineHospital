// Making a custom error:
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

//   Function to handle the errors and send the response:

const handleError = (err, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({
    status: false,
    message,
    data: {},
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
