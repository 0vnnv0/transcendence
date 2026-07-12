import Navbar from '../components/ui/Navbar/Navbar'
import { useParams } from 'react-router-dom';
import projectsData from '../data/projects.json';
import UserCard from '../components/ui/Cards/UserCard';

function Certain_Project() {

	const { id } = useParams<{ id: string }>();
	const project = projectsData.find(p => p.slug === id);

	if (!project) {
		return <div className="p-10 text-white text-2xl">Project not found!</div>;
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
				<h1 className="font-[Gasoek_One] text-6xl text-black">
					Welcome to {project.name}
				</h1>
				<p className="text-subtitle">{project.description}</p>
				<div className="flex gap-4 font-bold text-gray-500">
                    <span>XP: {project.xpPoints}</span>
                    <span>|</span>
                    <span>about {project.estimatedHours} hours</span>
					<span>|</span>
					<span>Skills: {project.skills}</span>
					<span>|</span>
					<span>Keywords: {project.keywords[1]}</span>
                </div>
				<h2 className="font-[Gasoek_One] text-3xl">Feed</h2>
				<UserCard 
				title="junruh"
					layout="landscape"
					image="/profile.jpg"
					ctaText='Contact'
					tags={['20h/Week', 'Mo, Mi, Fr']}
				/>
				</div>
		</section>
  )
}

export default Certain_Project