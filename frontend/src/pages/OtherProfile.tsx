import Navbar from '../components/ui/Navbar/Navbar'
import CardSection from '../components/sections/CardSection'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useParams } from 'react-router-dom';
import Button from '../components/ui/Button/Button'
import { useStartChat } from '../hooks/useChat';
import { useUserProfile } from '../hooks/useUsers';
import { useAddFriend, useRemoveFriend, useAcceptFriend } from '../hooks/useFriends';
import { useAuth } from '../components/context/AuthContext'; // WICHTIG: AuthContext importieren

function OtherProfile() {
    const { username } = useParams<{ username: string }>();
    const userKey = (username && username !== "Guest") ? username : null;    
    const { userId: currentUserId } = useAuth(); 

    const { data: profile, isLoading, isError } = useUserProfile(userKey);
    const { mutate: startChat, isPending: isStartingChat } = useStartChat();
    
    const { mutate: addFriend, isPending: isAddingFriend } = useAddFriend();
    const { mutate: removeFriend, isPending: isRemovingFriend } = useRemoveFriend();
    const { mutate: acceptFriend, isPending: isAcceptingFriend } = useAcceptFriend();

    let mainContent = null;

    if (isLoading) {
        mainContent = (
            <div className="flex h-full items-center justify-center">
                <p className="text-subtitle text-purple">Loading profile...</p>
            </div>
        );
    } else if (isError || !profile) {
        mainContent = (
            <div className="flex h-full items-center justify-center">
                <p className="text-subtitle text-red-500">
                    [404] User "{username}" not found or error loading profile.
                </p>
            </div>
        );
    } else {
        
        const friendship = profile.friendship;
        let friendActionButton;

        if (friendship?.status === 'ACCEPTED') {
            friendActionButton = (
                <Button
                    size="md"
                    icon="message"
                    variant="secondary" 
                    onClick={() => removeFriend(profile.id)}
                    disabled={isRemovingFriend}
                >
                    {isRemovingFriend ? 'Removing...' : 'Remove Friend'}
                </Button>
            );
        } else if (friendship?.status === 'PENDING' && friendship.senderId === currentUserId) {
            friendActionButton = (
                <Button size="md" icon="clock" disabled>
                    Pending
                </Button>
            );
        } else if (friendship?.status === 'PENDING' && friendship.receiverId === currentUserId) {
            friendActionButton = (
                <Button
                    size="md"
                    icon="message"
                    onClick={() => acceptFriend(profile.id)}
                    disabled={isAcceptingFriend}
                >
                    {isAcceptingFriend ? 'Accepting...' : 'Accept Request'}
                </Button>
            );
        } else {
            friendActionButton = (
                <Button
                    size="md"
                    icon="message"
                    onClick={() => addFriend(profile.id)}
                    disabled={isAddingFriend}
                >
                    {isAddingFriend ? 'Sending...' : 'Add Friend'}
                </Button>
            );
        }
        mainContent = (
            <div className="flex flex-col flex-1 gap-16">
                <div className="flex flex-row gap-8 w-full">
                    <div 
                        className="group relative h-50 w-50 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
                        style={{ backgroundImage: `url(${profile.avatarUrl || '/default_avatar.jpg'})` }}
                    >
                    </div>
                    
                    <div className="flex flex-col justify-center gap-3">
                        <h1 className="text-title">{username}</h1>
                        <p className="text-subtitle mb-4">
                            {profile.firstName} {profile.lastName}
                        </p>
                        
                        <div className="flex gap-2">
                            <Button 
                                size="md" 
                                icon="message"
                                onClick={() => currentUserId && startChat({ currentUserId, targetUserId: profile.id })}
                                disabled={isStartingChat || !currentUserId}
                            >
                                {isStartingChat ? 'Starting...' : 'Message'}
                            </Button>
                            
                            <Button 
                                size="md"
                                variant="secondary"
                                icon="message" 
                                href={profile.intraUrl}
                                externalLink
                            >
                                Intra Profile
                            </Button>
                            
                            {friendActionButton}
                        </div>
                    </div>
                </div>

                <CardSection title="Available for projects">
                    <CardSection.Body viewMode="grid">
                        <ProjectCard
                            layout="portrait"
                            image="allowed.png"
                            title="webserv"
                            subtitle='Why do URLs start with HTTP?'
                            tags={['2 People', 'Rank 5']}
                            route="#"
                            description="This project is about writing your own HTTP server. You will be able to test it with an actual browser. HTTP is one of the most widely used protocols on the internet."
                        />
                        <ProjectCard
                            layout="portrait"
                            image="allowed.png"
                            title="ft_irc"
                            subtitle='One of our favourite games.'
                            tags={['2 People', 'Rank 5']}
                            route="#"
                            description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
                        />
                    </CardSection.Body>
                </CardSection>
            </div>
        );
    }

    return (
        <section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
            <div className="w-70 flex-none">
                <Navbar />
            </div>
            
            <div className="flex flex-col flex-1 p-10">
                {mainContent}
            </div>
        </section>
    );
}

export default OtherProfile;