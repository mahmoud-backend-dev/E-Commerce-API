const path = require('path');

require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 1812;

// Routes
const mountRoutes = require('./routes');
const { webhookCheckout } = require('./controller/orderController');

// Middlewares
const errorHandlerMiddleWare = require('./middleware/error-handler');
const NotFoundError = require('./middleware/notFoundMiddleware');
const connectDB = require('./db/connectDB');

// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// Compress all responses
app.use(compression());

// Checkout webhook
app.post
(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    webhookCheckout,
)

// MiddleWare 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));



// mount Api
mountRoutes(app);

// Handler Middleware
app.use(errorHandlerMiddleWare);

// Not Found Error
app.use(NotFoundError); 

const start = async () => {
    try {
        await connectDB(process.env.DB_URI);
        app.listen(port, () => console.log(`Listen on http://localhost:${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();