export async function fetchAllProjects() {
	const response = await fetch('/api/projects');
	console.log('Response: ', response);
	if (!response.ok) {
		throw new Error('Projects not loading');
	}
	try {
		const text = await response.text();
		console.log('Raw text from /projects:', text);
		return JSON.parse(text);
	} catch (err) {
		console.error('Failed to parse response:', err);
		throw err;
	}
}
