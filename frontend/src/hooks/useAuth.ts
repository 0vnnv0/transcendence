import { useMutation } from '@tanstack/react-query';
import { signUpUser, loginUser, authorizeUser } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    // Wir nutzen hier 'any' für data und error, falls deine auth.service noch nicht komplett typisiert ist
    onSuccess: (data: any) => {
      if (data?.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/authorize');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error?.response?.data?.message || error?.message);
    }
  });
}

export function useSignUp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpUser,
    onSuccess: (data: any) => {
      localStorage.setItem('token', data?.token);
      navigate('/authorize');
    },
    onError: (error: any) => {
      console.error('Signup error:', error?.message);
    }
  });
}

export function useAuthorize() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authorizeUser,
    onSuccess: (data: any) => {
      localStorage.setItem('token', data?.token);
      navigate('/dashboard'); 
    },
    onError: (error: any) => {
      console.error('Authorize error:', error?.message);
    }
  });
}

export function useLogoutLogic() {
  const navigate = useNavigate();

  const performLogout = async (): Promise<void> => {
    const token = localStorage.getItem('token');

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

    localStorage.removeItem('token');
    navigate('/');
  };

  return { performLogout };
}