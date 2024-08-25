import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAndQueryUser } from '../db-modal/db';

export async function POST(req: Request) {
  const { email, query } = await req.json();
  const res = Response;

  if (!email || !query) {
    return res.json({ message: 'Invalid request' });
  }

  try {
    // Perform your operations here (e.g., authentication, database queries)
    // Example: Authenticate user
    const response = await fetchAndQueryUser(email, query);

    if (!response) {
      return res.json({ queryRan: false });
    }

    // Send success response
    return res.json({ queryRan: true, response });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.json({ message: 'Internal server error' });
  }
}
