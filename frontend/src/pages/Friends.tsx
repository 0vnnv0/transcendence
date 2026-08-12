import Navbar from '../components/ui/Navbar/Navbar'
import { useFriends } from '../hooks/useFriends';
import UserCard from '../components/ui/Cards/UserCard';
import CardSection from '../components/sections/CardSection';


function Friends() {
    const { data: allFriends, isLoading, isError } = useFriends();
    
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
                            layout="portrait"
                            title={friend.intraName}
							image={friend.avatarUrl}
							ctaText="message"
					//		isOnline={`Rank ${project.projectRank}`}
							route={`/users/${friend.intraName}`}
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