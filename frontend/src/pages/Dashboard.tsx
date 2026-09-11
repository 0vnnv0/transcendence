import Navbar from '../components/ui/Navbar/Navbar'
import CardSection from '../components/sections/CardSection'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useAuth } from '../components/context/AuthContext';
import { useNextProject, useRecommendedProjects } from '../hooks/useProjects';
import { getProjectImage } from '../utils/projectImages';
import Button from '../components/ui/Button/Button';
import SearchBar from '../components/ui/Search/Search';

interface ProjectData {
	id: number;
	name: string;
	slug: string;
	image: string;
	description: string;
	projectRank: number;
	teamSize: {
		min: number;
		max: number;
	};
	keywords: string[];
}

// interface BackendResponse {
// 	login: string;
// 	projects: ProjectData[];
// }

function Dashboard() {
	const { userName } = useAuth();

	const { data: nextProjectData, isLoading: isNextLoading, isError: isNextError } = useNextProject(userName);

    const {
        data: recommendedData,
        isLoading: isRecLoading,
        isError: isRecError
    } = useRecommendedProjects(userName);

    const nextProject: ProjectData | undefined = nextProjectData?.projects?.[0];
	// const nextProject: ProjectData | undefined = projectsData[0];
	console.log('Next, ', nextProject)

    const recommendedProjects: ProjectData[] = recommendedData?.projects || [];
	// const recommendedProjects: ProjectData[] = projectsData ? projectsData.slice(1) : [];
	console.log('Recommended, ', recommendedProjects);
	let nextProjectContent;

	if (isNextLoading) {
			nextProjectContent = <p className="text-subtitle text-purple">Looking for project...</p>;
		} else if (isNextError) {
			nextProjectContent = <p className="text-subtitle text-red-500">[404] Error trying to connect with server</p>;
		} else if (nextProject) {
			const nrOfUsers = nextProject.teamSize.min == nextProject.teamSize.max ? `${nextProject.teamSize.max}` : `${nextProject.teamSize.min}-${nextProject.teamSize.max}`
			nextProjectContent = (
				<ProjectCard
					layout="landscape"
					image={getProjectImage(nextProject.slug)}
					title={nextProject.name}
					tags={[
						`${nrOfUsers} People`,
						...nextProject.keywords
					]}
					route={`/project/${nextProject.slug}`}
					description={nextProject.description}
				/>
			);
		} else {
			nextProjectContent = <p className="text-subtitle text-red-500">[404] Couldn't find the next project</p>;
		}
	let recommendedContent;

	if (isRecLoading) {
		recommendedContent = <p className="text-subtitle text-purple">Looking for recommendations... </p>;
	} else if (isRecError) {
		recommendedContent = <p className="text-subtitle text-red-500">Failed to load recommendations</p>;
	} else if (recommendedProjects.length === 0) {
		recommendedContent = (
			<p className="text-subtitle text-purple col-span-full">
				Congrats! 🎉 You are near to the end of your core curriculum.
			</p>
		);
	} else {
        recommendedContent = recommendedProjects.map((project: ProjectData) => {
			const nrOfUsers = project.teamSize.min == project.teamSize.max ? `${project.teamSize.max}` : `${project.teamSize.min}-${project.teamSize.max}`
			return (
				<ProjectCard
					key={project.id}
					layout="portrait"
					image={getProjectImage(project.slug)}
					title={project.name}
					subtitle={`Rank ${project.projectRank}`}
					tags={[
						`${nrOfUsers} People`,
						...project.keywords
					]}
					route={`/project/${project.slug}`}
					description={project.description}
				/>
        )});
    }

return (
        <section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
            <div className="md:w-70 flex-none">
                <Navbar />
            </div>
            <div className="flex flex-col flex-1 w-full p-5 md:p-10 gap-10">
				<div className="top-6 w-full flex md:hidden justify-between gap-4">
					<Button goBack={true} variant="tertiary" size="sm" icon="arrowLeft">Back</Button>
					<SearchBar />
				</div>
                <h1 className="text-title">
                    Hello again, {userName}!
                </h1>

                <CardSection title="Your next project available">
                    <CardSection.Body viewMode="list">
                        {nextProjectContent}
                    </CardSection.Body>
                </CardSection>
                <CardSection title="Recommended next projects">
                    <CardSection.Body viewMode="grid">
                        {recommendedContent}
                    </CardSection.Body>
                </CardSection>
            </div>
        </section>
    )
}

export default Dashboard
