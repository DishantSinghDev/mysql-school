// Function to run Query
export const runQuery = async (email: string, query: string) => {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, query, task: 1 }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Function to get Users
export const getUsers = async () => {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task: 2 }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Function to get Logs
export const getLogs = async () => {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task: 3 }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Function to update a user
export const updateUser = async (id: number, updatedData: { username?: string; role?: string }) => {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, updatedData, task: 4 }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

interface User {
  username: string;
  email: string;
  password: string;
  db_name: string;
  role: string;
}

// Function to create user
export const addUser = async (userData: User) => {
  const response = await fetch('/api/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userData, task: 5 }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};