// Import necessary modules
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Create an instance of the Express application
const app = express();

// Set the port for the server to listen on
const port = 3000;

// Create a PostgreSQL client instance and connect to the database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Blossom5864", // Ensure your database password is secure
  port: 5432,
});
db.connect();

// Configure middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Define an asynchronous function named "checkVisited" to query the database for visited countries
async function checkVisited() {
  try {
    // Execute a SELECT query on the "visited_countries" table
    const result = await db.query("SELECT country_code FROM visited_countries");

    // Initialize an empty array to store the retrieved country codes
    let countries = [];

    // Iterate over the rows in the query result and push each country code to the array
    result.rows.forEach((country) => {
      countries.push(country.country_code);
    });

    // Return the array of country codes
    return countries;
  } catch (err) {
    // Handle any errors that may occur during the database query
    console.log(err);
    throw err;
  }
}

// Define a route handler for GET requests to the home page ("/")
app.get("/", async (req, res) => {
  try {
    // Retrieve the list of visited countries using the checkVisited function
    const countries = await checkVisited();

    // Render the "index.ejs" template with the retrieved countries and their total count
    res.render("index.ejs", { countries: countries, total: countries.length });
  } catch (err) {
    // Handle any errors that may occur during the route handling
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Define a route handler for POST requests to the "/add" endpoint
app.post("/add", async (req, res) => {
  // Extract the "country" property from the request body
  const input = req.body["country"];

  try {
    // Attempt to select the country_code from the 'countries' table where the country_name partially matches the input (case-insensitive)
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    // Extract the country_code from the result
    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      // Attempt to insert the extracted country_code into the "visited_countries" table
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1)",
        [countryCode]
      );

      // Redirect the user to the home page after successful insertion
      res.redirect("/");
    } catch (err) {
      // Handle any errors that may occur during the database insertion
      console.log(err);

      // If insertion fails, render the home page with an error message
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.",
      });
    }
  } catch (err) {
    // Handle any errors that may occur during the database query
    console.log(err);

    // If the country_name does not exist, render the home page with an error message
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.",
    });
  }
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

