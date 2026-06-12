import { useState, useEffect } from 'react';
import Navbar from '../components/ui/Navbar/Navbar'
import CardSection from '../components/sections/CardSection'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useAuth } from '../components/context/AuthContext';

interface ProjectData {
	id: number;
	name: string;
	slug: string;
	description: string;
	projectRank: number;
	teamSize: {
		min: number;
		max: number;
	};
	keywords: string[];
}

interface BackendResponse {
	login: string;
	projects: ProjectData[];
}

function Dashboard() {
	const { userName } = useAuth();

	const [nextProject, setNextProject] = useState<ProjectData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function fetchNextProject() {
			if (!userName || userName === "Gast")
				return;

			try {
				const response = await fetch(`http://localhost:3000/users/${userName}/next-project/current`);

				if (!response.ok) {
					throw new Error("Unable to load project");
				}
				const data: BackendResponse = await response.json();

				if (data.projects && data.projects.length > 0) {
					setNextProject(data.projects[0]);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchNextProject();
	}, [userName]);

	return (
		<section
			className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat"
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-10">
				<h1 className="text-title">
					welcome to cluster fuck, {userName}!
				</h1>
				<CardSection title="Your next project">
					<CardSection.Body viewMode="list">
                        {isLoading ? (
                            <p className="text-white text-paragraph">Looking for project...</p>
                        ) : nextProject ? (
                            <ProjectCard
                                layout="landscape"
                                image="allowed.png" 
                                title={nextProject.name}
                                tags={[
                                    `${nextProject.teamSize.min}-${nextProject.teamSize.max} People`, 
                                    ...nextProject.keywords
                                ]}
                                route={`/project/${nextProject.slug}`}
                                description={nextProject.description}
                            />
                        ) : (
                            <p className="text-red-400 text-paragraph-bold">[404] Couldn't find the next project</p>
                        )}
					</CardSection.Body>
				</CardSection>
				<CardSection title="Recommended next projects">
					<CardSection.Body viewMode="grid">
						<ProjectCard
							layout="portrait"
							image="thumb.jpg"
							title="Codenames"
							subtitle="One of our favourite games."
							tags={['2 People', 'Rank 5']}
							route="/certain_project"
							description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
						/>
						<ProjectCard
							layout="portrait"
							image="thumb.jpg"
							title="Blood on the Clocktower"
							subtitle="42 or brewdog"
							tags={['React', 'TypeScript']}
							route="/certain_project"
							description="Sadly there are a few annoying players around who scream to loud at times, which is why the game can be either fun or not."
						/>
						<ProjectCard
							layout="portrait"
							image="thumb.jpg"
							title="Dixit"
							subtitle="Has beautiful images."
							tags={['3 People', 'Rank 3']}
							route="/certain_project"
							description="The beautiful images are sometimes very confusing though, how does someone come up with these ideas?"
						/>
					</CardSection.Body>
				</CardSection>
			</div>
		</section>
	)
}

export default Dashboard
