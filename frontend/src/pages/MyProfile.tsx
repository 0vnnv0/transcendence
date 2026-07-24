import { useRef } from 'react'
import { useUpdateAvatar } from '../hooks/useUsers'
import Navbar from '../components/ui/Navbar/Navbar'
import Button from '../components/ui/Button/Button'
import CardSection from '../components/sections/CardSection'
import InfoCard from '../components/ui/Cards/InfoCard'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useAuth } from '../components/context/AuthContext'
import { useUserProfile } from '../hooks/useUsers';
import { useRecommendedProjects } from '../hooks/useProjects'
import { useNextProject } from '../hooks/useProjects'

function renderProjects(data: any, isLoading: boolean, isError: boolean, label: string) {
	if (isLoading) {
		return <p className="text-subtitle text-purple">Loading ...</p>;
	}
	if (isError || !data) {
		return <p className="text-subtitle text-red-500">[404] Error trying to load {label}</p>;
	}
	return (
		<>
			{data.projects.map((project: any) => (
				<ProjectCard 
					key={project.id}
					layout="portrait"
					image="/success.png"
					title={project.name}
					subtitle={`Rank ${project.projectRank}`}
					tags={project.keywords}
					route={`/project/${project.slug}`}
					description={project.description}
				/>
			))}
		</>
	);
}

function MyProfile() {

	const { userName } = useAuth();
	const userKey = userName !== "Guest" ? userName : null;

	const { data: profile, isLoading, isError } = useUserProfile(userKey);
	const { data: currentProject, isLoading: currentProjectLoading, isError: currentProjectError } = useNextProject(userKey);
	const { data: recProjects, isLoading: recProjectsLoading, isError: recProjectsError } = useRecommendedProjects(userKey);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const updateAvatar = useUpdateAvatar(userKey);

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		updateAvatar.mutate(file)
		e.target.value = '' // allow re-selecting the same file later
	}

	let error;
	if (isLoading) {
		error = <p className="text-subtitle text-purple">Loading ...</p>;
	} else if (isError) {
		error = <p className="text-subtitle text-red-500">[404] Error trying to load current project</p>;
	}
	const content = renderProjects(currentProject, currentProjectLoading, currentProjectError, "current project");
	const recContent = renderProjects(recProjects, recProjectsLoading, recProjectsError, "recommended projects");

	console.log('Profile ', profile);
  return (
		<section
			className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat"
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			{error && error}
			<div className="flex flex-col flex-1 p-10 gap-16">
				<div className="flex flex-row gap-8 w-full">
					<div className="group relative h-50 w-50 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
						style={{ backgroundImage: `url(${profile?.avatarUrl})` }}>
						<Button 
							className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
							size="sm"
							variant="secondary"
							icon="edit"
							onClick={() => fileInputRef.current?.click()}
						>Edit</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleFileChange}
						/>
					</div>
					<div className="flex flex-col justify-center gap-3">
						<h1 className="text-title">{userName}</h1>
						<p className="text-subtitle mb-4">{profile?.firstName} {profile?.lastName}</p>
						<div className="flex gap-2">
							{userName === profile?.intraName &&
								<Button 
									size="md" 
									icon="message" 
								>Message</Button>
							}
							<Button 
								size="md"
								variant="secondary"
								icon="message" 
								href={profile?.intraUrl}
								externalLink
							>Intra Profile</Button>
						</div>
					</div>
				</div>
				<CardSection title="User Info">
					<CardSection.Body viewMode="grid" columns={4}>
						<InfoCard
							image="rank.jpg"
							title="Rank"
							description={`${profile?.currentRank}`}
						/>
						<InfoCard
							image="rank.jpg"
							title="Coalition"
							description={`${profile?.coalitionName}`}
						/>
					</CardSection.Body>
				</CardSection>
				{currentProject &&
					<CardSection title="Current projects">
						<CardSection.Body viewMode="grid" columns={2}>
							{content}
						</CardSection.Body>
					</CardSection>
				}
				{recProjects?.projects.length !== 0 &&				
					<CardSection title="Recommended next projects">
						<CardSection.Body viewMode="grid" columns={2}>
							{recContent}
						</CardSection.Body>
					</CardSection>
				}
			</div>
		</section>
  )
}

export default MyProfile
