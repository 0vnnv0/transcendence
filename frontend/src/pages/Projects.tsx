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
              image="success.png"
              title="pacMan"
              subtitle="eat eat eat"
              tags={['2 People', 'Rank 4']}
              description="this is a fun game"
            />
            <ProjectCard 
              layout="portrait"
              image="success.png"
              title="pacMan"
              subtitle="eat eat eat"
              tags={['2 People', 'Rank 4']}
              description="this is a fun game"
            />
            <ProjectCard 
              layout="portrait"
              image="allowed.png"
              title="pacMan"
              subtitle="eat eat eat"
              tags={['2 People', 'Rank 4']}
              description="this is a fun game"
            />
          </div>
        	<div className="flex gap-2">
					<ProjectCard
						layout="portrait"
						image="allowed.png"
						title="ft_irc"
						subtitle='Internet Relay Chat'
						route="/project/ft_irc"
						tags={['2 - 3 People', 'Rank 5']}
						description="This project is about creating your own IRC server.
									You will use an actual IRC client to connect to your server and test it"
					/>
					<ProjectCard
						layout="portrait"
						image="forbidden.png"
						title="webserv"
						subtitle='Why do URLs start with HTTP?'
						tags={['2 - 3 People', 'Rank 5']}
						route="/project/webserv"
						description="This project is about writing your own HTTP server. You will be able to test it with an actual browser.
									HTTP is one of the most widely used protocols on the internet."
					/>
					<ProjectCard
						layout="portrait"
						image="forbidden.png"
						title="Transcendence"
						subtitle='Surprise.'
						tags={['5 People', 'Rank 6']}
						route="/project/transcendence"
						description="This project involves undertaking tasks you have never done before.
									Remember the beginning of your journey in computer science.
									Look at you now; it’s time to shine!"
					/>
				</div>
        </div>
	</section>
  )
}

export default Projects