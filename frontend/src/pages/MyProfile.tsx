import Navbar from '../components/ui/Navbar/Navbar'
import Button from '../components/ui/Button/Button'
import CardSection from '../components/sections/CardSection'
import InfoCard from '../components/ui/Cards/InfoCard'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import { useAuth } from '../components/context/AuthContext'

function MyProfile() {

	const { userName } = useAuth();

  return (

		<section
			className="bg-background-neutral flex min-h-screen bg-cover bg-center bg-no-repeat"
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-16">
				<div className="flex flex-row gap-8 w-full">
					<div className="group relative h-50 w-50 rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
						style={{ backgroundImage: `url('profile.jpg')` }}>
						<Button 
							className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
							size="sm"
							variant="secondary"
							icon="edit"
							onClick={() => console.log("Profilbild geandert!")}
						>Edit</Button>
					</div>
					<div className="flex flex-col justify-center gap-3">
						<h1 className="text-title">pbohme</h1>
						<p className="text-subtitle mb-4">Pia Bohme</p>
						<div className="flex gap-2">
							<Button 
								size="md" 
								icon="message" 
								onClick={() => console.log("Profilbild geandert!")}
							>Message</Button>
							<Button 
								size="md"
								variant="secondary"
								icon="message" 
								onClick={() => console.log("Profilbild geandert!")}
							>Intra Profile</Button>
						</div>
					</div>
				</div>
				<CardSection title="Available for projects">
					<CardSection.Body viewMode="grid" columns={4}>
						<InfoCard
							image="rank.jpg"
							title="Hours per Week"
							description="20h"
						/>
						<InfoCard
							image="rank.jpg"
							title="Days available"
							description="4d"
						/>
						<InfoCard
							image="rank.jpg"
							title="Rank"
							description="5"
						/>
						<InfoCard
							image="blackhole.jpg"
							title="Blackhole"
							description="25.06.26"
						/>
					</CardSection.Body>
				</CardSection>
				<CardSection title="Recommended next projects">
					<CardSection.Body viewMode="grid" columns={2}>
						<ProjectCard
							image="pacman.jpg"
							layout="portrait"
							title="Pac Man"
							subtitle="One of our favourite games."
							tags={['2 People', 'Rank 5']}
							route="/certain_project"
							description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
						/>
						<ProjectCard
							image="https://imgs.search.brave.com/E8rpYue8Dc5qfulg6dmM2lD4Sjm8Iw8avIFyZi4o0DU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jYW1v/LmdpdGh1YnVzZXJj/b250ZW50LmNvbS9j/MjBjZjJlNmRmMGY0/YzJlZTdkMjk2MDgw/YTA4OTgyMWRmYjIw/M2Y1YTMxNWNjMjY1/ZjdmNjhjZGE4ZjFj/N2VjLzY4NzQ3NDcw/NzMzYTJmMmY2OTJl/Njk2ZDY3NzU3MjJl/NjM2ZjZkMmY3YTcx/NjM3MzVhNjY1OTJl/NzA2ZTY3"
							layout="portrait"
							title="Pac Man"
							subtitle="One of our favourite games."
							tags={['2 People', 'Rank 5']}
							route="/certain_project"
							description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
						/>
					</CardSection.Body>
				</CardSection>
			</div>
		</section>
  )
}

export default MyProfile
