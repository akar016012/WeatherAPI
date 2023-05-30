const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/style.css", () => {
  res.sendFile(__dirname + "/style.css");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  console.log(req.body.CityName);
  const query = req.body.CityName;
  const mySecret = process.env['API_KEY']
  const url = `https://api.openweathermap.org/data/2.5/weather?appid=a2be3509ecda5a9658e5ee8d17acd99d&q=${query}&units=imperial`;
  https.get(url, (respond) => {
    console.log(respond.statusCode);
    respond.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const weatherTemp = weatherData.main.temp;
      const weatherDes = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      res.write(
        '<head><link rel="stylesheet" type="text/css" href="/result.css"></head>'
      );
      res.write(`<h1>The weather is currently ${weatherDes}!</h1>`);
      res.write(
        `<h2>The temperature in ${query} is ${weatherTemp} degrees fahrenheit  </h2>`
      );
      res.write(`<img src="${imageURL}"></img>`);
      res.send();
    });
  });
});

app.listen(3000, () => {
  console.log("Sever is running on 3000");
});
