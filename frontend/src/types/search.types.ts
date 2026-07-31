export interface SearchResult {
	id: number;
	title: string;
	type: 'user' | 'project';
	url: string;
}