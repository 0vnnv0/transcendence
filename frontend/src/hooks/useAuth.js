import { useMutation } from '@tanstack/react-query';
import { signUpUser, loginUser, authorizeUser } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
	//mutationFn: signUpUser,
	//mutationFn: authorizeUser,
    onSuccess: (data) => {
      // 1. Store the token (usually in localStorage or a Cookie)
      localStorage.setItem('token', data.token);
      
      // 2. Redirect the user to the chat dashboard
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error.message);
    }
  });
}

export function useSignUp() {
  const navigate = useNavigate();

  return useMutation({
    //mutationFn: loginUser,
	mutationFn: signUpUser,
	//mutationFn: authorizeUser,
    onSuccess: (data) => {
      // 1. Store the token (usually in localStorage or a Cookie)
      localStorage.setItem('token', data.token);
      
      // 2. Redirect the user to the chat dashboard
      navigate('/authorize');
    },
    onError: (error) => {
      console.error('Login error:', error.message);
    }
  });
}

export function useAuthorize() {
  const navigate = useNavigate();

  return useMutation({
	mutationFn: authorizeUser,
    onSuccess: (data) => {
      // 1. Store the token (usually in localStorage or a Cookie)
      localStorage.setItem('token', data.token);
      
      // 2. Redirect the user to the chat dashboard
      navigate('/dashboard'); 
    },
    onError: (error) => {
      console.error('Login error:', error.message);
    }
  });
}
