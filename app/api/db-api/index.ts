export const runQuery = async (email: string, query: string) => {
  const response = await fetch('/api/db-backend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, query }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}