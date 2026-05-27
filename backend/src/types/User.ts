//DUMMIE
//"standard" user --> spaeter ersetzt durch daten aus der API

import { Project } from "./coreProjects.js";


export interface User {
	id: number;
	login: string;
	campus: string;
	rank: number;
	selectedIn: {
		month: number;
		year: number;
	}
	nextProject: Project[];

	preferredOnCampus?: boolean;
	hoursPerWeek?: number;
}