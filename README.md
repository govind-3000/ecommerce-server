# ecommerce-server

* ShopCat is a full stack e-commerce application it is based on MERN stack, 

* ShopCat's frontend is implemented with ReactJS, backend is built using NodeJS and Express used as a backend framework,

* This application uses flexible Private and Admin Routing System, that enables Admin to manage products and orders.
Admin can also change the order status.

* This application also uses Authentication feature which is based on JWT, 
that make sure only the authenticated user can proceed with payment to buy the Products.

* ShopCat interacts with MongoDB database to store and retrieve data, MongoDB is used due to its high scalability.
and this web application is deployed in Heroku live server.

* ShopCat uses Braintree for handling Payments.
This application allows two payment methods, checkout using credit card and PayPal.

* ShopCat has several other fetures like...
Add to Cart, Role based access, Payment Gateways, 
Order Management System, Advance search based on category and price range.

* And this application uses LocalStorage, for storing cart items, such that it Minimize Requests to Backend.

* It also uses React Hooks(easily encapsulate side effects),
Once payment is done,Sold Products Record is stored into the Database, so product quantity adjusted based on that,
also the products added to users purchase history.
