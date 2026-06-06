import Navbar from '../components/ui/Navbar/Navbar'
import EditButton from '../components/ui/EditButton/EditButton'
import CardSection from '../components/sections/CardSection'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useAuth } from '../components/context/AuthContext';

function MyProfile() {

	const { userName } = useAuth();

  return (

		<section
			className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat"
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-10">
				<div className="relative inline-block">
					<img src="/profile.jpg"
						className="w-full h-64 rounded-4xl object-cover">
					</img>
					<span className="absolute bottom-2 right-5 ">
						<EditButton onClick={() => console.log("Profilbild geandert!")}></EditButton>
					</span>
				</div>
				<h1 className="text-title">{userName}</h1>
				<CardSection title="Available for projects">
					<CardSection.Body viewMode="grid">
						<ProjectCard
							layout="portrait"
							image="allowed.png"
							title="webserv"
							subtitle='Why do URLs start with HTTP?'
							tags={['2 People', 'Rank 5']}
							route="#"
							description="This project is about writing your own HTTP server. You will be able to test it with an actual browser.
										HTTP is one of the most widely used protocols on the internet."
						/>
						<ProjectCard
							layout="portrait"
							image="allowed.png"
							title="ft_irc"
							subtitle='One of our favourite games.'
							tags={['2 People', 'Rank 5']}
							route="#"
							description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
						/>
					</CardSection.Body>
				</CardSection>
			</div>
		</section>
  )
}

export default MyProfile
