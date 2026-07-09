import Navbar from '../components/ui/Navbar/Navbar'
import CardSection from '../components/sections/CardSection'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useAuth } from '../components/context/AuthContext';
import { useNextProject } from '../hooks/useNextProject';

// interface ProjectData {
// 	id: number;
// 	name: string;
// 	slug: string;
// 	description: string;
// 	projectRank: number;
// 	teamSize: {
// 		min: number;
// 		max: number;
// 	};
// 	keywords: string[];
// }

// interface BackendResponse {
// 	login: string;
// 	projects: ProjectData[];
// }

// function Dashboard() {
// 	const { userName } = useAuth();

// 	const { data: backendData, isLoading, isError } = useNextProject(userName);
// 	const nextProject: ProjectData | undefined = backendData?.projects?.[0];
// 	let nextProjectContent;
	
// 	if (isLoading) {
// 			nextProjectContent = <p className="text-subtitle text-purple">Looking for project...</p>;
// 		} else if (isError) {
// 			nextProjectContent = <p className="text-subtitle text-red-500">[404] Error trying to connect with server</p>;
// 		} else if (nextProject) {
// 			nextProjectContent = (
// 				<ProjectCard
// 					layout="landscape"
// 					image="allowed.png" 
// 					title={nextProject.name}
// 					tags={[
// 						`${nextProject.teamSize.min}-${nextProject.teamSize.max} People`, 
// 						...nextProject.keywords
// 					]}
// 					route={`/project/${nextProject.slug}`}
// 					description={nextProject.description}
// 				/>
// 			);
// 		} else {
// 			nextProjectContent = <p className="text-subtitle text-red-500">[404] Couldn't find the next project</p>;
// 		}

// return (
//         <section className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat">
//             <div className="w-70 flex-none">
//                 <Navbar />
//             </div>
//             <div className="flex flex-col flex-1 p-10 gap-10">
//                 <h1 className="text-title">
//                     welcome to cluster fuck, {userName}!
//                 </h1>
                
//                 <CardSection title="Your next project">
//                     <CardSection.Body viewMode="list">
//                         {nextProjectContent}
//                     </CardSection.Body>
//                 </CardSection>
//                 <CardSection title="Recommended next projects">
//                     <CardSection.Body viewMode="grid">
//                         <ProjectCard
//                             layout="portrait"
//                             image="thumb.jpg"
//                             title="Codenames"
//                             subtitle="One of our favourite games."
//                             tags={['2 People', 'Rank 5']}
//                             route="/certain_project"
//                             description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
//                         />
//                         <ProjectCard
//                             layout="portrait"
//                             image="thumb.jpg"
//                             title="Blood on the Clocktower"
//                             subtitle="42 or brewdog"
//                             tags={['React', 'TypeScript']}
//                             route="/certain_project"
//                             description="Sadly there are a few annoying players around who scream to loud at times, which is why the game can be either fun or not."
//                         />
//                         <ProjectCard
//                             layout="portrait"
//                             image="thumb.jpg"
//                             title="Dixit"
//                             subtitle="Has beautiful images."
//                             tags={['3 People', 'Rank 3']}
//                             route="/certain_project"
//                             description="The beautiful images are sometimes very confusing though, how does someone come up with these ideas?"
//                         />
//                     </CardSection.Body>
//                 </CardSection>
//             </div>
//         </section>
//     )
import { useUserProfile } from '../hooks/useUsers';

function Dashboard() {
	const { userName } = useAuth();
	const { data: profile, isLoading, isError } = useUserProfile(userName !== "Guest" ? userName : null);

	// if (isLoading) return <div>Loading full profile...</div>;
	// if (isError || !profile) return <div>Error loading profile data.</div>;

	console.log('User Profile:', profile);

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
				<CardSection title="Your next project in Rank 3">
					<CardSection.Body viewMode="list">
						<ProjectCard
							layout="landscape"
							image="thumb.jpg"
							title="Codenames"
							subtitle='One of our favourite games.'
							tags={['2 People', 'Rank 5']}
							route='/certain_project'
							description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
						/>
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
