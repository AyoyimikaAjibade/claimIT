# claimIT - Disaster Insurance Claims Platform

<div align="center">
  <img src="asset/claimIT-app-demo.png" alt="claimIT App Demo" width="800">
</div>

## Overview

claimIT is a comprehensive web application built with **Django** and **React** that integrates insurance APIs and government resources to simplify filing insurance claims for victims of disasters like wildfires and floods. The platform leverages AI to predict claim approval probability and estimated payout limits, streamlining disaster claim processing time by up to 40% and empowering users with tools and information to navigate their rights effectively.

- Secure JWT-based authentication
- Real-time disaster updates from FEMA
- AI-powered claim approval and limit predictions
- Intuitive user interface with Bootstrap design
- Comprehensive notification system

## Data Source

- [FEMA Disaster Declarations API](https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2)
- [Kaggle Allstate Claims Severity Dataset](https://www.kaggle.com/competitions/allstate-claims-severity)

---

## Built With

### Frontend
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
* ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
* ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
* ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
* ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
* ![Django REST](https://img.shields.io/badge/Django_REST-ff1709?style=for-the-badge&logo=django&logoColor=white)
* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
* ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
* ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

## Features

1. **User Management**
   - Secure registration and login with JWT authentication
   - User profile management with address validation
   - State-specific disaster information

2. **Disaster Updates**
   - Real-time integration with FEMA disaster declarations API
   - Filtering by disaster type and severity
   - Location-based relevant updates

3. **Claims Management**
   - Create, track, and manage insurance claims
   - Document upload and management
   - AI-powered claim approval prediction
   - Automated claim limit estimation

4. **Notification System**
   - Real-time notifications for claim status changes
   - Disaster alerts for user's location
   - Mark as read/unread functionality

5. **AI Integration**
   - Machine learning models to predict claim approval probability
   - Estimated payout limit prediction based on claim details
   - Data-driven insights for users and administrators

## Getting Started

### Prerequisites

* Python 3.8+
* Node.js (v14 or higher)
* npm or yarn
* PostgreSQL

### Installation

1. Clone the repository
```sh
git clone https://github.com/AyoyimikaAjibade/claimIT.git
```

2. Set up the backend
```sh
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd claimIT
pip install -r requirements.txt

# Set up environment variables (see .env.example)
# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

3. Set up the frontend
```sh
cd claimit_frontend
npm install
npm start
```

4. Set up environment variables
```sh
# Backend .env
DATABASE_URL=postgresql://username:password@localhost:5432/claimIT
DJANGO_SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret
DEBUG=True

# Frontend .env
REACT_APP_API_BASE_URL=http://localhost:8000
```

## AI Model Integration

claimIT uses machine learning models to provide two key predictions:

1. **Claim Approval Prediction**: A model trained on historical claim data that estimates the probability (0-1) of a claim being approved based on factors such as:
   - Disaster type
   - Property type
   - Estimated loss amount
   - Location data

2. **Claim Limit Prediction**: A regression model that estimates the potential payout limit for approved claims, helping users set realistic expectations.

These predictions are stored in the `predicted_approval` and `predicted_limit` fields of the Claim model and are automatically generated when a new claim is submitted.

## Usage

1. Register a new account with username, password, and address information
2. Log in to access the dashboard
3. View disaster updates relevant to your location
4. Create new claims using the 'New Claim' button
5. Upload supporting documents for your claim
6. Receive AI-powered predictions on claim approval and limits
7. Track claim status through the notifications system

## Roadmap

- [ ] Implement multi-factor authentication
- [ ] Add mobile app version with push notifications
- [ ] Integrate with more insurance provider APIs
- [ ] Enhance AI models with more training data
- [ ] Add chat support for claim assistance

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
