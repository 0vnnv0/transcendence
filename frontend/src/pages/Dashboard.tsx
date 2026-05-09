import Navbar from '../components/ui/Navbar/Navbar'
import Card from '../components/ui/Card/Card'

function Dashboard() {

	return (
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url('background_inapp.jpg')" }}
		>
			<div className="w-70 flex-none">
				<Navbar />
			</div>
			<div className="flex flex-col flex-1 p-10 gap-10">
				<h1 className="font-[Gasoek_One] text-6xl text-orange-500">
					welcome to cluster fuck
				</h1>
				<div className="flex gap-2">
					<Card
						type="Project"
						layout="Portrait"
						image="thumb.jpg"
						title="Open Source Tool"
						subtitle='This is a subtitle'
						tags={['React', 'TypeScript']}
						description="A cool tool for devs."
						ctaText='Kontaktieren'
					/>
					<Card
						type="Project"
						layout="Portrait"
						image="thumb.jpg"
						title="Open Source Tool"
						subtitle='This is a subtitle'
						tags={['React', 'TypeScript']}
						description="A cool tool for devs."
						ctaText='Kontaktieren'
					/>
					<Card
						type="Project"
						layout="Portrait"
						image="thumb.jpg"
						title="Open Source Tool"
						subtitle='This is a subtitle'
						tags={['React', 'TypeScript']}
						description="A cool tool for devs."
						ctaText='Kontaktieren'
					/>
				</div>
			</div>
		</section>
	)
}

export default Dashboard
