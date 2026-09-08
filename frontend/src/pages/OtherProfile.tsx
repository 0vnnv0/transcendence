import Navbar from '../components/ui/Navbar/Navbar'
import CardSection from '../components/sections/CardSection'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useParams } from 'react-router-dom';
import Button from '../components/ui/Button/Button'
import { useStartChat } from '../hooks/useChat';
import { useUserProfile } from '../hooks/useUsers';
import { useAddFriend, useRemoveFriend, useAcceptFriend } from '../hooks/useFriends';
import { useAuth } from '../components/context/AuthContext';
import Tag from '../components/ui/TagList/Tag';
import { useRecommendedProjects, useNextProject } from '../hooks/useProjects';
import ProjectsList from '../components/ui/Profile/ProjectsList';
import PreferencesForm from '../components/ui/Profile/PreferencesForm';
import TagList from '../components/ui/TagList/TagList';
import { formatAvailability } from '../utils/formatAvailability';
import type { TagData } from '../components/ui/TagList/TagList';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function OtherProfile() {
    const { username } = useParams<{ username: string }>();
    const userKey = (username && username !== "Guest") ? username : null;
    const { userId: currentUserId } = useAuth();

    const { data: profile, isLoading, isError } = useUserProfile(userKey);
    const { mutate: startChat, isPending: isStartingChat } = useStartChat();

    const [localStatus, setLocalStatus] = useState<string | null>(null);
   
    const { mutate: addFriend, isPending: isAddingFriend } = useAddFriend();
    const { mutate: removeFriend, isPending: isRemovingFriend } = useRemoveFriend();
    const { mutate: acceptFriend, isPending: isAcceptingFriend } = useAcceptFriend();

    const { data: currentProject, isLoading: currentProjectLoading, isError: currentProjectError } = useNextProject(userKey);
    const { data: recProjects, isLoading: recProjectsLoading, isError: recProjectsError } = useRecommendedProjects(userKey);

    let mainContent = null;

    const days = formatAvailability(profile?.preferredDays);
    const userTags: TagData[] = [
        { icon: 'trophy', description: `Rank ${profile?.currentRank}` },
        { icon: 'flame', description: `Rank ${profile?.coalitionName}` },
        { icon: 'clock', description: days },
    ];

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
        const friendshipStatus = localStatus ?? friendship?.status;
        // const effectiveSenderId = localStatus ? currentUserId : friendship?.senderId;
        // const effectiveReceiverId = friendship?.receiverId;

        let friendActionButton;

        if (friendshipStatus === 'ACCEPTED') {
            friendActionButton = (
                <Button
                    size="md"
                    icon="message"
                    variant="secondary"
                    onClick={() => removeFriend(profile.id, {
                        onSuccess: () => setLocalStatus(null)
                    })}
                    disabled={isRemovingFriend}
                >
                    {isRemovingFriend ? 'Removing...' : 'Remove Friend'}
                </Button>
            );
        } else if (friendshipStatus === 'PENDING_SENT') { //&& effectiveSenderId === currentUserId
            friendActionButton = (
                <Button size="md" icon="clock" variant="secondary" disabled>
                    Pending
                </Button>
            );
        } else if (friendshipStatus === 'PENDING_RECEIVED') { // && effectiveReceiverId === currentUserId
            friendActionButton = (
                <Button
                    size="md"
                    icon="message"
                    variant="secondary"
                    onClick={() => acceptFriend(profile.id, {
                        onSuccess: () => setLocalStatus('ACCEPTED')
                    })}
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
                    variant="secondary"
                    onClick={() => addFriend(profile.id, {
                        onSuccess: () => {
							setLocalStatus('PENDING_SENT');
							toast.success("Friend request sent successfully!");
						}
                    })}
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
                        className="group relative border border-black h-54 w-54 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
                        style={{ backgroundImage: `url(${profile.avatarUrl || '/default_avatar.jpg'})` }}
                    >
                    </div>

                    <div className="flex flex-col justify-center gap-1">
                        { friendshipStatus === 'ACCEPTED' &&
                            <Tag description='Friends' icon='smiley' color='orange' />
                        }
                        <h1 className="text-title mb-1">{username}</h1>
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

                <TagList tags={userTags} size='large' />

                {currentProject && (
                    <CardSection title="Current projects">
                        <CardSection.Body viewMode="grid" columns={2}>
                            <ProjectsList
                                data={currentProject}
                                isLoading={currentProjectLoading}
                                isError={currentProjectError}
                                label="current project"
                            />
                        </CardSection.Body>
                    </CardSection>
                )}

                {recProjects?.projects.length !== 0 && (
                    <CardSection title="Recommended next projects">
                        <CardSection.Body viewMode="grid" columns={2}>
                            <ProjectsList
                                data={recProjects}
                                isLoading={recProjectsLoading}
                                isError={recProjectsError}
                                label="recommended projects"
                            />
                        </CardSection.Body>
                    </CardSection>
                )}
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