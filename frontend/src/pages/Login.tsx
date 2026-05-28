import Button from '../components/ui/Button/Button'
import { useForm } from 'react-hook-form'
import { useSignUp } from '../hooks/useAuth'

function Login() {
	const { register, handleSubmit, formState: { errors } } = useForm();
	const { mutate, isPending, error } = useSignUp();

	const onSubmit = (data) => {
		console.log("Form submitted to api... ", data.email);
		mutate(data);
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
			<form 
				onSubmit={handleSubmit(onSubmit)} 
				className="p-8 w-96"
			>
				<div className="mb-4">
					<label className="text-white/70 block text-sm font-medium">Email</label>
					<input
						{...register("email", { required: "Email is required" })}
						className="w-full bg-white p-2 border rounded mt-1"
						type="email"
					/>
					{errors.email && <p className="text-red-500 text-xs">{String(errors.email.message)}</p>}
				</div>

				<div className="mb-6">
					<label className="text-white/70 block text-sm font-medium">Password</label>
					<input
						{...register("password", { required: "Password is required" })}
						className="w-full bg-white p-2 border rounded mt-1"
						type="password"
					/>
					{errors.password && <p className="text-red-500 text-xs">{String(errors.password.message)}</p>}
				</div>
				{error && <p className="text-red-500 text-xs">{error.message}</p>}
				<Button type="submit" disabled={isPending} className="mt-4">
					{isPending ? 'Logging in...' : 'Login'}
				</Button>
			</form>
        </div>
      </section>
    </section>
  )
}

export default Login
