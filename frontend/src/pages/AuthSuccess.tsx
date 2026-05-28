import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

function AuthSuccess() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const token = searchParams.get('token');

		if (token) {
			localStorage.setItem('token', token);
			navigate('/dashboard');
		} else {
			console.error("No token found in callback URL");
			navigate('login');
		}
	}, [searchParams, navigate]);
	return (
		<div className="in-h-screen flex items-center justify-center br-gray-900 text-white">
			<p>Authenticating with 42, please wait...</p>
		</div>
	);

}

export default AuthSuccess