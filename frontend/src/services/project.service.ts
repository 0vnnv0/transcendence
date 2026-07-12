export async function fetchAllProjects() {
	const response = await fetch('http://localhost:3000/projects');
	if (!response.ok) {
		throw new Error('Projects not loading');
	}
	return response.json();
}