import PageLayout from './PageLayout';
import { useFriends, useFriendRequests, useAcceptFriend, useRemoveFriend } from '../hooks/useFriends';
import UserCard from '../components/ui/Cards/UserCard';
import CardSection from '../components/sections/CardSection';
import { useStartChat } from '../hooks/useChat';
import { useAuth } from '../components/context/AuthContext';


function Friends() {
    const { data: allFriends, isLoading, isError } = useFriends();
    const { data: requests, isLoading: isLoadingReq, isError: isErrorReq } = useFriendRequests();
    const { mutate: acceptFriend } = useAcceptFriend();
    const { mutate: removeFriend } = useRemoveFriend();
	const { userId: currentUserId } = useAuth();
	
	const { mutate: startChat, isPending: isStartingChat } = useStartChat();
	

    let requestsContent;
    if (isLoadingReq) {
        requestsContent = <p className="text-subtitle text-purple">Loading requests...</p>
    } else if (isErrorReq || !requests) {
        requestsContent = <p className="text-subtitle text-red-500">Error trying to load requests</p>
    } else {
        if (requests.length === 0) {
            requestsContent = <p className="text-subtitle">No pending requests</p>;
        } else {
            requestsContent = (
                <>
                    {requests.map((request: any) => (
                        <UserCard 
                            key={request.intraName}
                            layout="portrait"
                            title={request.intraName}
                            avatarUrl={request.avatarUrl}
                            route={`/users/${request.intraName}`} 
                            username={request.intraName}
                            isOnline={request.isOnline}
                            onAccept={() => acceptFriend(request.id)}
                            onDecline={() => removeFriend(request.friendshipId)}
							showStatus
						/>
                    ))}
                </>
            );
        }
    }
    
    let content;
    if (isLoading) {
		content = <p className="text-subtitle text-purple">Loading friends...</p>
	} else if (isError || !allFriends) {
		content = <p className="text-subtitle text-red-500">[404] Error trying to load friends</p>
	} else {
        const displayFriends = allFriends;
        if (displayFriends.length === 0) {
            content = <p className="text-subtitle">No Friends found</p>;
        } else {
            content = (
                <>
                {displayFriends.map((friend: any) => (
						<UserCard 
                            key={friend.intraName}
                            layout="portrait"
                            title={friend.intraName}
							avatarUrl={friend.avatarUrl}
        					route={`/users/${friend.intraName}`}
                            username={friend.intraName}
							ctaText="message"
							onCtaClick={() => currentUserId && startChat({ currentUserId, targetUserId: friend.id })}
							isOnline={friend.isOnline}
							showStatus
						/>
					))}
					{isStartingChat ? 'Starting...' : 'Message'}
                </>
            );
        }

    }

    return (
		<PageLayout>
				<h1 className="text-title text-black">
					Your friend requests
				</h1>
			<CardSection>
				<CardSection.Body viewMode="grid">
						{requestsContent}
				</CardSection.Body>
			</CardSection>
			<h1 className="text-title text-black">
				Your friends
			</h1>
			<CardSection>
				<CardSection.Body viewMode="grid">
						{content}
				</CardSection.Body>
			</CardSection>
		</PageLayout>
  )
}

export default Friends
