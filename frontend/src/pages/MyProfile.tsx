import Navbar from '../components/ui/Navbar/Navbar'

function MyProfile() {
  return (
	<section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_inapp.jpg')" }}
    >
    <div>
		<Navbar />
    </div>
	</section>
  )
}

export default MyProfile