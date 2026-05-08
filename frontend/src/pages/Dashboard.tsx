import Navbar from '../components/ui/Navbar/Navbar'
import { useUsers } from '../hooks/useUsers';

function Dashboard() {
	const { data, isLoading, error } = useUsers();

	if (isLoading) return <div>Loading...</div>;
  	if (error) return <div>Error: {error.message}</div>;

	return (
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url('background_inapp.jpg')" }}
		>
			<div className="w-70">
				<Navbar />
			</div>
			<div>
				<h1 className="font-[Gasoek_One] text-6xl text-orange-500">
					welcome to cluster fuck
				</h1>
				<ul>
					{data.map(user => <li key={user.id}>{user.name}</li>)}
				</ul>
			</div>
		</section>
	)
}

export default Dashboard
