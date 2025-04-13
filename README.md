# Task Management Application

<div align="center">
  <img src="asset/claimIT-app-demo.png" alt="claimIT App Demo" width="800">
</div>

## Overview

This project aims to develop claimIT, a **Django** and **JavaScript**-based web application that integrates insurance APIs and government resources to simplify filing insurance claims for victims of disasters like wildfires and floods. Gives a prediction of approval or denials of claims and the limit amount using appropriate AI classification models. Using AI predictions, it is estimated to streamline disaster claim processing time by 40%, empowering users with tools and information to navigate their rights effectively.

- Secure user authentication
- Intuitive task management
- Real-time dashboard statistics
- Responsive Material-UI design

## Data source

- [Kaggle Allstate Claims approval prediction](https://www.kaggle.com/competitions/allstate-claims-severity)

---

## Built With

### Frontend
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
* ![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
* ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
* ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### Backend
* ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
* ![TypeORM](https://img.shields.io/badge/TypeORM-FE0902?style=for-the-badge)
* ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## Features

1. **User Management**
   - Secure registration and login
   - JWT-based authentication
   - Password validation and security

2. **Task Management**
   - Create, read, update, and delete tasks
   - Set task priorities
   - Mark tasks as complete/incomplete
   - Filter and sort tasks

3. **Dashboard**
   - Task statistics overview
   - Priority distribution
   - Completion status tracking
   - Due date monitoring

## Getting Started

### Prerequisites

* Node.js (v14 or higher)
* npm
* PostgreSQL

## Demo Video

> Coming soon! A comprehensive video walkthrough demonstrating:
> - User registration and authentication
> - Task creation and management
> - Dashboard features and statistics
> - Responsive design across devices

### Installation

1. Clone the repository
```sh
git clone https://github.com/AyoyimikaAjibade/Task-Mgt-App.git
```

2. Install frontend dependencies
```sh
cd frontend
npm install
```

3. Install backend dependencies
```sh
cd backend
npm install
```

4. Set up environment variables
```sh
# Backend .env
DATABASE_URL=postgresql://username:password@localhost:5432/taskdb(making stuff up set up your DB)
JWT_SECRET=your-secret-key

# Frontend .env
REACT_APP_API_URL=http://localhost:8080
```

5. Start the development servers
```sh
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm start
```

6. To get your specific JWT_SECRET, you can use the following command on your terminal:
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Usage

1. Register a new account with username and password
2. Log in to access the dashboard
3. Create new tasks using the 'Add Task' button
4. View task statistics on the dashboard
5. Manage tasks through the tasks page

## Roadmap

- [ ] Add task categories/tags
- [ ] Implement task sharing between users
- [ ] Add email notifications for due tasks
- [ ] Integrate with calendar applications
- [ ] Add task attachments feature

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
