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
