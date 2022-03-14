function init() {
    let res_elm = document.createElement("div");
    res_elm.innerHTML = "Hello, how can I help you? If you haven't idea what I can do send me the command: help.";
    res_elm.setAttribute("class", "left");

    document.getElementById('msg').appendChild(res_elm);
}


document.getElementById('reply').addEventListener("click", async(e) => {
    e.preventDefault();

    var req = document.getElementById('msg_send').value;

    if (req == undefined || req == "") {

    } else {

        var res = "";

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

        let data_req = document.createElement('div');
        let data_res = document.createElement('div');

        let container1 = document.createElement('div');
        let container2 = document.createElement('div');

        container1.setAttribute("class", "msgCon1");
        container2.setAttribute("class", "msgCon2");

        data_req.innerHTML = req;
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

    }
});