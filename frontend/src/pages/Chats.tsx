import Navbar from '../components/ui/Navbar/Navbar'
import ChatWindow from '../components/ui/ChatWindow/ChatWindow'

function Chats() {

  return (
	
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundColor: "white" }}
		>
            <div className="md:w-70 flex-none">
                <Navbar />
            </div>
            <div className="flex flex-col flex-1 w-full p-5 md:p-10 gap-10">
				<ChatWindow />
			</div>

		</section>
  )
}

export default Chats
