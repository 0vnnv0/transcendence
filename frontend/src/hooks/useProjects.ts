import { useQuery } from '@tanstack/react-query';
import { fetchAllProjects } from '../services/project.service';
import { fetchNextProject, fetchRecommendedProjects } from '../services/user.service';

export function useProjects() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: fetchAllProjects,
	});
}

export function useNextProject(userName: string | null) {
	return useQuery({
		queryKey: ['nextProject', userName], 
		
		queryFn: () => fetchNextProject(userName as string),
		
		enabled: !!userName && userName !== "Gast", 
	});
}

export function useRecommendedProjects(userName: string | null) {
	return useQuery({
		queryKey: ['recommendedProjects', userName],
		queryFn: () => fetchRecommendedProjects(userName as string),
		enabled: !!userName,
	});
}
