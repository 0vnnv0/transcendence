import Navbar from '../components/ui/Navbar/Navbar'
import ChatWindow from '../components/ui/ChatWindow/ChatWindow'

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
				<ChatWindow />
			</div>

		</section>
  )
}
//https://www.youtube.com/watch?v=45Z-xBRHuRo 4:28

export default Chats