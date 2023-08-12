## Hosted Project
[E-Commerce-APIs](https://e-commerce-api-1812.onrender.com)


#### Setup Basic Express Server

- import express and assign to variable
- setup start port variable (1812) and start function

## Usega
APIs to build the backend for an e-commerce website with various features. The website includes 
categories, subcategories, brands, reviews, Wishlist functionality, coupons, and a user 
authentication process to enable users to review all products, users are able to add products to
their carts and create both cash orders and online orders, The online payment gateway should be 
integrate with our website such as stripe, allowing users to make payments using services such as 
Vise, PayPal, or other similar platforms.

APIs to build the backend for an e-commerce website with various features. The website includes 
categories, subcategories, brands, reviews, Wishlist functionality, coupons, and a user 
authentication process to enable users to review all products, users are able to add products to
their carts and create both cash orders and online orders, The online payment gateway should be 
integrate with our website such as stripe, allowing users to make payments using services such as 
Vise, PayPal, or other similar platforms.


## :bulb: Built Using

- MongoDB
- Express
- Node.JS
- Javascript
- jsonwebtoken for authentication and authorization
- nodemailer
- Multer
- Sharp for image processiong
- stripe (Payment Getaway)

### To Install all the dependencies

```
npm install
```
### Start API

```
npm start
```

## Routes

### Categories
```
POST   create gategory    /api/v1/categories
GET   get list of categories   /api/v1/categories (With pagination, sort, search)
GET  get specific category   /api/v1/categories/63f9f62e29fe15af26901a18
PUT  update specicic category     /api/v1/categories/63f9f62e29fe15af26901a18
DELETE delete specific category   /api/v1/categories/63f9f62e29fe15af26901a18
```

### Brands
```
POST   create brand    /api/v1/brands
GET   get list of brands   /api/v1/brands (With pagination, sort, search)
GET  get specific brand   /api/v1/brands/63f9f62e29fe15af26901a18
PUT  update specicic brand     /api/v1/brands/63f9f62e29fe15af26901a18
DELETE delete specific brand   /api/v1/brands/63f9f62e29fe15af26901a18
```

### Users
```
POST   create user    /api/v1/users
GET   get list of users   /api/v1/users (With pagination, sort, search)
GET  get specific user   /api/v1/users/64085b22b395d8d5d0ebeb49
PUT  change user password     /api/v1/users/changePassword/640b796eaa3c14c8e086260a
PUT  update user     /api/v1/users/640b796eaa3c14c8e086260a
DELETE delete specific user   /api/v1/users/640b75b1b1623b1fb3bd91d8
```

### Authentication
```
POST   signup user    /api/v1/auth/signup
POST   login user    /api/v1/auth/login
POST   forget password    /api/v1/auth/forgotPassword 
POST   verify reset code   /api/v1/auth/verifyResetCode
PUT  reset password   /api/v1/auth/resetPassword
```

### Products
```
POST   create product    /api/v1/products
GET   get list of products   /api/v1/products (With pagination, sort, search)
GET  get specific product   /api/v1/products/640727691c15aa5466d55b83
PUT  update product     /api/v1/products/63fbb39ec6ee806d3a47c476
DELETE delete specific product   /api/v1/products/63fbb39ec6ee806d3a47c476
```

### SubCategories
```
POST   create subcategories    /api/v1/subcategories
GET   get list of subcategories   /api/v1/subcategories (With pagination, sort, search)
GET  get specific subcategory   /api/v1/subcategories/63fb4c6611f0646b9c627911
PUT  update specific subcategory     /api/v1/subcategories/63fb4d47fa1df329fb7ca3a6
DELETE delete specific category   /api/v1/subcategories/63fb4d47fa1df329fb7ca3a6
```

### Categories/sub {merge params}
```
POST   create subcategory on category    /api/v1/categories/63f9f62e29fe15af26901a18/subcategories
GET   get list of subcategories for specific category   /api/v1/categories/63f9f62e29fe15af26901a18/subcategories (With pagination, sort, search)
```

### Logged Users
```
GET   get logged user data   /api/v1/users/getMe
PUT  update logged user password     /api/v1/users/changeMyPassword
PUT  update logged user data     /api/v1/users/updateMe
DELETE disactivated logged user data   /api/v1/users/deleteMe
```

### Reviews
```
POST   create review    /api/v1/reviews
GET   get list of review   /api/v1/reviews (With pagination, sort, search)
GET  get specific review   /api/v1/reviews/640da4cd004c2cd993442a1c
PUT  update specific review     /api/v1/reviews/640da4cd004c2cd993442a1c
DELETE delete specific review   /api/v1/reviews/640da4cd004c2cd993442a1c
```

### Products/Reviews {merge params}
```
POST   create review on specific product    /api/v1/products/640727691c15aa5466d55b81/reviews
GET   get all reviews on specific product   /api/v1/products/640727691c15aa5466d55b81/reviews (With pagination, sort, search)
```

### Wishlist
```
POST   add product to wishlist    /api/v1/wishlist
GET   get logged user wishlist   /api/v1/wishlist
DELETE  remove product from wishlist   /api/v1/wishlist//640727691c15aa5466d55b82
```

### Addresses
```
POST   add address to user addresses    /api/v1/addresses
GET   get logged user addresses   /api/v1/addresses
DELETE  remove address from user addresses   /api/v1/addresses/6413933be0c2191fa9189ff0
```

### Coupons
```
POST   create coupon    /api/v1/coupons
GET   get list of coupons   /api/v1/coupons (With pagination, sort, search )
GET  get specific coupon   /api/v1/coupons/64147a973e941b9cea98467c
PUT  update specific coupon     /api/v1/coupons/64147a973e941b9cea98467cc
DELETE delete specific coupon  /api/v1/coupons/64147b853e941b9cea984691
```

### Cart
```
POST   add product to cart    /api/v1/cart
GET   get logged user cart   /api/v1/cart 
PUT  update specific cart item quantity     /api/v1/cart/64149ce1153a6ad315f4d62a
PUT  apply coupon    /api/v1/cart/applyCoupon
DELETE  remove specific cart item  /api/v1/cart/641494875922b67f7bbfeeca
DELETE  clear cart  /api/v1/cart
```

### Orders
```
POST   create cash order    /api/v1/orders/6415cd631c321e298f1aa0ef
GET   get specific order   /api/v1/orders/6415c8152ff7c75485f77c2f
GET  get all orders     /api/v1/orders (With pagination, sort, search )
PUT  update order status to paid    /api/v1/orders/6415c8152ff7c75485f77c2f/pay
PUT  update order status to delivered    /api/v1/orders/6415c8152ff7c75485f77c2f/deliver
GET  get checkout session for online paid   /api/v1/orders/checkout-session/6415c6fd2ff7c75485f77c16
```

## :man: Project Created & Maintained By -

- **Hey guys, I'm Jayvardhan. Find out more about me** [ here](https://www.linkedin.com/in/mahmoud-hamdi-62bb1223b)
- **Reach out to me at** [mahmoud.backend.dev@gmail.com](mahmoud.backend.dev@gmail.com)

<h3 align="right">Built with :heart: by Mahmoud Hamdi</h3>
