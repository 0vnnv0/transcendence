import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar/Navbar';
import ChatWindow from '../components/ui/ChatWindow/ChatWindow';
import Button from '../components/ui/Button/Button';
import ChatsList from '../components/ui/ChatList/ChatList';


function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

	useEffect(() => {
		const mql = window.matchMedia(query);
		const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
		setMatches(mql.matches);
		mql.addEventListener('change', onChange);
		return () => mql.removeEventListener('change', onChange);
	}, [query]);

	return matches;
}

/* Individual conversation (mobile + desktop) */
function ConversationView() {
	return (
		<section className="flex min-h-screen bg-cover bg-center bg-no-repeat">
			<div className="md:w-56 xl:w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 w-full">
				{/* <div className="md:hidden p-4 pb-0">
					<Button goBack={true} variant="tertiary" size="sm" icon="arrowLeft">Back</Button>
				</div> */}
				<ChatWindow />
			</div>
		</section>
	);
}


function Chats() {
	const { chatId } = useParams();
	const isMobile = useMediaQuery('(max-width: 767px)');

	if (chatId) return <ConversationView />;
	if (!isMobile) return <Navigate to="/dashboard" replace />;
	return <ChatsList />;
}

export default Chats;
