import Navbar from '../components/ui/Navbar/Navbar'
import ProjectCard from '../components/ui/Cards/ProjectCard'


function Projects() {
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
              Projects
				  </h1>
        	<div className="flex gap-2">
            <ProjectCard 
              layout="portrait"
              image="profile.jpg"
              title="pacMan"
              subtitle="eat eat eat"
              tags={['2 People', 'Rank 4']}
              description="this is a fun game"
            />
            <ProjectCard 
              layout="portrait"
              image="profile.jpg"
              title="pacMan"
              subtitle="eat eat eat"
              tags={['2 People', 'Rank 4']}
              description="this is a fun game"
            />
            <ProjectCard 
              layout="portrait"
              image="profile.jpg"
              title="pacMan"
              subtitle="eat eat eat"
              tags={['2 People', 'Rank 4']}
              description="this is a fun game"
            />
          </div>
          				<div className="flex gap-2">
					<ProjectCard
						layout="portrait"
						image="profile.jpg"
						title="ft_irc"
						subtitle='One of our favourite games.'
						tags={['2 - 3 People', 'Rank 5']}
						description="Who can guess the Hammerhai? Maybe some don't wear a crown but rather a hat."
					/>
					<ProjectCard
						layout="portrait"
						image="thumb.jpg"
						title="webserv"
						subtitle='42 or brewdog'
						tags={['2 - 3 People', 'Rank 5']}
						description="Sadly there are a few annoying players around who scream to loud at times, which is why the game can be either fun or not."
					/>
					<ProjectCard
						layout="portrait"
						image="thumb.jpg"
						title="Transcendence"
						subtitle='Has beautiful images.'
						tags={['5 People', 'Rank 6']}
						description="The beautiful images are sometimes very confusing though, how does someone come up with these ideas?"
					/>
				</div>
        </div>
	</section>
  )
}

export default Projects