import Button from '../components/ui/Button/Button'
import { useForm } from 'react-hook-form'
import { useLogin, useSignUp } from '../hooks/useAuth'

function Login() {
	const { register, handleSubmit, formState: { errors } } = useForm();
	const signUpMutation = useSignUp();
	const loginMutation = useLogin();

	const onSignUpSubmit = (data: any) => {
		loginMutation.reset();
		signUpMutation.mutate({ email: data.email, password: data.password });
	};

	const onLoginSubmit = (data: any) => {
		signUpMutation.reset();
    	loginMutation.mutate({ email: data.email, password: data.password });
  	};

	const isLoading = loginMutation.isPending || signUpMutation.isPending;

  const layout = "flex items-center flex-col"

  return (
    <section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_login.jpg')" }}
    >
      <section className={`${layout} p-50`}>
        <div className={`${layout} pb-1 backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20`}>
         <img className="h-15" src="logo-white.svg" alt="logo"/>
          <p className="text-white/70">Login to find the match of your life</p>
			<form 
				onSubmit={handleSubmit(onSignUpSubmit)} 
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
				{loginMutation.isError && (
					<p className="text-red-500 text-xs mb-4">
						{(loginMutation.error as any).response?.data?.message || loginMutation.error.message}
					</p>
				)}
				{signUpMutation.isError && (
					<p className="text-red-500 text-xs mb-4">
						{(signUpMutation.error as any).response?.data?.message || signUpMutation.error.message}
					</p>
				)}
				
				<div className="flex gap-4 mt-4 w-full">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                      {signUpMutation.isPending ? 'Signing up...' : 'Sign Up'}
                  </Button>
                  <Button 
                      type="button" 
                      onClick={handleSubmit(onLoginSubmit)} 
                      disabled={isLoading} 
                      className="flex-1"
                  >
                      {loginMutation.isPending ? 'Logging in...' : 'Login'}
                  </Button>
              	</div>
			</form>
        </div>
      </section>
    </section>
  )
}

export default Login