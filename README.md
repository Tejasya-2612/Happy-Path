# Happy Path

Happy Path is a production-ready MERN tool lending library. It includes JWT authentication, protected CRUD, search, filtering, sorting, pagination, validation, sanitization, loading states, graceful error handling, and a responsive grayscale dashboard UI.

## Features

- Register, login, logout, and protected routes
- Create, read, update, and delete tools
- Search by tool name or category
- Filter by availability
- Sort by name or creation date
- Pagination
- Client and server validation
- Text sanitization before persistence
- Helmet, CORS, Morgan, bcrypt, JWT, Mongoose
- Accessible semantic UI with labels, ARIA attributes, and keyboard-friendly controls
- Analytics console logging for successful create, update, delete, login, and logout actions

## Installation

```bash
cd "C:\Happy Path"
cd server
npm install
cd ..\client
npm install
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/happy_path
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run Backend

```bash
cd "C:\Happy Path\server"
npm run dev
```

## Run Frontend

```bash
cd "C:\Happy Path\client"
npm run dev
```

Open `http://localhost:5173`.

## Folder Structure

```text
Happy Path/
  client/
    src/
      components/
      context/
      hooks/
      pages/
      services/
      styles/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
```

## Technologies

- React 19, Vite, React Router, Axios, Context API
- Node.js, Express, MongoDB, Mongoose
- JWT, bcrypt, Helmet, CORS, Morgan, dotenv

## Git Commands

```bash
cd "C:\Happy Path"
git init
git add .
git commit -m "Initial Happy Path MERN app"
```

## GitHub Push Commands

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/happy-path.git
git push -u origin main
```

## Deployment

### Render Backend

1. Push the repository to GitHub.
2. Create a new Render Web Service from the repository.
3. Set the root directory to `server`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `server/.env.example`.
7. Set `MONGO_URI` to your production MongoDB Atlas connection string.
8. Set `CLIENT_ORIGIN` to the deployed Vercel frontend URL.

For the current deployment:

```env
CLIENT_ORIGIN=https://happy-path-2nytsoa40-atejasya8-1627s-projects.vercel.app
```

### Vercel Frontend

1. Import the GitHub repository into Vercel.
2. Set the root directory to `client`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL` with the Render backend URL plus `/api`.

For the current deployment:

```env
VITE_API_URL=https://happy-path-5oso.onrender.com/api
```

