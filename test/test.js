const server = require('../index.js');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);
const date = require('date-and-time');
const test_config = require('./for_tests.json');

const today = new Date();
const string_today_time = date.format(today, 'HH:mm:ss');
const today_number_of_day = today.getDay();
const today_exchange_eur = test_config["EUR"];
const history_of_exchange_eur = test_config["history_EUR"];
const help_function = test_config["help"];
const average_of_exchange_eur = test_config["average_EUR"];

describe('Get name of bot', () => {

    it('POST /name – get name of bot without any parameter', async() => {
        const res = await requestWithSupertest.post('/name');
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("My name is Tony.");
    });
});

describe('Get name of bot', () => {

    it('POST /name – get name of bot with one parameter', async() => {
        const req = { first: "ssss" };
        const res = await requestWithSupertest.post('/name').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("This function haven't any parameter.");
    });
});

describe('Get name of bot', () => {

    it('POST /name – get name of bot with two parameters', async() => {
        const req = { first: "sss", second: "aaa" };
        const res = await requestWithSupertest.post('/name').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("This function haven't any parameter.");
    });
});

describe('Get actual time', () => {

    it('POST /time – actual time', async() => {
        const res = await requestWithSupertest.post('/time');
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual(`In this moment is ${string_today_time}.`);
    });
});

describe('Get actual time', () => {

    it('POST /time – actual time with one parameter', async() => {
        const req = { first: "ssss" };
        const res = await requestWithSupertest.post('/time').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("This function haven't any parameter.");
    });
});

describe('Get actual time', () => {

    it('POST /time – actual time with two parameters', async() => {
        const req = { first: "sss", second: "aaa" };
        const res = await requestWithSupertest.post('/time').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("This function haven't any parameter.");
    });
});

describe('Get help', () => {

    it('POST /help – get help', async() => {
        const res = await requestWithSupertest.post('/help');
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual(help_function);
    });
});

describe('Get help', () => {

    it('POST /help – get help with one parameter', async() => {
        const req = { first: "ssss" };
        const res = await requestWithSupertest.post('/help').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("This function haven't any parameter.");
    });
});

describe('Get help', () => {

    it('POST /help – get help with two parameters', async() => {
        const req = { first: "sss", second: "aaa" };
        const res = await requestWithSupertest.post('/help').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("This function haven't any parameter.");
    });
});

describe('Get today exchange', () => {

    it('POST /exchange_today – get today exchange Czech Crowns to Euro default', async() => {
        const res = await requestWithSupertest.post('/exchange_today');
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual(`You must have ${today_exchange_eur} CZK to have 1 Euro today.`);
    });
});


describe('Get today exchange', () => {

    it('POST /exchange_today – get today exchange Czech Crowns to Euro with one parameter', async() => {
        const req = { first: "eur" };
        const res = await requestWithSupertest.post('/exchange_today').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual(`You must have ${today_exchange_eur} CZK to have 1 Euro today.`);
    });
});


describe('Get today exchange', () => {

    it('POST /exchange_today – get today exchange with one parameter not implemented', async() => {
        const req = { first: "usd" };
        const res = await requestWithSupertest.post('/exchange_today').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("You want some exchange, which I cannot done or you type two parameters.");
    });
});

describe('Get today exchange', () => {

    it('POST /exchange_today – get today exchange with two parameters not implemented', async() => {
        const req = { first: "usd", second: "aaa" };
        const res = await requestWithSupertest.post('/exchange_today').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("You want some exchange, which I cannot done or you type two parameters.");
    });
});


describe('Get today exchange', () => {

    it('POST /exchange_today – get today exchange Czech Crowns to Euro with added second parameter', async() => {
        const req = { first: "eur", second: "aaa" };
        const res = await requestWithSupertest.post('/exchange_today').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("You want some exchange, which I cannot done or you type two parameters.");
    });
});

