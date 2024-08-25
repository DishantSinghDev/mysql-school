import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config(); // Load environment variables from a .env file

const port = 3306; // Default MySQL port

// Remote MySQL server connection configuration
const remoteConnectionConfig = {
  host: process.env.REMOTE_DB_HOST,
  user: process.env.REMOTE_DB_USER,
  password: process.env.REMOTE_DB_PASSWORD,
  port: port,
};

// Connection configuration for ds-sps database
const dsSpsConfig = {
  host: process.env.REMOTE_DB_HOST,
  user: process.env.REMOTE_DB_USER,
  password: process.env.REMOTE_DB_PASSWORD,
  port: port,
  database: 'ds_sps',
};

// Function to create logs table and insert a log
export async function saveLogs(log: string, dbName: string) {
  const connection = await mysql.createConnection(dsSpsConfig).then((connection) => {
    console.log('Connected to the remote MySQL server.');
    return connection;
  });

  try {
    // Create the logs table if it doesn't exist
    await connection.query(
      `CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        db_name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );

    // Insert a log
    await connection.query('INSERT INTO logs (message) VALUES (?)', [dbName, log]);
    return true;
  } catch (error: any) {
    console.error('Error creating logs table or inserting a log:', error);
    return false;
  } finally {
    await connection.end();
  }
}

// Function to get logs
export async function getLogs() {
  const connection = await mysql.createConnection(dsSpsConfig);

  try {
    // Fetch all logs
    const [rows] = await connection.query('SELECT * FROM logs');
    return rows;
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return [];
  } finally {
    await connection.end();
  }
}

// Function to get all the users
export async function getUsers() {
  const connection = await mysql.createConnection(dsSpsConfig);

  try {
    // Fetch all users
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return [];
  } finally {
    await connection.end();
  }
}

// Function to add a new user
export async function addUser(newUser: any) {
  const connection = await mysql.createConnection(dsSpsConfig);

  try {
    // Insert a new user
    await connection.query(
      'INSERT INTO users (username, email, password, db_name, role) VALUES (?, ?, ?, ?, ?)',
      [newUser.username, newUser.email, newUser.password, newUser.db_name, newUser.role]
    );

    return true;
  } catch (error: any) {
    console.error('Error adding a new user:', error);
    return false;
  } finally {
    await connection.end();
  }
}

// Function to update user
// Function to update user information
export async function updateUser(id: number, updatedUser: Partial<{ username: string; email: string; password: string; db_name: string; role: string; }>) {
  const connection = await mysql.createConnection(dsSpsConfig);

  try {
    // Construct the SQL query dynamically based on the fields that need to be updated
    let query = 'UPDATE users SET ';
    const fields: string[] = [];
    const values: any[] = [];

    if (updatedUser.username) {
      fields.push('username = ?');
      values.push(updatedUser.username);
    }
    if (updatedUser.email) {
      fields.push('email = ?');
      values.push(updatedUser.email);
    }
    if (updatedUser.password) {
      fields.push('password = ?');
      values.push(updatedUser.password);
    }
    if (updatedUser.db_name) {
      fields.push('db_name = ?');
      values.push(updatedUser.db_name);
    }
    if (updatedUser.role) {
      fields.push('role = ?');
      values.push(updatedUser.role);
    }

    if (fields.length === 0) {
      console.log('No fields to update');
      return false; // No fields to update
    }

    query += fields.join(', ') + ' WHERE id = ?';
    values.push(id);

    // Execute the update query
    await connection.query(query, values);
    console.log('User updated successfully');
    return true;
  } catch (error: any) {
    console.error('Error updating user:', error.message, error.stack);
    return false;
  } finally {
    await connection.end();
  }
}

// Function to create database
export async function createDatabase(dbName: string) {
  const connection = await mysql.createConnection(remoteConnectionConfig).then((connection) => {
    console.log('Connected to the remote MySQL server.');
    return connection;
  });

  try {
    // Create the database if it doesn't exist
    return await connection.query('CREATE DATABASE IF NOT EXISTS ??', [dbName]);
  } catch (error: any) {
    console.error('Error creating database:', error);
    await saveLogs(`Error creating database: ${error}`, dbName);
    return null;
  } finally {
    await connection.end();
  }
}

// Function to create a new user and grant privileges
export async function createUser(newUser: string, newPassword: string, dbName: string) {
  const connection = await mysql.createConnection(remoteConnectionConfig);

  // Remove space, uppercase, lowercase, and special characters from name
  newUser = newUser.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '');

  try {
    // Check if the user already exists
    const [rows]: any = await connection.query('SELECT EXISTS(SELECT 1 FROM mysql.user WHERE user = ?) AS userExists', [newUser]);
    const userExists = rows[0].userExists;

    if (userExists) {
      console.log(`User ${newUser} already exists.`);
      return true; // User already exists, no need to create
    }

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS ??', [dbName]);

    // Create a new user
    await connection.query(
      'CREATE USER ? IDENTIFIED BY ?',
      [newUser, newPassword]
    );

    // Grant all privileges on the specified database
    await connection.query(
      'GRANT ALL PRIVILEGES ON ??.* TO ?',
      [dbName, newUser]
    );

    // Apply changes
    await connection.query('FLUSH PRIVILEGES');
    return true;
  } catch (error: any) {
    console.error('Error creating database, user, or granting privileges:', error);
    await saveLogs(`Error creating user: ${error}`, dbName);
    return false;
  } finally {
    await connection.end();
  }
}



// Function to fetch user credentials and query user database
export async function fetchAndQueryUser(email: string, query: string) {
  const dsSpsConnection = await mysql.createConnection(dsSpsConfig);

  try {
    // Fetch user credentials and database name from students table based on email
    const [rows]: any = await dsSpsConnection.query(
      'SELECT username, password, db_name FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      console.log('No user data found for the provided email.');
      return;
    }

    const { username, password, db_name } = rows[0];

    const user = username.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '');
    console.log('User:', user);

    // Create a new connection for the user's database
    const userConfig = {
      host: process.env.REMOTE_DB_HOST,
      user: user,
      password: password,
      port: port,
      database: db_name,
    };

    // Query the user's database
    const results = await queryUserDatabase(userConfig, query);
    return results;

  } catch (error) {
    console.error('Error fetching user data or querying user database:', error);
    return error;
  } finally {
    await dsSpsConnection.end();
  }
}

// Function to query the user's database
export async function queryUserDatabase(config: any, query: string) {
  let userConnection;
  try {
    // Log the connection details (excluding sensitive information)
    console.log('Connecting to database with config:', {
      host: config.host,
      user: config.user,
      database: config.database,
    });

    userConnection = await mysql.createConnection(config);

    // Log the query being executed
    console.log('Executing query:', query);

    // Execute the user-provided query
    const [results]: any = await userConnection.query(query);

    // Log the results
    console.log('Query results:', results);

    // Check if results are empty
    if (results.length === 0) {
      console.warn('Query returned no results.');
    }

    return results;
  } catch (error: any) {
    console.error('Error querying user database:', error.message, error.stack);
    return error; // Re-throw the error to ensure it is handled by the caller
  } finally {
    if (userConnection) {
      await userConnection.end();
    }
  }
}
// Function to fetch user credentials from ds-sps database
export async function fetchUserCredentials(email: string) {
  const dsSpsConnection = await mysql.createConnection(dsSpsConfig).then((connection) => {
    console.log('Connected to the ds-sps database.');
    return connection;
  });

  try {
    // Fetch user credentials from users table based on email
    const [rows]: any = await dsSpsConnection.query(
      'SELECT id, username, password, db_name, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );


    if (rows.length === 0) {
      console.log('No user found for the provided email.');
      return null;
    }

    const { id, username, password, db_name, role } = rows[0];
    return { id, username, email, password, db_name, role };
  } catch (error: any) {
    console.error('Error fetching user credentials:', error.message, error.stack);
    return null;
  } finally {
    await dsSpsConnection.end();
  }
}
