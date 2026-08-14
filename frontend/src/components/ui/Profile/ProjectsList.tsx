// components/profile/ProjectsList.tsx
import ProjectCard from '../Cards/ProjectCard'

interface ProjectsListProps {
	data: any;
	isLoading: boolean;
	isError: boolean;
	label: string;
}

function ProjectsList({ data, isLoading, isError, label }: ProjectsListProps) {
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

export default ProjectsList;
