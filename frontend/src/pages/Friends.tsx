import Navbar from '../components/ui/Navbar/Navbar'


function Friends() {
    
    return (
		<section
			className="flex min-h-screen bg-cover bg-center bg-no-repeat"
			style={{ backgroundColor: "white" }} 
     	>
		  	<div className="w-70 flex-none">
			  	<Navbar />
		  	</div>
			<div className="flex flex-col flex-1 p-10 gap-10">				 
				 <h1 className="text-title text-black">
			 		 Your friendslist
			 	 </h1>
			</div>
	</section>
  );
}

export default Friends