🚀 Features

✅ Fetch country data from:
https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies

✅ Extract each country’s currency code and exchange rate

✅ Calculate estimated GDP using population × random multiplier ÷ exchange rate

✅ Store data in MySQL database using Sequelize ORM

✅ Generate a summary image showing total countries and top 5 GDP countries

✅ Provide CRUD API endpoints:

Create or update countries (POST /countries/refresh)

Retrieve all or filtered countries (GET /countries)

Retrieve a single country by name (GET /countries/:name)

Delete a country (DELETE /countries/:name)

View summary image (GET /countries/image)

Check database status (GET /status)

📁 Project Structure
country-currency-mongo-api/
│
├── .env.example
├── package.json
├── README.md
├── server.js
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── countryController.js
│   │
│   ├── models/
│   │   └── Country.js
│   │
│   ├── routes/
│   │   └── countryRoutes.js
│   │
│   ├── services/
│   │   └── countryService.js
│   │
│   └── utils/
│       └── imageGenerator.js
│
└── cache/
    └── summary.png     # Auto-generated after refresh

⚙️ Environment Variables

Create a .env file in the root directory (you can copy .env.example).

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=countrydb

COUNTRIES_API=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_API=https://api.exchangerate-api.com/v4/latest/USD

REQUEST_TIMEOUT_MS=10000
