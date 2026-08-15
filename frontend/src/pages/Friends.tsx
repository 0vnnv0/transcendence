import Navbar from '../components/ui/Navbar/Navbar'
import { useFriends, useFriendRequests, useAcceptFriend, useRemoveFriend } from '../hooks/useFriends';
import UserCard from '../components/ui/Cards/UserCard';
import CardSection from '../components/sections/CardSection';


function Friends() {
    const { data: allFriends, isLoading, isError } = useFriends();
    const { data: requests, isLoading: isLoadingReq, isError: isErrorReq } = useFriendRequests();
    const { mutate: acceptFriend } = useAcceptFriend();
    const { mutate: removeFriend } = useRemoveFriend();

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
                            image={request.avatarUrl}
                            route={`/users/${request.intraName}`} 
                            username={request.intraName}
                            isOnline={request.isOnline}
                            onAccept={() => acceptFriend(request.id)}
                            onDecline={() => removeFriend(request.id)}
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
							image={friend.avatarUrl}
        					route={`/users/${friend.intraName}`}
                            username={friend.intraName}
							ctaText="message"
							isOnline={friend.isOnline}
						/>
					))}
                </>
            );
        }

    }

    return (
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundColor: "white" }} 
     	>
		  	<div className="w-70 flex-none">
			  	<Navbar />
		  	</div>
			<div className="flex flex-col flex-1 p-10 gap-10">				 
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
			</div>
	</section>
  );
}

export default Friends