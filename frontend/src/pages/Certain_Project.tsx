import Navbar from '../components/ui/Navbar/Navbar'
import { useParams, useNavigate } from 'react-router-dom';
import projectsData from '../data/projects.json';
import UserCard from '../components/ui/Cards/UserCard';
import CardSection from '../components/sections/CardSection';
import TagList from '../components/ui/TagList/TagList';
import type { TagData } from '../components/ui/TagList/TagList';
import { useActiveUsersByProject } from '../hooks/useUsers';
import { useAuth } from '../components/context/AuthContext';
import { useProjectFilters } from '../store/useProjectFilters';
import { formatAvailability, isFullyAvailable } from '../utils/formatAvailability';
import { getProjectImage } from '../utils/projectImages';
import { mockUsers } from '../types/mockUser';
import { formatProjectName } from '../utils/formatProjectName';

function Certain_Project() {

	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { userName } = useAuth();
	const project = projectsData.find(p => p.slug === id);
	const { data: activeUsers, isError, error } = useActiveUsersByProject(userName, project?.slug as string);
	const { viewMode, days: selectedDays } = useProjectFilters();
	const layout = viewMode === 'grid' ? 'portrait' : 'landscape';

	const teamSize = (project?.teamSize?.min === project?.teamSize?.max) ? project?.teamSize?.min : `${project?.teamSize?.min} - ${project?.teamSize?.max}`;
	const projectTags: TagData[]  = [
		{ icon: 'clock', description: `${project?.estimatedHours} hours` },
		{ icon: 'smiley', description:  `${teamSize} people` },
		{ icon: 'flame', description: `${project?.keywords?.[1]}` },
	];

	const availableUsers = activeUsers?.filter(user => 
		user.activeProjects?.some(p => p?.status === "searching_a_group"))
		.filter(user => {
			if (selectedDays.length === 0) return true;
			if (isFullyAvailable(user.availability.preferredDays)) return true;
			return user.availability.preferredDays.some(day => selectedDays.includes(day));
		})
		.map(user => {
			const days = formatAvailability(user?.availability.preferredDays);
			const userTags: TagData[] = [
			{ icon: 'trophy', description: `Rank ${user?.currentRank}` },
			{ icon: 'clock', description: days },
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

	// const availableUsers = mockUsers?.filter(user => 
	// 	user.activeProjects?.some(p => p?.status === "searching_a_group"))
	// 	.filter(user => {
	// 		// no days selected -> don't filter by availability, show everyone
	// 		if (selectedDays.length === 0) return true;
	// 		// otherwise: user must be free on at least one of the selected days
	// 		return user.preferredDays.some(day => selectedDays.includes(day));
	// 	})
	// 	.map(user => {
	// 		const days = formatAvailability(user?.preferredDays);
	// 		const userTags: TagData[] = [
	// 			{ icon: 'trophy', description: `Rank ${user?.currentRank}` },
	// 			{ icon: 'clock', description: days },
	// 		];

	// 		return (
	// 			<UserCard
	// 				key={user.id}
	// 				username={user.login}
	// 				layout={layout}
	// 				image={user.avatarUrl as string}
	// 				ctaText="Contact"
	// 				tags={userTags}
	// 			/>
	// 		);
	// });

	if (!project) {
		return <div className="p-10 text-white text-2xl">Project not found!</div>;
	}
	return (
		<section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="relative flex flex-col flex-1 p-10 gap-6">
				<div className="z-0 absolute top-0 left-0 right-0 h-100 bg-linear-to-b from-mild-purple-dark to-background-neutral" />
				<div className="flex flex-row w-full gap-10 border-b border-background-dark pb-10 z-10 justify-between">
					<div className="flex flex-col justify-between gap-16 w-full max-w-195">
						<div className="flex flex-start">
							{project?.keywords && (
								<TagList tags={projectTags}/>
							)}
						</div>
						<div>
							<h1 className="font-[Gasoek_One] lg:text-6xl md:text-5xl text-black mb-3">
								{formatProjectName(project?.name)}
							</h1>
							<p className="text-paragraph-big-bold">{project.description}</p>
						</div>
					</div>	
					<img
						src={getProjectImage(project?.slug)}
						alt={`${project?.slug} project image`}
						className="object-cover rounded-3xl w-70 min-h-70 h-full border border-black"
					/>
				</div>
				
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

				<CardSection title="Available Students" filter>
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
