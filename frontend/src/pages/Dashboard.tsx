import Navbar from '../components/ui/Navbar/Navbar'
import UserCard from '../components/ui/Cards/UserCard'
import ProjectCard from '../components/ui/Cards/ProjectCard'
import PinCard from '../components/ui/Cards/PinCard'

function Dashboard() {

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
					welcome to cluster fuck
				</h1>
				<ProjectCard
						layout="landscape"
						image="thumb.jpg"
						title="Pac Man"
						subtitle='Eat as many Linsenwaffeln as you can.'
						tags={['2 People', 'Rank 5']}
						route='/certain_project'
						description="This is a very cool project that many people can collaborate on. A classic, a game. Everyone knows and loves it."
				/>
				<UserCard
						layout="landscape"
						image="thumb.jpg"
						title="hreusing"
						tags={['20h/Week', 'Mo, Mi, Fr']}
						ctaText='Kontaktieren'
				/>
				<PinCard
						image="thumb.jpg"
						altText="User Image"
						username="caruso"
						message="Hi ich suche nach anderen Hunden die Bock haben mit mir Pacman zu machen. MAXXXXX????."
						ctaText='Kontaktieren'
				/>
				<div className="flex gap-2">
					<ProjectCard
						layout="portrait"
						image="thumb.jpg"
						title="Codenames"
						subtitle='One of our favourite games.'
						tags={['2 People', 'Rank 5']}
						route='/certain_project'
						description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
					/>
					<ProjectCard
						layout="portrait"
						image="thumb.jpg"
						title="Blood on the Clocktower"
						subtitle='42 or brewdog'
						tags={['React', 'TypeScript']}
						route='/certain_project'
						description="Sadly there are a few annoying players around who scream to loud at times, which is why the game can be either fun or not."
					/>
					<ProjectCard
						layout="portrait"
						image="thumb.jpg"
						title="Dixit"
						subtitle='Has beautiful images.'
						tags={['3 People', 'Rank 3']}
						route='/certain_project'
						description="The beautiful images are sometimes very confusing though, how does someone come up with these ideas?"
					/>
				</div>
				<div className="flex gap-2">
					<UserCard
						layout="portrait"
						image="thumb.jpg"
						title="junruh"
						tags={['25h/Week', 'Mi, Do, Fr']}
						ctaText='Kontaktieren'
					/>
					<UserCard
						layout="portrait"
						image="thumb.jpg"
						title="pbohme"
						tags={['38h/week', 'Mo, Di, Do, Fr']}
						ctaText='Kontaktieren'
					/>
					<UserCard
						layout="portrait"
						image="thumb.jpg"
						title="anschmit"
						tags={['26h/week', 'Mo, Di, Mi, Do']}
						ctaText='Kontaktieren'
					/>
				</div>
			</div>
		</section>
	)
}

export default Dashboard
