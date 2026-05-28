import Navbar from '../components/ui/Navbar/Navbar'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import projectsData from '../data/projects.json';
import { useState } from 'react';

function Projects() {
	const [userCore, setUserCore] = useState<'newCore' | 'oldCore'>('oldCore');
	const processedProjects = projectsData
	.filter((project) => {
		return project[userCore] === true;
	})
	.sort((a, b) => {
		return a.projectRank - b.projectRank;
	})

	return (
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundColor: "white" }} 
     	>
		  	<div className="w-70 flex-none">
			  	<Navbar />
		  	</div>
			<div className="flex flex-col flex-1 p-10 gap-10">				 
				 <h1 className="font-[Gasoek_One] text-6xl text-black">
			 		 Projects
			 	 </h1>
        	<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
				{processedProjects.map((project) => (
				<ProjectCard 
					layout="portrait"
					image="/success.png"
					title={project.name}
					subtitle="eat eat eat"
					tags={project.keywords}
					route={`/project/${project.slug}`}
					description={project.description}
				/>
			))}
	       	 </div>
		</div>
	</section>
  )
}

export default Projects