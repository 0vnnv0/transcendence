export async function fetchUsers() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function fetchNextProject(userName: string) {
    const response = await fetch(`http://localhost:3000/users/${userName}/next-project/current`);
    if (!response.ok) {
        throw new Error("Unable to load project");
    }
    return response.json();
}