if (today_number_of_day == (6 || 7)) {
    describe('Get history from server day in weekend', () => {

        it('POST /history – get today history of exchange from start of server', async() => {
            const res = await requestWithSupertest.post('/history');
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual("It is weekend and I live from this weekend, I am sorry. Came back in Monday for first history.");
        });
    });

    describe('Get history from server day in weekend', () => {

        it('POST /history – get today history of exchange from start of server with one parameter', async() => {
            const req = { first: "eur" };
            const res = await requestWithSupertest.post('/history').send(req);
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual("It is weekend and I live from this weekend, I am sorry. Came back in Monday for first history.");
        });
    });

    describe('Get history from server day in weekend', () => {

        it('POST /history – get today history of exchange from start of server with first bad parameter', async() => {
            const req = { first: "usd" };
            const res = await requestWithSupertest.post('/history').send(req);
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual("It is weekend and I live from this weekend, I am sorry. Came back in Monday for first history.");
        });
    });

    describe('Get history from server day in weekend', () => {

        it('POST /history – get today history of exchange from start of server with more parameter', async() => {
            const req = { first: "usd", second: "eur" };
            const res = await requestWithSupertest.post('/history').send(req);
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual("It is weekend and I live from this weekend, I am sorry. Came back in Monday for first history.");
        });
    });
} else {
    describe('Get history from server day', () => {

        it('POST /history – get today history of exchange from start of server', async() => {
            const res = await requestWithSupertest.post('/history');
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual(`Exchange history for Euro from start of server is ${history_of_exchange_eur}.`);
        });
    });

    describe('Get history from server day', () => {

        it('POST /history – get today history of exchange from start of server with one parameter', async() => {
            const req = { first: "eur" };
            const res = await requestWithSupertest.post('/history').send(req);
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual(`Exchange history for Euro from start of server is ${history_of_exchange_eur}.`);
        });
    });

    describe('Get history from server day', () => {

        it('POST /history – get today history of exchange from start of server with first bad parameter', async() => {
            const req = { first: "usd" };
            const res = await requestWithSupertest.post('/history').send(req);
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual("You want some history for exchange, which I cannot done or you type more than one parameter.");
        });
    });

    describe('Get history from server day', () => {

        it('POST /history – get today history of exchange from start of server with more parameter', async() => {
            const req = { first: "usd", second: "eur" };
            const res = await requestWithSupertest.post('/history').send(req);
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual("You want some history for exchange, which I cannot done or you type more than one parameter.");
        });
    });
}

describe('Do undefined function', () => {

    it('POST /undefined – undefined function', async() => {
        const res = await requestWithSupertest.post('/undefined');
        expect(res.status).toEqual(404);
    });
});

describe('Get method', () => {

    it('GET / – chatbot', async() => {
        const res = await requestWithSupertest.get('/');
        expect(res.status).toEqual(200);
    });
});

describe('Get method', () => {

    it('GET /undefined – undefined', async() => {
        const res = await requestWithSupertest.get('/undefined');
        expect(res.status).toEqual(404);
    });
});

if (Number(average_of_exchange_eur) < 10) {
    describe('Check, if the consumer can buy EUR', () => {

        it('POST /check – check the euro', async() => {
            const req = { first: "eur" };
            const res = await requestWithSupertest.post('/check').send(req);
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual(`The exchange is good. The average of changes in 3 days is ${average_of_exchange_eur} %. I recommend you to buy it.`);
        });
    });
} else {
    describe('Check, if the consumer can buy EUR', () => {

        it('POST /check – check the euro', async() => {
            const req = { first: "eur" };
            const res = await requestWithSupertest.post('/check').send(req);
            expect(res.status).toEqual(200);
            expect(res.body.output).toEqual(`The exchange is not good. The average of changes in 3 days is ${average_of_exchange_eur} %. I do not recommend you to buy it.`);
        });
    });
}

describe('Check, if the consumer can buy EUR', () => {

    it('POST /check – check the usd', async() => {
        const req = { first: "usd" };
        const res = await requestWithSupertest.post('/check').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("You want some exchange, which I cannot done or you type two parameters.");
    });
});

describe('Check, if the consumer can buy EUR', () => {

    it('POST /check – check the usd and second parameter (more parameters)', async() => {
        const req = { first: "usd", second: "eur" };
        const res = await requestWithSupertest.post('/check').send(req);
        expect(res.status).toEqual(200);
        expect(res.body.output).toEqual("You want some exchange, which I cannot done or you type two parameters.");
    });
});

server.stop();