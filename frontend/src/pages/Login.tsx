import { useState } from 'react'
import Button from '../components/ui/Button/Button'
import Input from '../components/ui/Input/Input'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
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
          <div className={`${layout} pb-8`}>
            <Input
              label="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              label="password"
			  type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button onClick={handleLogin} className="mt-4">
            Login
          </Button>
        </div>
      </section>
    </section>
  )
}

export default Login