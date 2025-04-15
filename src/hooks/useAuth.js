import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => useContext(AuthContext);












// import { useState, useContext, createContext } from 'react';
// import axios from '../utils/axios';

// import { AuthContext } from '../context/AuthContext';

// // export const useAuth = () => useContext(AuthContext);

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (username, password) => {
//     try {
//       const response = await axios.post('/login/', { username, password });
//       setUser(response.data);
//       localStorage.setItem('token', response.data.token);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await axios.post('/register/', userData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, register }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
