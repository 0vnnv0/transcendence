import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import { useParams } from "react-router"


const ChatWindow: React.FC = () => {
	const { chatId } = useParams<{ chatId: string }>();
	const numericChatId = Number(chatId);

	if (!chatId || isNaN(numericChatId)) {
		return (
			<div className="h-full w-full flex items-center justify-center text-red-500 font-kyiv">
				Invalid ChatId. Please choose a chat from the Menu.
			</div>
		);
	}
	return <div className="h-full w-full bg-gray-50 flex flex-col justify-between">
		<ChatHeader />
		<MessageList chatId={numericChatId}/>
		<MessageInput chatId={numericChatId}/>
	</div>
}

export default ChatWindow