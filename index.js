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
const help = { "exchange_today/exchange_today eur ": "exchange today rate Czech crowns to Euro", "help": "my functions", "name": "my name", "time": "time now" };
const can_be_find_exchange = { "eur": "EUR" };
const exchange_output = { "eur": "Euro" };

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/bot.html');
});

app.post("/name", (req, res, next) => {
    let result;
    if (req.body.first == undefined && req.body.second == undefined) {
        result = { "output": `My name is ${name}.` };
    } else {
        result = { "output": "This function haven't any parameter." };
    }
    res.json(result);
    res.send();
});

app.post("/time", (req, res, next) => {
    const today = new Date();
    const string_today_time = date.format(today, 'HH:mm:ss');
    let result;
    if (req.body.first == undefined && req.body.second == undefined) {
        result = { "output": `In this moment is ${string_today_time}.` };
    } else {
        result = { "output": "This function haven't any parameter." };
    }
    res.json(result);
    res.send();
});

app.post("/help", (req, res, next) => {
    let result;
    if (req.body.first == undefined && req.body.second == undefined) {
        var string_help = "";
        for (const command in help) {
            string_help = string_help + command + " - " + help[command] + " || ";
        }
        result = { "output": string_help };
    } else {
        result = { "output": "This function haven't any parameter." };
    }
    res.json(result);
    res.send();
});

app.post("/exchange_today", (req, res, next) => {
    const today = new Date();
    const string_today_date = date.format(today, 'DD.MM.YYYY');
    const from_date = new Date();
    from_date.setDate(from_date.getDate() - 2);
    const string_from_date = date.format(from_date, 'DD.MM.YYYY');

    let getExchange = 0;
    let exchange = "";
    let exghange_printed = "";
    if (req.body.first == undefined && req.body.second == undefined) {
        exchange = can_be_find_exchange["eur"];
        exghange_printed = exchange_output["eur"];
        getExchange = 1;
    } else if (can_be_find_exchange[req.body.first] != null && req.body.second == undefined) {
        exchange = can_be_find_exchange[req.body.first];
        exghange_printed = exchange_output[req.body.first];
        getExchange = 1;
    }
    if (getExchange == 1) {
        axios.get(`https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/vybrane.html?od=${string_from_date}&do=${string_today_date}&mena=${exchange}&format=html`).then(({ data }) => {
            let dat = data;
            let table_from_start = dat.split("<table>")[1];
            let table_to_end = table_from_start.split("</table>")[0];
            let rows = table_to_end.split("\n");
            let max_row = rows[rows.length - 2];
            let exchange_array = max_row.split("</td>");
            let exchange = exchange_array[exchange_array.length - 2].replace("<td>", "");

            let result = { "output": `You must have ${exchange} CZK to have 1 ${exghange_printed} today.` };
            res.json(result);
            res.send();
        });
    } else {
        let result = { "output": "You want some exchange, which I cannot done or you type two parameters." };
        res.json(result);
        res.send();
    }
});

app.listen(process.env.PORT || 5555);