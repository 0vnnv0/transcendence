import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { signUpUser, loginUser, authorizeUser, type AuthCredentials } from '../services/auth.service';
import { useAuth } from '../components/context/AuthContext';
import { socket } from '../services/socket';

// TypeScript Interfaces & Types

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


// Custom Hooks
export function useLogin(): UseMutationResult<LoginResponse, AxiosError<BackendErrorResponse>, AuthCredentials> {
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<BackendErrorResponse>, AuthCredentials>({
    mutationFn: loginUser,
    onSuccess: () => {
		sessionStorage.setItem('pending_auth', 'true');
        navigate('/authorize');
    //   }
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
    onSuccess: () => {
		sessionStorage.setItem('pending_auth', 'true');
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
