import Navbar from '../components/ui/Navbar/Navbar'
import EditButton from '../components/ui/EditButton/EditButton'
import CardSection from '../components/sections/CardSection'
import InfoCard from '../components/ui/Cards/InfoCard'
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
					<img src="profile.jpg"
						className="w-full h-64 rounded-4xl object-cover">
					</img>
					<span className="absolute bottom-2 right-5 ">
						<EditButton onClick={() => console.log("Profilbild geandert!")}></EditButton>
					</span>
				</div>
				<h1 className="text-title">{userName}</h1>
				<CardSection title="Available for projects">
					<CardSection.Body viewMode="grid" columns={4}>
						<InfoCard
							image="rank.jpg"
							title="Std / Woche"
							description="20h"
						/>
						<InfoCard
							image="rank.jpg"
							title="Tage anwesend"
							description="4"
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
						<InfoCard
							image="rank.jpg"
							title="Std / Woche"
							description="20h"
						/>
						<InfoCard
							image="rank.jpg"
							title="Tage anwesend"
							description="4"
						/>
					</CardSection.Body>
				</CardSection>
			</div>
		</section>
  )
}

export default MyProfile
