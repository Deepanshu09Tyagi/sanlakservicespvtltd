# sanlakservicespvtltd

Assignment for Senior NodeJs Developer

This project is a Node.js application built with Express, MongoDB, and JWT-based authentication. It includes user and admin modules, role-based access control (RBAC), pagination, and a cron-based service that runs after every server start. Additionally, it implements logging and ESLint for error handling.

## Prerequisites

Before running the project, ensure that you have the following tools installed on your machine:

- **Node.js** (>=14.x)
- **MongoDB Compass** (for managing MongoDB collections visually)
- **npm** (Node Package Manager)
- **Postman** (for testing API requests)
- **IDE** (Recommended: [VSCode](https://code.visualstudio.com/))

## Getting Started

Clone the repository and navigate to the project directory:

```bash
git clone <repository-url>
cd <project-directory>

Install dependencies by running:
npm install

Set up environment variables by creating a .env file in the root of the project and adding the following configuration:
PORT = 4545
MONGODB_URL = "mongodb://localhost:27017/deepanshutyagisanlakservices"


To check for any linting issues in the project, run:
npm run lint

To start the server normally:
npm run start

To run the server with automatic restart on code changes (using nodemon):
npm run dev


After starting the server, an admin is already seeded with the following credentials:
Email: admin@gmail.com
Password: SuperAdmin


API Overview
The API has two main modules:

1. User Module
    Registration: Allows users to register.
    Login: Allows users to log in.
    Profile: Allows users to view their profile details.

2. Admin Module
    Admins have additional permissions and can access the following routes:

    Create Users: Admins can create new users.
    Create Admins: Admins can create other admin users.
    List Users: Admins can view a paginated list of users (10 users per page).
    Update Users: Admins can update user details (except their own details).
    Delete Users: Admins can delete users (except themselves).

    Role-Based Access Control (RBAC)
    Only admin users can access admin routes.
    Middleware protects admin routes, ensuring that only users with the correct roles can access them.

3. Service
    After the server starts, a service runs that tracks users who registered in the last seven days.
    This service can also be set up as a cron job to run every 7 days if needed.

4. API Logging
    The API logs request data (including request method, URL, and payload) for every API hit, which is output to the console.
    The logging functionality helps keep track of all incoming requests for debugging and monitoring.

5. ESLint for Error Detection
    ESLint is used to detect and highlight any coding errors or style violations in the project.
    It ensures that the codebase follows consistent and clean code practices.