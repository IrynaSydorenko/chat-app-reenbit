# Chat Application

This chat application is built using the MERN stack (MongoDB, Express, React, Node.js). It supports real-time messaging with a sleek user interface.

## Features

Real-time messaging with WebSockets
User authentication and authorization
Responsive design for mobile and desktop

## Installation Guide

### Requirements

- [Nodejs](https://nodejs.org/en/download)
- [Mongodb](https://www.mongodb.com/docs/manual/administration/install-community/)

Ensure that both Node.js and MongoDB are installed and that MongoDB is running locally.

### Installation Steps

```shell
git clone https://github.com/your-username/your-repo-name
cd your-repo-name
```

Set Up Environment Variables

Install the dependencies for both the frontend and backend:

```shell
cd server
yarn
cd ..
cd public
yarn
```

Open two terminal windows or tabs. In the first one, start the backend server:

```shell
cd server
yarn start
```

In the second terminal, start the frontend:

```shell
cd public
yarn start
```

Open another terminal in folder, Also make sure mongodb is running in background.

```shell
cd server
yarn start
```

After starting both the backend and frontend, open the browser and navigate to http://localhost:3000 to start using the chat application.
