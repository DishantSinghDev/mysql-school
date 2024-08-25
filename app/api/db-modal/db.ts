import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config(); // Load environment variables from a .env file

// Remote MySQL server connection configuration
const remoteConnectionConfig = {
  host: process.env.REMOTE_DB_HOST,
  user: process.env.REMOTE_DB_USER,
  password: process.env.REMOTE_DB_PASSWORD,
};

// Function to create database
export async function createDatabase(dbName: string) {
  const connection = await mysql.createConnection(remoteConnectionConfig);

  try {
    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS ??', [dbName]);
    console.log('Database created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating database:', error);
    return false;
  } finally {
    await connection.end();
  }
}

// Function to create a new user and grant privileges
export async function createUser(newUser: string, newPassword: string, dbName: string) {
  const connection = await mysql.createConnection(remoteConnectionConfig);

  try {
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

    console.log('Database, user created, and privileges granted successfully.');
  } catch (error) {
    console.error('Error creating database, user, or granting privileges:', error);
  } finally {
    await connection.end();
  }
}

// Connection configuration for ds-sps database
const dsSpsConfig = {
  host: process.env.REMOTE_DB_HOST,
  user: process.env.REMOTE_DB_USER,
  password: process.env.REMOTE_DB_PASSWORD,
  database: 'ds_sps',
};

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

    // Create a new connection for the user's database
    const userConfig = {
      host: process.env.REMOTE_DB_HOST,
      user: username,
      password: password,
      database: db_name,
    };

    // Query the user's database
    const results = await queryUserDatabase(userConfig, query);
    return results;

  } catch (error) {
    console.error('Error fetching user data or querying user database:', error);
  } finally {
    await dsSpsConnection.end();
  }
}

// Function to query the user's database
export async function queryUserDatabase(config: any, query: string) {
  const userConnection = await mysql.createConnection(config);

  try {
    // Execute the user-provided query
    const [results] = await userConnection.query(query);
    return results;
  } catch (error) {
    console.error('Error querying user database:', error);
    return [];
  } finally {
    await userConnection.end();
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

    console.log('Rows fetched:', rows); // Add this line

    if (rows.length === 0) {
      console.log('No user found for the provided email.');
      return null; // Explicitly return null if no user is found
    }

    const { id, username, password, db_name, role } = rows[0];
    return { id, username, email, password, db_name, role };
  } catch (error: any) {
    console.error('Error fetching user credentials:', error.message, error.stack); // Improved error logging
    return null; // Return null if there's an error
  } finally {
    await dsSpsConnection.end();
  }
}
