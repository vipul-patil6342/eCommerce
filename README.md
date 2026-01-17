# 🛒 Online Shopping Platform

A full-stack e-commerce web application built with Spring Boot and React, featuring secure JWT authentication, shopping cart management, and integrated Stripe payments.

## 🎯 Overview

This project demonstrates a production-grade e-commerce platform with real-world workflows including user authentication, product management, shopping cart functionality, and secure online payments. It's designed to provide hands-on experience with full-stack development, and best practices in web application architecture.

## ✨ Features

### User Management
- User registration with email validation
- Secure login/logout with JWT tokens
- Password reset functionality
- Profile management
- Role-based access control (User/Admin)

### Product Catalog
- Browse products by category
- Product filtering and sorting
- Search functionality
- Product details and specifications
- Product image management

### Shopping Cart
- Add/remove products from cart
- Update product quantities
- Real-time cart total calculation
- Persistent cart storage

### Wishlist Management

- Add/remove products to wishlist
- View wishlist items
- Move items from wishlist to cart

### Order Management
- Place orders from cart
- Order history tracking
- Order status updates
- Order details view
- Admin order management

### Payment Processing
- Secure Stripe integration
- Multiple payment methods support
- Webhook verification for payment confirmation
- Automatic order status updates
- Payment failure handling

### Admin Dashboard
- Product management (CRUD operations)
- User management
- Order tracking
- Category management
- Analytics and reports

## 🛠️ Tech Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.x
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0+
- **ORM**: Hibernate/JPA
- **Caching**: Redis
- **Build Tool**: Maven
- **Payment**: Stripe API
- **Testing**: JUnit, Mockito

### Frontend
- **Library**: React 18+
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite/Create React App

### DevOps & Tools
- **Version Control**: Git & GitHub
- **API Testing**: Postman

## 📂 Project Structure

```
eCommerce/
│
├── backend/
│   ├── src/main/java/com/vipulpatil/eCommerce
│   │   ├── annotation/
│   │   ├── aspect/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── error/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   ├── utils/
│   │   └── ECommerceApplication.java
│   ├── src/main/resources/
│   ├── src/test/
│   ├── pom.xml
│   ├── .gitignore
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md

```

## 📦 Prerequisites

Ensure you have the following installed:

- **Java 21** 
- **Maven 3.6+** 
- **Node.js 16+**
- **npm 8+** (comes with Node.js)
- **MySQL 8.0+** 
- **Redis** (optional, for caching)
- **Git** 
- **Stripe Account**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vipul-patil6342/eCommerce.git
cd eCommerce
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
mvn clean install


### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create `backend/src/main/resources/application.properties`:
- spring.application.name=eCommerce
- server.port=8080
- server.servlet.context-path=/api/v1

# Database
- spring.datasource.url=your-db-url
- spring.datasource.username=your-db-username
- spring.datasource.password=your-db-password

# JPA
- spring.jpa.hibernate.ddl-auto=update
- spring.jpa.show-sql=false

# JWT
- jwt.secretKey=your-jwt-secret-key
- jwt.accessTokenExpiration=your-access-token-expiration-time
- jwt.refreshTokenExpiration=your-refresh-token-expiration-time

# Frontend
- app.frontend.url=your-frontend-url

# Cloudinary
- cloudinary.cloud-name=your-cloudinary-cloud-name
- cloudinary.api-key=your-cloudinary-api-key
- cloudinary.api-secret=your-cloudinary-api-secret

# Redis
- spring.cache.type=redis
- spring.data.redis.host=your-redis-host
- spring.data.redis.port=your-redis-port

# Stripe
- stripe.secret-key=your-stripe-secret-key
- stripe.public-key=your-stripe-public-key
- stripe.webhook-secret=your-stripe-webhook-secret


Create `backend/src/main/resources/application.yml`:

spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: your-google-oauth2-cliet-id
            client-secret: your-google-oauth2-cliet-secret
          github:
            client-id: your-github-oauth2-cliet-id
            client-secret: your-github-oauth2-cliet-secret


# FRONTEND - .env

# API Configuration
VITE_BACKEND_URL=your-backend-url


## 🎮 Running the Application

Run Individually

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`


## 🗄️ Database Schema

### Key Tables

- **users** - User account information
- **user_roles** - User roles (user, admin)
- **products** - Product catalog
- **address** - User addresses
- **cart** - User shopping cart
- **cart_item** - Shopping cart items
- **orders** - Customer orders
- **order_item** - Order items
- **wishlist** - Customer wishlist
- **reviews** - Product rating and reviews
- **refresh_token** - Refresh tokens

## 📖 Learning Outcomes

Through this project, you'll learn:

✅ **Backend Development**
- RESTful API design with Spring Boot
- Database design and optimization
- Authentication & authorization
- Error handling and validation
- Caching strategies

✅ **Frontend Development**
- React component architecture
- State management with Redux
- Form handling and validation
- HTTP client integration (Axios)
- Responsive UI design

✅ **Security**
- JWT authentication implementation
- Password hashing and storage
- CORS configuration
- Secure payment handling
- Input validation

✅ **Integration**
- Third-party API integration (Stripe)
- Webhook handling
- Frontend-backend communication
- Environment configuration

✅ **Best Practices**
- Code organization and structure
- Git workflow and version control
- Error handling

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Vipul Patil**
- 🎯 Aspiring Full-Stack Developer
- 💡 Passionate about backend development and scalable web applications
- 📧 Email: your.email@example.com
- 🔗 LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- 🐙 GitHub: [Your GitHub](https://github.com/yourprofile)

**Happy Coding! 🚀**

Last Updated: January 2026
