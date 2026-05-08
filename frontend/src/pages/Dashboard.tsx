import Navbar from '../components/ui/Navbar/Navbar'

function Dashboard() {
  return (
	<section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_inapp.jpg')" }}
    >
    <div>
		<Navbar />
    </div>
	<div className="font-[Gasoek_One] text-6xl ml-70 text-orange-500">
		<h1>welcome to cluster fuck</h1>
	</div>
	</section>
  )
}

export default Dashboard