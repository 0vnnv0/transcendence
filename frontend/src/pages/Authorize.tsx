import Button from '../components/ui/Button/Button'

function Authorize() {
	const handleAuthClick = () => {
		window.location.href = '/api/auth/42';
	};

	return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_login.jpg')" }}
    >
		<div className="flex flex-col flex-1 p-10 gap-10">
			<h1 className="text-title">
				please authorize your account with 42
			</h1>
			<Button type="button" onClick={handleAuthClick}  className="mt-4">
					authorisation
			</Button>
		</div>
	</section>
	)
}

export default Authorize