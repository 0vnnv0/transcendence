import Button from '../components/ui/Button/Button'

function Login() {

  const handleLogin = async () => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      console.log('Login erfolgreich!')
    } else {
      console.log('Falsches Passwort oder Username')
    }
  };

  const layout = "flex items-center flex-col"

  return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_login.jpg')" }}
    >
      <section className={`${layout} p-50`}>
        <div className={`${layout} pb-1 backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20`}>
          <h1 className="text-2xl font-bold text-white">Cluster Fuck</h1>
          <p className="text-white/70">Login to find the love of your life</p>
          <Button onClick={handleLogin} className="mt-4">
            Login with 42
          </Button>
        </div>
      </section>
    </section>
  )
}

export default Login