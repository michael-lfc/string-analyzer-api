<<<<<<< HEAD
Country Currency & Exchange API

A RESTful API to fetch country data, currency exchange rates, compute estimated GDPs, and provide a summary image.

This API integrates data from external sources, caches it in a MySQL database, and exposes endpoints to query, filter, sort, and visualize country and economic information. Built with Node.js, Express, and Sequelize, it demonstrates CRUD operations, API integration, and data processing in a backend project.

**Features

Fetch country data: name, capital, region, population, currencies, flag.

Fetch exchange rates for currencies from USD.

Compute estimated_gdp = population × random(1000–2000) ÷ exchange_rate.

Store and update country data in a MySQL database.

Filters by region and currency_code.

Sort countries by GDP (asc / desc).

Generate and serve a summary image with total countries and top 5 GDP countries.

Proper error handling and input validation.

**Tech Stack

Backend: Node.js, Express.js

Database: MySQL, Sequelize ORM


Utilities: Axios, Canvas

Dev Tools: Nodemon

Setup & Installation

Clone the repository:

git clone https://github.com/michael-lfc/country-currency-api.git
cd country-currency-api


Install dependencies:

npm install


Create a .env file in the root directory and add:

PORT=3000

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=3306

COUNTRIES_API=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_API=https://open.er-api.com/v6/latest/USD
REQUEST_TIMEOUT_MS=10000

CACHE_DIR=./cache
SUMMARY_IMAGE=summary.png


Start the server locally:

npm run dev


Server will be accessible at: http://localhost:3000/

Available Endpoints
Method	Endpoint	Description
POST	/countries/refresh	Fetch countries & exchange rates, update DB, generate summary image
GET	/countries	Get all countries (supports region, currency, sort, limit, page)
GET	/countries/:name	Get a country by name (case-insensitive)
DELETE	/countries/:name	Delete a country record
GET	/status	Show total countries and last refresh timestamp
GET	/countries/image	Serve the generated summary image
Example Requests & Responses
1️⃣ Refresh countries
POST /countries/refresh

{
  "message": "Countries refreshed successfully",
  "total_countries": 250,
  "last_refreshed_at": "2025-10-27T11:50:18Z"
}

2️⃣ Get all countries
GET /countries?region=Africa&currency=NGN&sort=gdp_desc&limit=5&page=1

[
  {
    "id": 1,
    "name": "Nigeria",
    "capital": "Abuja",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg",
    "last_refreshed_at": "2025-10-27T11:50:18Z"
  }
]

3️⃣ Get a single country
GET /countries/Nigeria

{
  "id": 1,
  "name": "Nigeria",
  "capital": "Abuja",
  "region": "Africa",
  "population": 206139589,
  "currency_code": "NGN",
  "exchange_rate": 1600.23,
  "estimated_gdp": 25767448125.2,
  "flag_url": "https://flagcdn.com/ng.svg",
  "last_refreshed_at": "2025-10-27T11:50:18Z"
}

4️⃣ Delete a country
DELETE /countries/Nigeria

{
  "message": "Country deleted successfully"
}

5️⃣ Check API status
GET /status

{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-27T11:50:18Z"
}

6️⃣ Get summary image
GET /countries/image


Returns summary.png

If image not found:

{
  "error": "Summary image not found"
}

Folder Structure
country-currency-api/
├── .env
├── package.json
├── README.md
├── app.js
├── cache/
│   └── summary.png
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── countryController.js
│   ├── models/
│   │   └── Country.js
│   ├── routes/
│   │   ├── countryRoutes.js
│   │   └── statusRoute.js
│   ├── services/
│   │   └── countryService.js
│   └── utils/
│       └── imageGenerator.js
└── node_modules/

License

MIT License
=======
=======
>>>>>>> 7cac3084d0dc0b2e2eccb09bd36719c1b7954bac
# String Analyzer API

A RESTful API that analyzes strings and stores their computed properties. Built with **Node.js**, **Express**, and **MongoDB**.  

**Live API:** [https://string-analyzer-app-aa93d11b7ac0.herokuapp.com/](https://string-analyzer-app-aa93d11b7ac0.herokuapp.com/)  
**GitHub Repo:** [https://github.com/michael-lfc/string-analyzer-api](https://github.com/michael-lfc/string-analyzer-api)

---

## **Endpoints**

**1. Create / Analyze String**  
`POST /strings`  
Body: `{ "value": "your string" }`  
Responses:  
- 201 Created → JSON with string properties  
- 409 Conflict → String exists  
- 422 Unprocessable Entity → Invalid type  

**2. Get Specific String**  
`GET /strings/:value`  
Responses:  
- 200 OK → String properties  
- 404 Not Found → String missing  

**3. Get All Strings with Filters**  
`GET /strings?is_palindrome=true&min_length=3&word_count=1&contains_character=a`  
Filters supported: `is_palindrome`, `min_length`, `max_length`, `word_count`, `contains_character`  

**4. Natural Language Filtering**  
`GET /strings/filter-by-natural-language?query=all single word palindromic strings`  
- Parses simple English queries into filters  
- Responses: filtered strings + interpreted query  
- Errors: 400 Bad Request, 422 Unprocessable Entity  

**5. Delete String**  
`DELETE /strings/:value` → 204 No Content / 404 Not Found  

---

## **Local Setup**

1. Clone repo:  
```bash
git clone https://github.com/michael-lfc/string-analyzer-api.git
cd string-analyzer-api

2. Install dependencies:

npm install

3. Create .env:

PORT=3000
MONGO_URI="your-mongodb-uri-with-database-name"


4. Start server:

5. npm run dev


6. Access at http://localhost:3000

7. Dependencies

Node.js, Express, Mongoose, dotenv, crypto (built-in)

8. Testing Examples

POST Examples:

{ "value": "madam" }  
{ "value": "Hello world" }  
{ "value": "A man a plan a canal Panama" }


9. GET Filters:

/strings?is_palindrome=true&min_length=5
/strings/filter-by-natural-language?query=strings longer than 10 characters
