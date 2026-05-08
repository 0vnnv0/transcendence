import Navbar from '../components/ui/Navbar/Navbar'

function Chats() {
  return (
	<section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_inapp.jpg')" }}
    >
    <div>
		<Navbar />
    </div>
		<div className="ml-70 text-orange-500">
		<h1>chat with someone, lets gooooo</h1>
	</div>
	</section>
  )
}

export default Chats