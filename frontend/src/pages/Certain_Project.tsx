import Navbar from '../components/ui/Navbar/Navbar'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import projectsData from '../data/projects.json';
import UserCard from '../components/ui/Cards/UserCard';
import CardSection from '../components/sections/CardSection';
import TagList from '../components/ui/TagList/TagList';
import type { TagData } from '../components/ui/TagList/TagList';
import Button from '../components/ui/Button/Button';
import ViewModeToggle from '../components/ui/Toggle/Toggle';

function formatProjectTitle(name: string): string {
	let title = name;
	if (name.startsWith('ft_')) {
		title = name.slice(3);
	}
	return title.charAt(0).toUpperCase() + title.slice(1);
}

type ViewMode = 'grid' | 'list';

function Certain_Project() {

	const { id } = useParams<{ id: string }>();
	const project = projectsData.find(p => p.slug === id);
	const [viewMode, setViewMode] = useState<ViewMode>('grid');
	const layout = viewMode === 'grid' ? 'portrait' : 'landscape';

	console.log('project ', project);

	// edit user data
	const title = formatProjectTitle(`${project?.name}`);
	const teamSize = (project?.teamSize?.min === project?.teamSize?.max) ? project?.teamSize?.min : `${project?.teamSize?.min} - ${project?.teamSize?.max}`;
	const tags: TagData[]  = [
		{ icon: 'clock', description: `${project?.estimatedHours} hours` },
		{ icon: 'smiley', description:  `${teamSize} people` },
		{ icon: 'flame', description: `${project?.keywords?.[1]}` },
	];

	if (!project) {
		return <div className="p-10 text-white text-2xl">Project not found!</div>;
	}
	return (
		<section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-6">
				{project?.keywords && (
					<div className="absolute top-4 right-4">
						<TagList tags={tags}/>
					</div>
				)}
				<Button 
					size="sm"
					variant="secondary"
					icon="arrowLeft"
				>Back</Button>
				<h1 className="font-[Gasoek_One] text-6xl text-black">
					{title}
				</h1>
				<p className="text-paragraph-big-bold">{project.description}</p>
				<CardSection title="Feed">
					<CardSection.Body viewMode="list">
						<UserCard
							title="junruh"
							layout="landscape"
							image="/profile.jpg"
							ctaText='Contact'
							tags={['20h/Week', 'Mo, Mi, Fr']}
						/>
					</CardSection.Body>
				</CardSection>
				<ViewModeToggle viewMode={viewMode} onToggle={setViewMode} />
				<CardSection title="Available Students">
					<CardSection.Body viewMode={viewMode}>
						<UserCard
							title="junruh"
							layout={layout}
							image="/profile.jpg"
							ctaText='Contact'
							tags={['20h/Week', 'Mo, Mi, Fr']}
						/>
						<UserCard
							title="junruh"
							layout={layout}
							image="/profile.jpg"
							ctaText='Contact'
							tags={['20h/Week', 'Mo, Mi, Fr']}
						/>
						<UserCard
							title="junruh"
							layout={layout}
							image="/profile.jpg"
							ctaText='Contact'
							tags={['20h/Week', 'Mo, Mi, Fr']}
						/>
						<UserCard
							title="junruh"
							layout={layout}
							image="/profile.jpg"
							ctaText='Contact'
							tags={['20h/Week', 'Mo, Mi, Fr']}
						/>
						<UserCard
							title="junruh"
							layout={layout}
							image="/profile.jpg"
							ctaText='Contact'
							tags={['20h/Week', 'Mo, Mi, Fr']}
						/>
					</CardSection.Body>
				</CardSection>
			</div>
		</section>
  )
}

export default Certain_Project
