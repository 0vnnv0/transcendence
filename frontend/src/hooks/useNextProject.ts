// hooks/useNextProject.ts
import { useQuery } from '@tanstack/react-query';
import { fetchNextProject } from '../services/user.service';

export function useNextProject(userName: string | null) {
    return useQuery({
        queryKey: ['nextProject', userName], 
        
        queryFn: () => fetchNextProject(userName as string),
        
        enabled: !!userName && userName !== "Gast", 
    });
}