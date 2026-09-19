import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { signUpUser, loginUser, authorizeUser, type AuthCredentials } from '../services/auth.service';
import { useAuth } from '../components/context/AuthContext';
import { socket } from '../services/socket';

// =============================================================================
// TypeScript Interfaces & Types
// =============================================================================

// Define what your backend error payloads look like
interface BackendErrorResponse {
  message?: string;
}

// Typing what the server gives back on a basic Login POST request
interface LoginResponse {
  access_token: string;
}

// Typing what the server gives back on SignUp or Authorization confirmations
interface TokenResponse {
  token: string;
}

// =============================================================================
// Custom Hooks
// =============================================================================

export function useLogin(): UseMutationResult<LoginResponse, AxiosError<BackendErrorResponse>, AuthCredentials> {
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<BackendErrorResponse>, AuthCredentials>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data?.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/authorize');
      }
    },
    onError: (error) => {
      console.error('Login error:', error.response?.data?.message || error.message);
    }
  });
}

export function useSignUp(): UseMutationResult<TokenResponse, Error, AuthCredentials> {
  const navigate = useNavigate();

  return useMutation<TokenResponse, Error, AuthCredentials>({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/authorize');
    },
    onError: (error) => {
      console.error('SignUp error:', error.message);
    }
  });
}

export function useAuthorize(): UseMutationResult<TokenResponse, Error, void> {
  const navigate = useNavigate();
  const { updateUser } = useAuth(); // Hooking into the Context to set real-time state

  return useMutation<TokenResponse, Error, void>({
    mutationFn: authorizeUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      
      // Instantly decode the token into React memory so the app knows who we are
      updateUser(data.token);
      
      navigate('/dashboard'); 
    },
    onError: (error) => {
      console.error('Authorization error:', error.message);
    }
  });
}

interface LogoutLogicResult {
  performLogout: () => Promise<void>;
}

export function useLogoutLogic(): LogoutLogicResult {
  const navigate = useNavigate();

  const performLogout = async (): Promise<void> => {
    const token: string | null = localStorage.getItem('token');

    if (token) {
      try {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error("Backend-Logout unsuccessful.", error);
      }
    }
	if (socket.connected) {
        socket.disconnect();
    }

    localStorage.removeItem('token');
    navigate('/');
  };

  return { performLogout };
}

// import { useMutation } from '@tanstack/react-query';
// import { signUpUser, loginUser, authorizeUser } from '../services/auth.service';
// import { useNavigate } from 'react-router-dom';

// export function useLogin() {
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: loginUser,
//     onSuccess: (data) => {
//       // Wichtig: Abgleich mit deinem Backend ('access_token')
//       if (data?.access_token) {
//         localStorage.setItem('token', data.access_token);
//         navigate('/authorize');
//       }
//     },
//     onError: (error) => {
//       console.error('Login error:', error.response?.data?.message || error.message);
//     }
//   });
// }

// export function useSignUp() {
//   const navigate = useNavigate();

//   return useMutation({
//     //mutationFn: loginUser,
// 	mutationFn: signUpUser,
// 	//mutationFn: authorizeUser,
//     onSuccess: (data) => {
//       // 1. Store the token (usually in localStorage or a Cookie)
//       localStorage.setItem('token', data.token);
      
//       // 2. Redirect the user to the chat dashboard
//       navigate('/authorize');
//     },
//     onError: (error) => {
//       console.error('Login error:', error.message);
//     }
//   });
// }

// export function useAuthorize() {
//   const navigate = useNavigate();

//   return useMutation({
// 	mutationFn: authorizeUser,
//     onSuccess: (data) => {
//       // 1. Store the token (usually in localStorage or a Cookie)
//       localStorage.setItem('token', data.token);
      
//       // 2. Redirect the user to the chat dashboard
//       navigate('/dashboard'); 
//     },
//     onError: (error) => {
//       console.error('Login error:', error.message);
//     }
//   });
// }

// export function useLogoutLogic() {
// 	const navigate = useNavigate();

// 	const performLogout = async () => {
// 		const token = localStorage.getItem('token');

// 		if (token) {
// 			try {
// 				await fetch('/api/logout', {
// 					method: 'POST',
// 					headers: {
// 						'Authorization': `Bearer ${token}`,
// 					}
// 				});
// 			} catch (error) {
// 				console.error("Backend-Logout unsuccessful.", error);
// 			}
// 		}

// 		localStorage.removeItem('token');
// 		navigate('/');
// 	};
// 	return { performLogout };
// }
