import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"


const ChatWindow: React.FC = () => {
	return <div className="h-full w-full bg-gray-90 flex flex-col justify-between">
		<ChatHeader />
		<MessageList />
		<MessageInput />
	</div>
}

export default ChatWindow