import Navbar from '../components/ui/Navbar/Navbar'

function Feed() {
  return (
	<section
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('background_inapp.jpg')" }}
    >
    <div>
		<Navbar />
    </div>
	<div className="ml-70 text-orange-500">
		<h1>this is your feed, say hi!</h1>
	</div>
	</section>
  )
}

export default Feed