import { useAuth } from '../components/context/AuthContext'
import { useUserProfile } from '../hooks/useUsers'
import { useRecommendedProjects, useNextProject } from '../hooks/useProjects'
import Navbar from '../components/ui/Navbar/Navbar'
import Button from '../components/ui/Button/Button'
import CardSection from '../components/sections/CardSection'
import AvatarUpload from '../components/ui/Profile/AvatarUpload'
import PreferencesForm from '../components/ui/Profile/PreferencesForm'
import ProjectsList from '../components/ui/Profile/ProjectsList'
import SearchBar from '../components/ui/Search/Search';
import { useLogoutLogic } from '../hooks/useAuth'

function MyProfile() {
	const { userName } = useAuth();
	const userKey = userName !== "Guest" ? userName : null;
	const { performLogout } = useLogoutLogic();

	const { data: profile, isLoading, isError } = useUserProfile(userKey);
	const { data: currentProject, isLoading: currentProjectLoading, isError: currentProjectError } = useNextProject(userKey);
	const { data: recProjects, isLoading: recProjectsLoading, isError: recProjectsError } = useRecommendedProjects(userKey);

	return (
		<section className="relative bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
			<div className="z-0 absolute top-0 left-0 right-0 h-100 bg-linear-to-b from-[#edc5ff] to-background-neutral" />
            <div className="md:w-70 flex-none">
                <Navbar />
            </div>

			{isLoading && <p className="text-subtitle text-purple">Loading ...</p>}
			{isError && <p className="text-subtitle text-red-500">[404] Error trying to load current project</p>}

            <div className="z-10 flex flex-col flex-1 w-full p-5 md:p-10 gap-10">
				<div className="top-6 w-full flex md:hidden justify-between gap-4">
					<div className="flex gap-4">
						<Button goBack={true} variant="tertiary" size="sm" icon="arrowLeft">Back</Button>
						<SearchBar />
					</div>
					<Button type="button" variant="secondary" onClick={performLogout}>Logout</Button>
				</div>
				<div className="border-b border-background-dark pb-10 lg:pb-0 lg:border-none flex flex-col gap-4 sm:gap-6 md:gap-4 lg:gap-8 w-full sm:flex-row md:flex-col lg:flex-row">
					{profile?.id && userKey &&
						<AvatarUpload avatarUrl={profile?.customAvatar || profile?.avatarUrl} userId={profile?.id} login={userKey} />
					}

					<div className="flex flex-col justify-center gap-2 md:gap-3">
						<h1 className="text-title">{userName}</h1>
						<p className="text-subtitle mb-2 lg:mb-4">{profile?.firstName ? `{profile?.firstName} {profile?.lastName}` : 'Name not in Database!'}</p>
						<div className="flex gap-2">
							{userName === profile?.login && (
								<Button size="md" icon="message">Message</Button>
							)}
							<Button
								size="md"
								variant="primary"
								href={profile?.intraUrl}
								externalLink
							>Intra Profile</Button>
						</div>
					</div>
				</div>

				{profile ? (
					<PreferencesForm profile={profile} userId={profile.id} userName={userName} />
				) : (
					<p>No User Id found!</p> // or null, or a skeleton
				)}

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
						<CardSection.Body viewMode="grid" columns={3}>
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
		</section>
	)
}

export default MyProfile
