import { useQuery } from '@tanstack/react-query';
import { fetchAllProjects } from '../services/project.service';

export function useProjects() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: fetchAllProjects,
	});
}