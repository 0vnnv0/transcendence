import { useParams } from 'react-router-dom';
import projectsData from '../data/projects.json';
import UserCard from '../components/ui/Cards/UserCard';
import CardSection from '../components/sections/CardSection';
import TagList from '../components/ui/TagList/TagList';
import type { TagData } from '../components/ui/TagList/TagList';
import { useActiveUsersByProject, useUserProfile } from '../hooks/useUsers';
import { useAuth } from '../components/context/AuthContext';
import { useProjectFilters } from '../store/useProjectFilters';
import { formatAvailability } from '../utils/formatAvailability';
import { getProjectImage } from '../utils/projectImages';
import { formatProjectName } from '../utils/formatProjectName';
import { useStartChat } from '../hooks/useChat';
import SearchBar from '../components/ui/Search/Search';
import Button from '../components/ui/Button/Button';
import PageLayout from './PageLayout';


function Certain_Project() {

	const { id } = useParams<{ id: string }>();
	const { userName, userId: currentUserId } = useAuth();
	const { mutate: startChat } = useStartChat();

	const {data: currentUser } = useUserProfile(userName);
	const project = projectsData.find(p => p.slug === id);

	const { data: activeUsers, isError, error, isLoading } = useActiveUsersByProject(userName, project?.slug as string);	
	
	const { viewMode, days: selectedDays, rank: selectedRanks } = useProjectFilters();
	
	const startRank = Math.max(1, (currentUser?.currentRank ?? 1) - 1);
	const endRank = project?.projectRank ?? currentUser?.currentRank ?? 1;

	const rankOptions = Array.from(
		{ length: Math.max(0, endRank - startRank + 1) },
		(_, i) => ({ label: String(startRank + i), value: `Rank ${startRank + i}` })
	);

	const visibleRankValues = rankOptions.map((o) => o.value);
	const activeRanks = selectedRanks.filter((r) => visibleRankValues.includes(r));

	const layout = viewMode === 'grid' ? 'portrait' : 'landscape';

	const teamSize = (project?.teamSize?.min === project?.teamSize?.max) ? project?.teamSize?.min : `${project?.teamSize?.min} - ${project?.teamSize?.max}`;
	const projectTags: TagData[]  = [
		{ icon: 'clock', description: `${project?.estimatedHours} hours` },
		{ icon: 'smiley', description:  `${teamSize} people` },
		{ icon: 'flame',
			description: project?.keywords?.[0] !== 'Group'
				? `${project?.keywords?.[0]}`
				: `${project?.keywords?.[1]}`,
		},
	];

		const availableUsers = (activeUsers ?? []).filter(user => {
			const dayMatch =
				selectedDays.length === 0 ||
				(user?.availability?.preferredDays?.some(day => selectedDays.includes(day)) ?? false);

			const rankMatch =
				activeRanks.length === 0 ||
				 activeRanks.includes(`Rank ${user.currentRank}`);

			return dayMatch && rankMatch;
		})
		.map(user => {
			const days = formatAvailability(user?.availability?.preferredDays);
			const userTags: TagData[] = [
				{ icon: 'trophy', description: `Rank ${user?.currentRank}` },
				{ icon: 'clock', description: days },
			];

			return (
				<UserCard
					key={user.id}
					username={user.login}
					layout={layout}
					friendship={user?.isFriend}
					avatarUrl={user.customAvatar as string || user.avatarUrl as string}
					ctaText="Contact"
					tags={userTags}
					onCtaClick={() => currentUserId && startChat({ currentUserId, targetUserId: user.id })}
				/>)
	});

	if (!project) {
		return <div className="p-10 text-white text-2xl">Project not found!</div>;
	}

	return (
		<PageLayout>
			<div className="z-0 absolute top-0 left-0 right-0 h-100 bg-linear-to-b from-[#ffccb9] to-background-neutral" />
			<div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-10 border-b border-background-dark pb-10 z-10 justify-start">
				<div className="top-6 w-full flex md:hidden justify-between gap-4">
					<Button goBack={true} variant="tertiary" size="sm" icon="arrowLeft">Back</Button>
					<SearchBar />
				</div>
				<img
					src={getProjectImage(project?.slug)}
					alt={`${project?.slug} project image`}
					className="object-cover rounded-3xl w-full lg:w-70 max-h-70 lg:max-h-full lg:min-h-70 h-full border border-black"
				/>
				<div className="flex flex-col justify-between gap-6 lg:gap-16 w-full max-w-195 lg:py-2 min-w-0">
					<div className="flex flex-start">
						{project?.keywords && (
							<TagList tags={projectTags}/>
						)}
					</div>
					<div>
						<h1 className="font-[Gasoek_One] break-all w-full text-5xl lg:text-6xl text-black mb-2 md:mb-3">
							{formatProjectName(project?.name)}
						</h1>
						<p className="text-paragraph-big-bold">{project.description}</p>
					</div>
				</div>	
			</div>

			<CardSection title={`Available Students (${availableUsers?.length})`} filter rankOptions={rankOptions} isError={isError}>
				<CardSection.Body viewMode={viewMode}>
					{isLoading ? null : availableUsers?.length > 0 ? (
						availableUsers
					) : (
						<p className="text-subtitle text-red-500 col-span-full">No users for the selected filters found.</p>
					)}
				</CardSection.Body>
			</CardSection>

			{isError && 
				<p className="text-subtitle text-red-500">{error instanceof Error ? error.message : 'Something went wrong'}</p>
			}
		</PageLayout>
  )
}

export default Certain_Project
