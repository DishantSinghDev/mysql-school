import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAndQueryUser } from '../db-modal/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, query } = req.body;

  if (!email || !query) {
    return res.status(400).json({ message: 'Email and query are required' });
  }

  try {
    // Perform your operations here (e.g., authentication, database queries)
    // Example: Authenticate user
    const response = await fetchAndQueryUser(email, query);

    if (!response) {
      return res.status(401).json({ queryRan: false });
    }

    // Send success response
    return res.status(200).json({ queryRan: true, response });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Example function to authenticate user (replace with your actual logic)
async function authenticateUser(email: string, password: string) {
  // Replace with your actual authentication logic
  if (email === 'test@example.com' && password === 'password123') {
    return { id: 1, email };
  }
  return null;
}