const express = require("express");
const app = express();
const cors = require("cors")
const apiUrl = "https://fantasy.premierleague.com/api/bootstrap-static/";

// Define the CORS options
const corsOptions = {
  origin: ['http://localhost:5173'] // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options

app.get("/api", (req, res) => {
  fetch(apiUrl)
    .then((myRes) => myRes.json())
    .then((data) => {
        setTimeout(() => res.json({
          elements: data.elements, teams: data.teams, element_types: data.element_types}), "1")
        
    })
    .catch((e) => console.log("Error msg from server.js: ", e));
});

app.listen(5000, ()=>{
  console.log("server running on port 5000")
});
