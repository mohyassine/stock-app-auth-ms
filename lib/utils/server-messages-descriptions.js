const errorsDescriptions = Object.freeze({
  400: {
    description: 'The request was invalid or incomplete. Please check your input and try again',
  },
  403: {
    description: `Access Denied! You don't have permission to access this resource`,
  },
  406: {
    description: 'The requested content cannot be displayed in the format you specified.',
  },
  404: {
    description: 'The page or resource you are looking for could not be found.',
  },
  422: {
    description:
      'Validation Failed! The request contains invalid data. Please review your input and try again.',
  },
  500: {
    description:
      'Something went wrong on our end. We apologize for the inconvenience. Please try again later.',
  },
  401: {
    description: 'Access Denied! Please authenticate yourself to access this resource.',
  },
  409: {
    description:
      'Conflict! The requested operation conflicts with the current state of the resource.',
  },
  423: {
    description:
      'Resource Locked! The requested resource is temporarily locked. Please try again later.',
  },
  429: {
    description: 'Too Many Requests! Please wait for a while and try again later.',
  },
});

module.exports = errorsDescriptions;
