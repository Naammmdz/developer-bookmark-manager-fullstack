import { jwtDecode } from 'jwt-decode';

// Type for the decoded token
interface DecodedToken {
  roles: string[];
  sub: string;
  iat: number;
  exp: number;
}

// Function to decode JWT and extract roles
export const getUserRolesFromToken = (token: string): string[] => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.roles || [];
  } catch (error) {
    console.error('Invalid token', error);
    return [];
  }
};

// Function to decode JWT and extract user info
export const getUserInfoFromToken = (token: string): { username: string; roles: string[] } | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return {
      username: decoded.sub,
      roles: decoded.roles || []
    };
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};

// Function to check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Invalid token', error);
    return true;
  }
};

// Function to get token expiration time
export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.exp;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
};
