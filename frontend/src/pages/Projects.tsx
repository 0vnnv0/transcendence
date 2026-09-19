import ProjectCard from '../components/ui/Cards/ProjectCard';
import { useAuthorize } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import CardSection from '../components/sections/CardSection';
import { getProjectImage } from '../utils/projectImages';
import SearchBar from '../components/ui/Search/Search';
import Button from '../components/ui/Button/Button';
import PageLayout from './PageLayout';

function Projects() {
	// const { userName, userRank, newCore } = useAuthorize();

	const newCore = false;
	const { data: allProjects, isLoading, isError } = useProjects();

	let content;
	if (isLoading) {
		content = <p className="text-subtitle text-purple">Loading projects...</p>
	} else if (isError || !allProjects) {
		content = <p className="text-subtitle text-red-500">[404] Error trying to load projects</p>
	//pbohme
	} else if (allProjects.status === "completed") {
        content = (
            <p className="text-subtitle text-green-500">
                All group projects completed!
            </p>
        );	
	} else {
		const displayProjects = allProjects
		.filter((project: any) => newCore ? project.newCore : project.oldCore)
		.sort((a: any, b: any) => a.projectRank - b.projectRank);

		if (displayProjects.length === 0) {
            content = <p className="text-subtitle">No projects found</p>;
        } else {
            content = (
				<>
					{displayProjects.map((project: any) => (
						<ProjectCard 
							key={project.id}
							layout="portrait"
							image={getProjectImage(project.slug)}
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
    }


	return (
		<PageLayout>
				<div className="top-6 w-full flex md:hidden justify-between gap-4">
					<Button goBack={true} variant="tertiary" size="sm" icon="arrowLeft">Back</Button>
					<SearchBar />
				</div>						 
				 <h1 className="text-title text-black">
			 		 Projects
			 	 </h1>
				 <CardSection title="All projects">
					<CardSection.Body viewMode="grid">
						{content}
					</CardSection.Body>
				</CardSection>
		</PageLayout>
  );
}

export default Projects
