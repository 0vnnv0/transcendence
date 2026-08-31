import { useAuth } from '../components/context/AuthContext'
import { useUserProfile } from '../hooks/useUsers'
import { useRecommendedProjects, useNextProject } from '../hooks/useProjects'
import Navbar from '../components/ui/Navbar/Navbar'
import Button from '../components/ui/Button/Button'
import CardSection from '../components/sections/CardSection'
import InfoCard from '../components/ui/Cards/InfoCard'
import AvatarUpload from '../components/ui/Profile/AvatarUpload'
import PreferencesForm from '../components/ui/Profile/PreferencesForm'
import ProjectsList from '../components/ui/Profile/ProjectsList'

function MyProfile() {
	const { userName } = useAuth();
	const userKey = userName !== "Guest" ? userName : null;

	const { data: profile, isLoading, isError } = useUserProfile(userKey);
	const { data: currentProject, isLoading: currentProjectLoading, isError: currentProjectError } = useNextProject(userKey);
	const { data: recProjects, isLoading: recProjectsLoading, isError: recProjectsError } = useRecommendedProjects(userKey);

	return (
		<section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
			<div className="w-70 flex-none">
				<Navbar />
			</div>

			{isLoading && <p className="text-subtitle text-purple">Loading ...</p>}
			{isError && <p className="text-subtitle text-red-500">[404] Error trying to load current project</p>}

			<div className="flex flex-col flex-1 p-10 gap-16">
				<div className="flex flex-row gap-8 w-full">
					<AvatarUpload avatarUrl={profile?.avatarUrl} userKey={userKey} />

					<div className="flex flex-col justify-center gap-3">
						<h1 className="text-title">{userName}</h1>
						<p className="text-subtitle mb-4">{profile?.firstName} {profile?.lastName}</p>
						<div className="flex gap-2">
							{userName === profile?.login && (
								<Button size="md" icon="message">Message</Button>
							)}
							<Button
								size="md"
								variant="secondary"
								href={profile?.intraUrl}
								externalLink
							>Intra Profile</Button>
						</div>
					</div>
				</div>

				<PreferencesForm profile={profile} userName={userName} />

				<CardSection title="User Info">
					<CardSection.Body viewMode="grid" columns={4}>
						<InfoCard image="rank.jpg" title="Rank" description={`${profile?.currentRank}`} />
						<InfoCard image="arctos.png" title="Coalition" description={`${profile?.coalitionName}`} />
					</CardSection.Body>
				</CardSection>

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
		</section>
	)
}

export default MyProfile
