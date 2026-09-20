import CardSection from '../components/sections/CardSection'
import { useParams } from 'react-router-dom';
import Button from '../components/ui/Button/Button'
import { useStartChat } from '../hooks/useChat';
import { useUserProfile } from '../hooks/useUsers';
import { useAddFriend, useRemoveFriend, useAcceptFriend } from '../hooks/useFriends';
import { useAuth } from '../components/context/AuthContext';
import Tag from '../components/ui/TagList/Tag';
import { useRecommendedProjects, useNextProject } from '../hooks/useProjects';
import ProjectsList from '../components/ui/Profile/ProjectsList';
import { formatAvailability } from '../utils/formatAvailability';
import { toast } from 'react-hot-toast';
import InfoCard from '../components/ui/Cards/InfoCard'
import SearchBar from '../components/ui/Search/Search';
import PageLayout from './PageLayout';

function OtherProfile() {
    const { username } = useParams<{ username: string }>();
    const userKey = (username && username !== "Guest") ? username : null;
    const { userId: currentUserId } = useAuth();

    const { data: profile, isLoading, isError } = useUserProfile(userKey);
    const { mutate: startChat, isPending: isStartingChat } = useStartChat();
   
    const { mutate: addFriend, isPending: isAddingFriend } = useAddFriend();
    const { mutate: removeFriend, isPending: isRemovingFriend } = useRemoveFriend();
    const { mutate: acceptFriend, isPending: isAcceptingFriend } = useAcceptFriend();

    const { data: currentProject, isLoading: currentProjectLoading, isError: currentProjectError } = useNextProject(userKey);
    const { data: recProjects, isLoading: recProjectsLoading, isError: recProjectsError } = useRecommendedProjects(userKey);

    let mainContent = null;

    if (isLoading) {
        mainContent = (
            <div className="flex h-full items-center justify-center">
                <p className="text-subtitle text-purple">Loading profile...</p>
            </div>
        );
    } else if (isError || !profile) {
        mainContent = (
            	<div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
					<h1 className="text-title">404</h1>
					<p className="text-subtitle my-4">Page not found</p>
					<Button href="/dashboard">
						Back to dashboard
					</Button>
				</div>
        );
    } else {
        const friendship = profile.friendship;
        const friendshipStatus = friendship?.status;

        let friendActionButton;

        if (friendshipStatus === 'ACCEPTED') {
            friendActionButton = (
                <Button
                    size="md"
                    icon="smiley"
                    variant="secondary"
                    onClick={() => removeFriend(profile.id, {
                    })}
                    disabled={isRemovingFriend}
                >
                    {isRemovingFriend ? 'Removing...' : 'Remove Friend'}
                </Button>
            );
        } else if (friendshipStatus?.startsWith('PENDING_SENT')) {
            friendActionButton = (
                <Button size="md" icon="clock" variant="secondary" disabled>
                    Pending
                </Button>
            );
        } else if (friendshipStatus?.startsWith('PENDING_RECEIVED')) {
            friendActionButton = (
                <Button
                    size="md"
                    icon="smiley"
                    variant="secondary"
                    onClick={() => acceptFriend(profile.id, {
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
                    icon="smiley"
                    variant="secondary"
                    onClick={() => addFriend(profile.id, {
                        onSuccess: () => {
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
			<>
				<div className="z-0 absolute top-0 left-0 right-0 h-100 bg-linear-to-b from-[#ffccb9] to-background-neutral" />
				<div className="flex flex-col flex-1 gap-16 z-10">
					<div className="top-6 w-full flex md:hidden justify-between gap-4">
						<Button goBack={true} variant="tertiary" size="sm" icon="arrowLeft">Back</Button>
						<SearchBar />
					</div>
					<div className="flex flex-col gap-4 sm:gap-8 w-full sm:flex-row md:flex-col lg:flex-row">
						<div
							className="group relative border border-black h-56 w-full sm:h-48 sm:w-48 md:h-56 md:w-full lg:h-48 lg:w-48 xl:h-54 xl:w-54 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
							style={{ backgroundImage: `url(${profile?.customAvatar || profile?.avatarUrl})` }}
						>
						</div>
						<div className="flex flex-col justify-center gap-2">
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
									href={profile.intraUrl}
									externalLink
								>
									Intra Profile
								</Button>

								{friendActionButton}
							</div>
						</div>
					</div>

					<CardSection title="User Info">
						<CardSection.Body viewMode="grid" columns="none">
							{profile?.availability?.preferredDays &&
								<InfoCard icon="flame" title="Weekdays" description={formatAvailability(profile?.availability?.preferredDays)} />
							}
							{!!profile?.availability?.workDaysPerWeek &&
								<InfoCard icon="calendar" title="Days per week" description={profile?.availability?.workDaysPerWeek as unknown as string} />
							}
							<InfoCard icon="home" title="Location" description={profile?.availability?.isRemote ? 'Remote' : 'On Campus'} />
						</CardSection.Body>
					</CardSection>

					{currentProject?.status === "completed" ? (
						<p className="text-subtitle text-green-500">
							All group projects completed!
						</p>
					) : currentProject ? (
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
					) : null}

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
			</>
        );
    }

    return (
        <PageLayout>
                {mainContent}
        </PageLayout>
    );
}

export default OtherProfile;
