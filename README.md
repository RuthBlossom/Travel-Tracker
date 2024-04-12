# Visited Countries Tracker

## Description
This is a web application that allows users to track the countries they have visited. Users can add countries to their visited list, and the application will display the total count of visited countries along with the list of visited countries.

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- HTML
- CSS
- EJS (Embedded JavaScript) for templating

## Installation
1. Clone or download the repository to your local machine.
2. Install Node.js if you haven't already.
3. Install PostgreSQL and create a database named "world" (or any preferred name).
4. Create the necessary tables in the database using the provided SQL schema.
5. Update the database connection details in the `index.js` file to match your PostgreSQL setup.
6. Run `npm install` to install the required dependencies.
7. Start the server by running `node index.js`.
8. Open a web browser and navigate to `http://localhost:3000` to access the application.

## Usage
- Navigate to the home page to view the list of visited countries and the total count.
- To add a country to the visited list, enter the name of the country in the input field provided and submit the form.
- If the country name matches partially with any country in the database, it will be added to the visited list.
- If the country name does not exist in the database or has already been added, appropriate error messages will be displayed.

