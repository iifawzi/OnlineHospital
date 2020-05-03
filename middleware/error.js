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
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: false,
    statusCode,
    message,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
