import Navbar from '../components/ui/Navbar/Navbar'
import ChatWindow from '../components/ui/ChatWindow/ChatWindow'

function Chats() {

  return (
	
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
		>
            <div className="md:w-56 xl:w-70 flex-none">
                <Navbar />
            </div>
            <div className="flex flex-col flex-1 w-full gap-10">
				<ChatWindow />
			</div>

		</section>
  )
}

export default Chats
