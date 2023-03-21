const path = require('path');

require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit')
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean')
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
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


// for Swagger Ui StartUp an running live server
app.get('/', (req, res) => res.redirect('/api-docs'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


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

// To remove data using these defaults, To apply data sanitization
// nosql mongo injection
app.use(mongoSanitize());
// To sanitize user input coming from POST body, GET queries, and url params  ex: '<script></script>' to convert string ''&lt;script>&lt;/script>''
app.use(xss())

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100, 
    message:
    'Too many accounts created from this IP, please try again after an 15 minutes'
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(
    hpp({
        whitelist: [
            'price',
            'sold',
            'quantity',
            'ratingsAverage',
            'ratingsQuantity'
        ]
    }));

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