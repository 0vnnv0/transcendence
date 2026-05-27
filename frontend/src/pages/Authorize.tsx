import Button from '../components/ui/Button/Button'
import { redirect, useNavigate } from 'react-router-dom'


function Authorize() {
	const navigate = useNavigate();
	const links = `https://api.intra.42.fr/oauth/authorize?client_id="u-s4t2ud-f6afffdd296d3dece25b422b688df6491835fed4d55eaca17df385b2e383acd7"&redirect_uri="http://localhost:3000/auth/42/callback"&response_type=code&scope=public`

	return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_login.jpg')" }}
    >
		<div className="flex flex-col flex-1 p-10 gap-10">
			<h1 className="text-title">
				please authorize your account with 42
			</h1>
			<Button type="submit" onClick={() => navigate (links)}  className="mt-4">
					authorisation
			</Button>
		</div>
	</section>
	)
}

export default Authorize