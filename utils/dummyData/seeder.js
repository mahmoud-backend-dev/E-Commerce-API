const fs = require('fs');
require('colors');
const dotenv = require('dotenv');
const Product = require('../../models/Product');
const connectDB = require('../../db/connectDB');

dotenv.config({ path: '../../config.env' });

// connect to DB
const start = async () => {
    try {
        await connectDB(process.env.DB_URL);
    } catch (error) {
        console.log(error);
    }
};

start();

// Read data
const products = JSON.parse(fs.readFileSync('./products.json'));


// Insert data into DB
const insertData = async () => {
try {
    await Product.create(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
} catch (error) {
    console.log(error);
}
};

// Delete data from DB
const destroyData = async () => {
try {
        await Product.deleteMany();
        console.log('Data Destroyed'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
    insertData();
} else if (process.argv[2] === '-d') {
    destroyData();
}
