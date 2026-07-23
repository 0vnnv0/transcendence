import Navbar from '../components/ui/Navbar/Navbar'
import Button from '../components/ui/Button/Button'
import CardSection from '../components/sections/CardSection'
import InfoCard from '../components/ui/Cards/InfoCard'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useAuth } from '../components/context/AuthContext'
import { useUserProfile } from '../hooks/useUsers';
import { useRecommendedProjects } from '../hooks/useProjects'

function MyProfile() {

	const { userName } = useAuth();
	const { data: profile, isLoading: userLoading, isError: userError } = useUserProfile(userName !== "Guest" ? userName : null);
	const { data: projects, isLoading: projectsLoading, isError: projectsError } = useRecommendedProjects(userName !== "Guest" ? userName : null);

	console.log("profile", profile);

	let content;
	if (userLoading || projectsLoading) {
		content = <p className="text-subtitle text-purple">Loading ...</p>
	} else if (userError || !profile || projectsError || !projects) {
		content = <p className="text-subtitle text-red-500">[404] Error trying to load projects</p>
	} else {
		content = (
			<>
				{projects.availableProjects.map((project: any) => (
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

  return (

		<section
			className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat"
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-16">
				<div className="flex flex-row gap-8 w-full">
					<div className="group relative h-50 w-50 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
						style={{ backgroundImage: `url(${profile?.avatarUrl})` }}>
						<Button 
							className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
							size="sm"
							variant="secondary"
							icon="edit"
							onClick={() => console.log("Profilbild geandert!")}
						>Edit</Button>
					</div>
					<div className="flex flex-col justify-center gap-3">
						<h1 className="text-title">{userName}</h1>
						<p className="text-subtitle mb-4">{profile?.firstName} {profile?.lastName}</p>
						<div className="flex gap-2">
							{userName === profile?.intraName &&
								<Button 
									size="md" 
									icon="message" 
									onClick={() => console.log("Profilbild geandert!")}
								>Message</Button>
							}
							<Button 
								size="md"
								variant="secondary"
								icon="message" 
								onClick={() => console.log("Profilbild geandert!")}
							>Intra Profile</Button>
						</div>
					</div>
				</div>
				<CardSection title="User Info">
					<CardSection.Body viewMode="grid" columns={4}>
						<InfoCard
							image="rank.jpg"
							title="Rank"
							description="5"
						/>
					</CardSection.Body>
				</CardSection>
				<CardSection title="Recommended next projects">
					<CardSection.Body viewMode="grid" columns={2}>
						{content}
					</CardSection.Body>
				</CardSection>
			</div>
		</section>
  )
}

export default MyProfile
