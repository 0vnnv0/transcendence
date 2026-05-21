import Navbar from '../components/ui/Navbar/Navbar'

function Chats() {
  return (
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundColor: "white" }}
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-10">
				<h1 className="font-[Gasoek_One] text-6xl text-black">
					welcome to cluster fuck
				</h1>
				</div>
		</section>
  )
}

export default Chats