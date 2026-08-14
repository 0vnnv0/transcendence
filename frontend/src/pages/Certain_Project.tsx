import Navbar from '../components/ui/Navbar/Navbar'
import { useParams } from 'react-router-dom';
import projectsData from '../data/projects.json';
import UserCard from '../components/ui/Cards/UserCard';
import CardSection from '../components/sections/CardSection';
import TagList from '../components/ui/TagList/TagList';
import type { TagData } from '../components/ui/TagList/TagList';
import Button from '../components/ui/Button/Button';
import ViewModeToggle from '../components/ui/Toggle/ViewModeToggle';
import { useActiveUsersByProject } from '../hooks/useUsers';
import { useViewModeStore } from '../store/viewModeStore';
import { useAuth } from '../components/context/AuthContext';

function Certain_Project() {

	const { id } = useParams<{ id: string }>();
	const { userName } = useAuth();
	const project = projectsData.find(p => p.slug === id);
	const { data: activeUsers, isLoading, isError, error } = useActiveUsersByProject(userName, project?.slug as string);
	console.log("Active Users: ", activeUsers);
	// const [viewMode, setViewMode] = useState<ViewMode>('grid');
	const { viewMode, setViewMode } = useViewModeStore();
	const layout = viewMode === 'grid' ? 'portrait' : 'landscape';

	const teamSize = (project?.teamSize?.min === project?.teamSize?.max) ? project?.teamSize?.min : `${project?.teamSize?.min} - ${project?.teamSize?.max}`;
	const projectTags: TagData[]  = [
		{ icon: 'clock', description: `${project?.estimatedHours} hours` },
		{ icon: 'smiley', description:  `${teamSize} people` },
		{ icon: 'flame', description: `${project?.keywords?.[1]}` },
	];

	const availableUsers = activeUsers?.filter(user => 
		user.activeProjects?.some(p => p?.status === "searching_a_group"))
		.map(user => {
			const userTags: TagData[] = [
				{ icon: 'trophy', description: `Rank ${user?.currentRank}` },
			];

			return (<UserCard
				key={user.id}
				username={user.login}
				layout={layout}
				image={user.avatarUrl as string}
				ctaText="Contact"
				tags={userTags}
			/>)
	});

	if (!project) {
		return <div className="p-10 text-white text-2xl">Project not found!</div>;
	}
	return (
		<section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-6">
				<div className="flex flex-row justify-between">
					<Button 
						size="sm"
						variant="secondary"
						icon="arrowLeft"
					>Back</Button>
					{project?.keywords && (
						<TagList tags={projectTags}/>
					)}
				</div>
				<h1 className="font-[Gasoek_One] text-6xl text-black">
					{project?.name}
				</h1>
				<p className="text-paragraph-big-bold">{project.description}</p>
				{/* <CardSection title="Feed">
					<CardSection.Body viewMode="list">
						<UserCard
							username="junruh"
							layout="landscape"
							image="/profile.jpg"
							ctaText='Contact'
						/>
					</CardSection.Body>
				</CardSection> */}
				<ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />
				<CardSection title="Available Students">
					<CardSection.Body viewMode={viewMode}>
						{availableUsers}
					</CardSection.Body>
				</CardSection>
				{isError && 
					<p className="text-subtitle text-red-500">{error instanceof Error ? error.message : 'Something went wrong'}</p>
				}
			</div>
		</section>
  )
}

export default Certain_Project
