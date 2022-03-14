const express = require("express");
const app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const axios = require('axios');
const date = require('date-and-time');


app.set('views', path.join(__dirname, 'views'));

nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app
});

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));

//data
const name = "Tony";
const help = { "exchange_today": "exchange today rate Czech crowns to Euro", "help": "my functions", "name": "my name", "time": "time now" };

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/bot.html');
});

app.post("/name", (req, res, next) => {
    let result = { "output": `My name is ${name}.` };
    res.json(result);
    res.send();
});

app.post("/time", (req, res, next) => {
    const today = new Date();
    const string_today_time = date.format(today, 'HH:mm:ss');
    let result = { "output": `In this moment is ${string_today_time}.` };
    res.json(result);
    res.send();
});

app.post("/help", (req, res, next) => {
    var string_help = "";
    for (const command in help) {
        string_help = string_help + command + " - " + help[command] + " || ";
    }
    let result = { "output": string_help };
    res.json(result);
    res.send();
});

app.post("/exchange_today", (req, res, next) => {
    const today = new Date();
    const string_today_date = date.format(today, 'DD.MM.YYYY');
    const from_date = new Date();
    from_date.setDate(from_date.getDate() - 2);
    const string_from_date = date.format(from_date, 'DD.MM.YYYY');
    axios.get(`https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/vybrane.html?od=${string_from_date}&do=${string_today_date}&mena=EUR&format=html`).then(({ data }) => {
        let dat = data;
        let table_from_start = dat.split("<table>")[1];
        let table_to_end = table_from_start.split("</table>")[0];
        let rows = table_to_end.split("\n");
        let max_row = rows[rows.length - 2];
        let exchange_array = max_row.split("</td>");
        let exchange = exchange_array[exchange_array.length - 2].replace("<td>", "");

        let result = { "output": `You must have ${exchange} Czech crowns to have 1 Euro today.` };
        res.json(result);
        res.send();
    });
});

app.listen(process.env.PORT || 5555);