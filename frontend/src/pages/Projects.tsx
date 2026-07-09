import Navbar from '../components/ui/Navbar/Navbar';
import ProjectCard from '../components/ui/Cards/ProjectCard';
import { useAuthorize } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';

function Projects() {
	// const { userName, userRank, newCore } = useAuthorize();

	const newCore = false;
	const { data: allProjects, isLoading, isError } = useProjects();

	let content;
	if (isLoading) {
		content = <p className="text-subtitle text-purple">Loading projects...</p>
	} else if (isError || !allProjects) {
		content = <p className="text-subtitle text-red-500">[404] Error trying to load projects</p>
	} else {
		const displayProjects = allProjects
		.filter((project: any) => newCore ? project.newCore : project.oldCore)
		.sort((a: any, b: any) => a.projectRank - b.projectRank);

		if (displayProjects.length === 0) {
            content = <p className="text-subtitle">No projects found</p>;
        } else {
            content = (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    {displayProjects.map((project: any) => (
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
                </div>
            );
        }
    }


	return (
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundColor: "white" }} 
     	>
		  	<div className="w-70 flex-none">
			  	<Navbar />
		  	</div>
			<div className="flex flex-col flex-1 p-10 gap-10">				 
				 <h1 className="text-title text-black">
			 		 Projects
			 	 </h1>
        	<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
				{content}
	       	 </div>
		</div>
	</section>
  );
}

export default Projects