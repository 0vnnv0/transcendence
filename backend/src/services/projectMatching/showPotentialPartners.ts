import { User } from "../../types/User.js";

function canMatchProjects(user: User, candidate: User): boolean {
	for (const project of user.nextProject) {
		for (const candidateProject of candidate.nextProject) {
			//hier fehlt logik: hat das projekt schon gemacht /
			//hat schon ein team geloggt --> rausfiltern!!

			// gleicher project name?
			if (project.name !== candidateProject.name) {
				continue;
			}

			//rank range
			const minRank = Math.max(0, user.rank -1);
			const maxRank = project.projectRank;

			const validRank =
			candidate.rank >= minRank && candidate.rank <= maxRank;

			if (!validRank) {
				continue;
			}

			// rank 6 special case
			if (project.projectRank === 6) {
				return true;
			}

			// old/new core muss matchen
			if (
				project.oldCore === candidateProject.oldCore &&
				project.newCore === candidateProject.newCore
			) {
				return true;
			}
		}
	}

	return false;
}

export function showPotentialPartners(
// hier dann: userID + auf database zugreifen
// und: projectID!! weil gibt manchmal 2 projecte pro rank.. 
	user: User,
	users: User[]
): User[] {
	// console.log("TARGET USER:");
	// console.log(user);

	const partners = users.filter((candidate) => {
		//nicht man selbst
		if (candidate.id === user.id) {
			return false;
		}
		//gleicher rank oder eins drunter
		const validRank = user.nextProject.some((project) => {
			return candidate.rank <= project.projectRank;
		})

		if (!validRank) {
			return false;
		}	

		return canMatchProjects(user, candidate);
	});

	// console.log("POTENTIAL PARTNERS:");
	// console.log(partners);

	return partners;
}