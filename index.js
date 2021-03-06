const express = require("express");
const app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const axios = require('axios');
const date = require('date-and-time');
const config_file = require('./config.json');

app.set('views', path.join(__dirname, 'views'));

nunjucks.configure('views', {
    autoescape: true,
    cache: false,
    express: app
});

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//data
const name = config_file["name"];
const help = config_file["help"];
const can_be_find_exchange = config_file["can_be_find_exchange"];
const exchange_output = config_file["exchange_output"];
//const start_day_date_string = date.format(new Date(), 'DD.MM.YYYY');
const start_day_date_string = config_file["date_deploy"];

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
    from_date.setDate(from_date.getDate() - 6);
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

app.post("/history", (req, res, next) => {
    const today = new Date();
    const string_today_date = date.format(today, 'DD.MM.YYYY');

    const tomorow = new Date();
    tomorow.setDate(tomorow.getDate() + 1);
    const string_tomorow_date = date.format(tomorow, 'DD.MM.YYYY');

    if ((start_day_date_string == string_today_date || start_day_date_string == string_tomorow_date) && today.getDay() == (6 || 7)) {
        let result = { "output": "It is weekend and I live from this weekend, I am sorry. Came back in Monday for first history." };
        res.json(result);
        res.send();
    } else {
        let getExchange = 0;
        let exchange = "";
        let exghange_printed = "";
        if (req.body.first == undefined) {
            exchange = can_be_find_exchange["eur"];
            exghange_printed = exchange_output["eur"];
            getExchange = 1;
        } else if (can_be_find_exchange[req.body.first] != null && req.body.second == undefined) {
            exchange = can_be_find_exchange[req.body.first];
            exghange_printed = exchange_output[req.body.first];
            getExchange = 1;
        }

        if (getExchange == 1) {
            axios.get(`https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/vybrane.html?od=${start_day_date_string}&do=${string_today_date}&mena=${exchange}&format=html`).then(({ data }) => {
                let output = "";
                let dat = data;
                let table_from_start = dat.split("<table>")[1];
                let table_to_end = table_from_start.split("</table>")[0];
                let rows = table_to_end.split("\n");
                for (let i = 2; i < rows.length - 1; i++) {
                    output = `${output}{${rows[i].split("</td>")[0].replace("<tr><td>", "")}: ${rows[i].split("</td>")[1].replace("<td>", "")}},`
                }

                let result = { "output": `Exchange history for ${exghange_printed} from start of server is ${output}.` };
                res.json(result);
                res.send();
            });
        } else {
            let result = { "output": "You want some history for exchange, which I cannot done or you type more than one parameter." };
            res.json(result);
            res.send();
        }
    }
});

app.post("/check", (req, res, next) => {
    const today = new Date();
    const string_today_date = date.format(today, 'DD.MM.YYYY');
    const from_date = new Date();
    from_date.setDate(from_date.getDate() - 9);
    const string_from_date = date.format(from_date, 'DD.MM.YYYY');

    let getExchange = 0;
    let exchange = "";
    let exghange_printed = "";
    if (can_be_find_exchange[req.body.first] != null && req.body.second == undefined) {
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
            let preprelast_row = rows[rows.length - 4];
            let prelast_row = rows[rows.length - 3];
            let last_row = rows[rows.length - 2];

            let array_preprelast_row = preprelast_row.split("</td>");
            let array_prelast_row = prelast_row.split("</td>");
            let array_last_row = last_row.split("</td>");

            let preprelast_date = array_preprelast_row[0].replace("<tr><td>", "");
            let prelast_date = array_prelast_row[0].replace("<tr><td>", "");
            let last_date = array_last_row[0].replace("<tr><td>", "");

            let preprelast_course = Number(array_preprelast_row[1].replace("<td>", "").replace(",", "."));
            let prelast_course = Number(array_prelast_row[1].replace("<td>", "").replace(",", "."));
            let last_course = Number(array_last_row[1].replace("<td>", "").replace(",", "."));

            let first_change_in_percent = ((prelast_course - preprelast_course) / preprelast_course) * 100
            let second_change_in_percent = ((last_course - prelast_course) / prelast_course) * 100
            let avg_of_percents = (first_change_in_percent + second_change_in_percent) / 2;

            let avg_of_percents_two_decimals = avg_of_percents.toFixed(2);

            let result = { "output": `You must have ${exchange} CZK to have 1 ${exghange_printed} today.` };

            if (avg_of_percents >= 10) {
                result = { "output": `The exchange is not good. The average of changes in 3 days is ${avg_of_percents_two_decimals} %. I do not recommend you to buy it.` };
            } else {
                result = { "output": `The exchange is good. The average of changes in 3 days is ${avg_of_percents_two_decimals} %. I recommend you to buy it.` };
            }

            res.json(result);
            res.send();
        });
    } else {
        let result = { "output": "You want some exchange, which I cannot done or you type two parameters." };
        res.json(result);
        res.send();
    }
});

const server = app.listen(process.env.PORT || 5555);

function stop() {
    server.close();
}

module.exports = app;
module.exports.stop = stop;