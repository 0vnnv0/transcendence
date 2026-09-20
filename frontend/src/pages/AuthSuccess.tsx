import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { jwtDecode } from 'jwt-decode';

interface MyTokenPayload {
	id: number;
	intraName: string;
	iat: number;
	exp: number;
}

function AuthSuccess() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
		const urlParams = new URLSearchParams(window.location.search);
        
        const token = hashParams.get('token') || urlParams.get('token');

		if (token) {
			localStorage.setItem('token', token);
			sessionStorage.removeItem('pending_auth');
			try {
				const decodedToken = jwtDecode<MyTokenPayload>(token);
				console.log("Welcome back: ", decodedToken.intraName)
				navigate('/dashboard');
			} catch (error){
				console.log("token not readable!", error);
				navigate('/');
			}
		} else {
			console.error("No token found in callback URL");
			navigate('/');
		}
	}, [searchParams, navigate]);
	return (
		<div className="in-h-screen flex items-center justify-center br-gray-900 text-white">
			<p>Authenticating with 42, please wait...</p>
		</div>
	);

}

export default AuthSuccess
