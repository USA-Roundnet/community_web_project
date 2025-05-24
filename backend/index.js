const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger'); 

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'hdjsahu4234g5gg47uqwuch',  // Use environment variable in production
  resave: false,
  saveUninitialized: false
}));

//View engine configuration
app.set('view engine', 'ejs');

//Authentication routes

const { initializeClient } = require('./config/cognito');
initializeClient().catch(console.error);

// Login route
app.get('/login', (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: 'email openid phone',
    state: state,
    nonce: nonce,
  });

  res.redirect(authUrl);
});

// Callback route
app.get(getPathFromURL('https://localhost:5173/HomePage'), async (req, res) => {
  try {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      'https://localhost:5173/HomePage',
      params,
      { nonce: req.session.nonce, state: req.session.state }
    );

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;

    res.redirect('/');
  } catch (err) {
    console.error('Callback error:', err);
    res.redirect('/');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  const logoutUrl = `https://us-east-1ejlyglosf.auth.us-east-1.amazoncognito.com/logout?client_id=5en335ap29j15red9mo3dl2r3e&logout_uri=https://localhost:5173/`;
  res.redirect(logoutUrl);
});

// Swagger 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Routes
app.use('/api/users', require('./routes/userRoutes'))

// Catch-all Route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});