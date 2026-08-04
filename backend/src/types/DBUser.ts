import { ActiveProject } from "./userProjects.js";

export type DBUser = {
	completedProjects: string[];
	activeProjects: ActiveProject[];
}