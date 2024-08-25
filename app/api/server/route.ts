import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAndQueryUser, getLogs, getUsers, updateUser } from '../db-modal/db';

export async function POST(req: Request) {
  const res = Response;
  const { email, query, task, id, updatedData } = await req.json();
  if (!task) {
    return res.json({ message: "Invalid task" })
  }

  if (task === 1) {
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
  } else if (task === 2) {
    try {
      const response = await getUsers();
      if (!response) {
        return res.json({ userFound: false })
      }
      return res.json({ userFound: true, user: response })
    } catch (error) {
      console.error("Error getting users: ", error)
      return res.json({ message: "Internal server error" })
    }
  } else if (task === 3) {
    try {
      const response = await getLogs();
      if (!response) {
        return res.json({ logsFound: false })
      }
      return res.json({ logsFound: true, logs: response })
    } catch (error) {
      console.error("Error getting users: ", error)
      return res.json({ message: "Internal server error" })
    }
  } else if (task === 4) {
    try {
      if (!id || !updatedData) {
        return res.json({ message: 'Invalid request' });
      }
      const response = await updateUser(id, updatedData);
      return res.json({ userUpdated: response });
    } catch (error) {
      console.error("Error getting users: ", error)
      return res.json({ message: "Internal server error" })
    }
  } else {
    return res.json({ message: "Define some tasks to perform" })
  }
}
