function init() {
    let res_elm = document.createElement("div");
    res_elm.innerHTML = "Hello, how can I help you? If you haven't idea what I can do send me the command: help / Help.";
    res_elm.setAttribute("class", "left");

    document.getElementById('msg').appendChild(res_elm);
}

document.getElementById('msg_send').addEventListener("keypress", async(e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("reply").click();
    }
});

document.getElementById('reply').addEventListener("click", async(e) => {
    e.preventDefault();

    let sended_message = document.getElementById('msg_send').value;

    var req = "";

    if (sended_message.match(/help/) || sended_message.match(/Help/)) {
        req = "help";
    } else if (sended_message.match(/What is your name/) || sended_message.match(/what is your name/)) {
        req = "name";
    } else if (sended_message.match(/What is the time/) || sended_message.match(/what is the time/)) {
        req = "time";
    } else if (sended_message.match(/What is the course/) || sended_message.match(/what is the course/)) {
        req = "exchange_today";
    } else if (sended_message.match(/What is the course for EUR/) || sended_message.match(/what is the course for EUR/)) {
        req = "exchange_today eur";
    } else if (sended_message.match(/What is the history/) || sended_message.match(/what is the history/)) {
        req = "history";
    } else if (sended_message.match(/What is the history for EUR/) || sended_message.match(/what is the history for EUR/)) {
        req = "history eur";
    } else if (sended_message.match(/Can I buy EUR/) || sended_message.match(/can I buy EUR/)) {
        req = "check eur";
    }


    var res = "";

    if (req == undefined || req == "") {
        res = "I don't understand you. If you haven't idea what I can do. Send me the command: help / Help";
    } else {
        var requests = req.split(" ");

        var data;
        try {
            if (requests.length > 1) {
                if (requests.length == 2) {
                    const response = await fetch(`/${requests[0]}`, {
                        method: 'POST',
                        body: `first=${requests[1]}`,
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        }
                    });
                    data = await response.json();
                }
                if (requests.length == 3) {
                    const response = await fetch(`/${requests[0]}`, {
                        method: 'POST',
                        body: `first=${requests[1]}&second=${requests[2]}`,
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        }
                    });
                    data = await response.json();
                }
            } else {
                const response = await fetch(`/${requests[0]}`, {
                    method: 'POST'
                });
                data = await response.json();
            }
            for (const x in data) {
                res = data[x];
            }
        } catch (error) {
            res = "This function isn't defined.";
        }
    }
    let data_req = document.createElement('div');
    let data_res = document.createElement('div');

    let container1 = document.createElement('div');
    let container2 = document.createElement('div');

    container1.setAttribute("class", "msgCon1");
    container2.setAttribute("class", "msgCon2");

    data_req.innerHTML = sended_message;
    data_res.innerHTML = res;


    data_req.setAttribute("class", "right");
    data_res.setAttribute("class", "left");

    let message = document.getElementById('msg');


    message.appendChild(container1);
    message.appendChild(container2);

    container1.appendChild(data_req);
    container2.appendChild(data_res);

    document.getElementById('msg_send').value = "";

    function scroll() {
        var scrollMsg = document.getElementById('msg')
        scrollMsg.scrollTop = scrollMsg.scrollHeight;
    }
    scroll();
});