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

## Optional address autocomplete API key

Create Tournament and Registration address autocomplete use Geoapify.
You can override the default project key with your own key via `VITE_GEOAPIFY_API_KEY`.

## API proxy port (shared defaults)

Frontend proxy defaults to `http://localhost:5000` for `/api/*`, matching backend default.
If your local backend runs on a different port, set `VITE_API_PROXY_TARGET` in `.env` or `.env.local`.

To set the key locally:

```bash
cp .env.example .env
```

Then add:

```bash
VITE_GEOAPIFY_API_KEY=your_key_here
```

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
