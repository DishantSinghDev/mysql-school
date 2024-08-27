import { NextApiRequest, NextApiResponse } from 'next';
import { addUser, deleteUser, fetchAndQueryUser, getLogs, getUsers, updateUser } from '../db-modal/db';

export async function POST(req: Request) {
  const res = Response;
  const { email, query, task, id, updatedData, userData } = await req.json();
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
      console.error("Error getting logs: ", error)
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
      console.error("Error updating users: ", error)
      return res.json({ message: "Internal server error" })
    }
  } else if (task === 5) {
    try {
      if (!userData) {
        return res.json({ message: 'Invalid request' });
      }
      const response = await addUser(userData);
      if (!response) {
        return res.json({userAdded: false})
      }
      return res.json({ userAdded: true, response });
    } catch (error) {
      console.error("Error adding users: ", error)
      return res.json({ message: "Internal server error" })
    }
  } else if (task === 6) {
    try {
      if (!email) {
        return res.json({ message: 'Invalid request' });
      }
      const response = await deleteUser(email);
      if (!response) {
        return res.json({userDeleted: false})
      }
      return res.json({ userDeleted: true, response });
    } catch (error) {
      console.error("Error deleting user: ", error)
      return res.json({ message: "Internal server error" })
    }
  } else {
    return res.json({ message: "Define some tasks to perform" })
  }
}
