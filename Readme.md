# E-commerce Clone

A full-stack, responsive e-commerce web application built using the MERN stack. It features user authentication with JWT, dynamic product loading from the Platzi Fake Store API, cart and checkout functionality, and styled using Tailwind CSS.

## Tech Stack

**Frontend**:

- React (Vite)
- Tailwind CSS

**Backend**:

- Node.js
- Express.js
- MongoDB

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Manibingi/E-Commerce.git
cd E-Commerce
```

### 2. Setup Backend

```bash
cd server
npm install
```

**Create .env file**:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
PORT=your_port
```

**Start the backend**:

```bash
nodemon index.js
```

### 2. Setup Frontend

```bash
cd ../client
npm install
```

**Create .env file**:

```env
VITE_API_URL=your_backend_url
```

**Start the frontend**:

```bash
npm run dev
```
