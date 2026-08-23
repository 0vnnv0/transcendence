import Navbar from '../components/ui/Navbar/Navbar'
import { useParams, useNavigate } from 'react-router-dom';
import projectsData from '../data/projects.json';
import UserCard from '../components/ui/Cards/UserCard';
import CardSection from '../components/sections/CardSection';
import TagList from '../components/ui/TagList/TagList';
import type { TagData } from '../components/ui/TagList/TagList';
import Button from '../components/ui/Button/Button';
import { useActiveUsersByProject } from '../hooks/useUsers';
import { useAuth } from '../components/context/AuthContext';
import { useProjectFilters } from '../store/useProjectFilters';
import { formatAvailability, isFullyAvailable } from '../utils/formatAvailability';
import { mockUsers } from '../types/mockUser';

function Certain_Project() {

	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { userName } = useAuth();
	const project = projectsData.find(p => p.slug === id);
	const { data: activeUsers, isError, error } = useActiveUsersByProject(userName, project?.slug as string);
	// console.log("Active Users: ", activeUsers);
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
			if (isFullyAvailable(user.preferredDays)) return true;
			return user.preferredDays.some(day => selectedDays.includes(day));
		})
		.map(user => {
			const days = formatAvailability(user?.preferredDays);
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
			<div className="flex flex-col flex-1 p-10 gap-6">
				<div className="flex flex-row justify-between">
					<Button 
						size="sm"
						variant="tertiary"
						icon="arrowLeft"
						onClick={() => navigate(-1)}
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
