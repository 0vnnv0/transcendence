import Navbar from '../components/ui/Navbar/Navbar'

function MyProfile() {
  return (
	<section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_inapp.jpg')" }}
    >
		<Navbar />
	<div className="ml-80 p-15">
        <img src="/profile.jpg" alt="Profilbild" className="w-100 h-40 object-cover" />
	</div>
	<div className="ml-70 text-orange-500">
		<h1>anschmit</h1>
	</div>
	</section>
  )
}

export default MyProfile