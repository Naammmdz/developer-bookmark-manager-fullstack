/**
 * Extracts error message from various error response formats
 */
export const extractErrorMessage = (error: any): string => {
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // If it's an Error object, get the message
  if (error instanceof Error) {
    return error.message;
  }

  // If it's an axios error with response data
  if (error?.response?.data) {
    const errorData = error.response.data;
    
    // Check common Spring Boot error response formats
    if (errorData.message) {
      return errorData.message;
    }
    
    if (errorData.error) {
      return errorData.error;
    }
    
    if (errorData.details) {
      return errorData.details;
    }
    
    if (errorData.title) {
      return errorData.title;
    }
    
    // If it's a string response
    if (typeof errorData === 'string') {
      return errorData;
    }
  }

  // If it's a network error
  if (error?.message) {
    return error.message;
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Handles different types of authentication errors
 */
export const handleAuthError = (error: any): string => {
  const message = extractErrorMessage(error);
  
  // Handle specific authentication error messages
  if (message.toLowerCase().includes('invalid username or password')) {
    return 'Invalid username or password. Please check your credentials and try again.';
  }
  
  if (message.toLowerCase().includes('username already exists')) {
    return 'This username is already taken. Please choose a different username.';
  }
  
  if (message.toLowerCase().includes('email already exists')) {
    return 'This email is already registered. Please use a different email or try logging in.';
  }
  
  if (message.toLowerCase().includes('user not found')) {
    return 'User not found. Please check your credentials and try again.';
  }
  
  if (message.toLowerCase().includes('token')) {
    return 'Your session has expired. Please log in again.';
  }
  
  return message;
};

/**
 * Handles general API errors
 */
export const handleApiError = (error: any): string => {
  const message = extractErrorMessage(error);
  
  // Handle specific HTTP status codes
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return message || 'Bad request. Please check your input and try again.';
      case 401:
        return 'You are not authorized. Please log in and try again.';
      case 403:
        return 'Access forbidden. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return message || 'A conflict occurred. The resource already exists.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return message;
    }
  }
  
  return message;
};
