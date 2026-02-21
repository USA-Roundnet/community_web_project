# Getting started for Frontend Dev

## Clone the repository and install dependencies:

Make sure you're using Node.js v18+

```bash
git clone https://github.com/USA-Roundnet/community_web_project.git
cd community_web_project/frontend
npm install
```

## Run the app locally:
```bash
npm run dev
```

then navigate to http://localhost:5173 in your browser

## API proxy port (shared defaults)

Frontend proxy defaults to `http://localhost:5000` for `/api/*`, matching backend default.
If your local backend runs on a different port, set `VITE_API_PROXY_TARGET` in `.env` or `.env.local`.

## If you need to start fresh

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Frontend Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
