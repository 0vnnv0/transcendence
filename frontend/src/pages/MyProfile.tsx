import Navbar from '../components/ui/Navbar/Navbar'
import EditButton from '../components/ui/EditButton/EditButton'
import ProjectCard from '../components/ui/Cards/ProjectCard'

function MyProfile() {
  return (
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundColor: "white" }}
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-10">
				<div className="relative inline-block">
				<img src="profile.jpg"
					className="w-full h-64 rounded-4xl object-cover">
				</img>
				<span className="absolute bottom-2 right-5 ">
					<EditButton onClick={() => console.log("Profilbild geandert!")}></EditButton>
				</span>
				</div>
				<h1 className="font-[Gasoek_One] text-5xl text-black">
					anschmit
				</h1>
				<div className="font-kyiv text-2xl">
				<h2>Information:</h2>
				<h2>Available for Projects:</h2>
				<div className="flex gap-2">
					<ProjectCard
						layout="portrait"
						image="allowed.png"
						title="webserv"
						subtitle='Why do URLs start with HTTP?'
						tags={['2 People', 'Rank 5']}
						description="This project is about writing your own HTTP server. You will be able to test it with an actual browser.
									HTTP is one of the most widely used protocols on the internet."
					/>
									<ProjectCard
						layout="portrait"
						image="allowed.png"
						title="ft_irc"
						subtitle='One of our favourite games.'
						tags={['2 People', 'Rank 5']}
						description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
					/>
				</div>
			</div>
			</div>
		</section>
  )
}

export default MyProfile