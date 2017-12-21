var socket = io.connect();
var arrayList = [];

//upload function is called when user uploaded file in csv format
function Upload() {
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    var data_radius = document.getElementById("data_radius");
    var data_mass = document.getElementById("data_mass");
    var data_orbital = document.getElementById("data_orbital");

    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            //file reader read file which is uploaded
            var reader = new FileReader();
            reader.onload = function (read) {
                var rows = read.target.result.split("\n");
                var str = document.getElementById("List");

                for (var i = 1; i < rows.length; i++) {
                    var cells = rows[i].split(",");
                    arrayList.push({ name1: cells[1], name2: cells[2] });
                }
                //here the data hostname and pl_letter send to server for further processing 
                socket.emit('data', { array: arrayList });
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }

    //this event is called by server and provide data to display 
    socket.on('output', function (data) {
        var radiusPlanet = JSON.parse(data.radius);
        var massPlanet = JSON.parse(data.mass);
        var orbitalPlanet = JSON.parse(data.orbit);

        var table1 = document.createElement("table");
        var table2 = document.createElement("table");
        var table3 = document.createElement("table");
        table1.id = "table1";
        table2.id = "table2";
        table3.id = "table3";

        //creating table to show Top 10 Radius Planet
        var row0 = table1.insertRow(-1);
        var cell001 = row0.insertCell(-1);
        var cell002 = row0.insertCell(-1);
        cell001.innerHTML = "NAME";
        cell002.innerHTML = "RADIUS";
        radiusPlanet.forEach(element => {
            row1 = table1.insertRow(-1);
            cell01 = element.name;
            cell02 = element.radius;

            var cell1 = row1.insertCell(-1);
            cell1.innerHTML = cell01;

            var cell2 = row1.insertCell(-1);
            cell2.innerHTML = cell02;
        })

        data_radius.appendChild(table1);

        //creating table to show Top 10 Mass Planet

        row0 = table2.insertRow(-1);
        cell001 = row0.insertCell(-1);
        cell002 = row0.insertCell(-1);
        cell001.innerHTML = "NAME";
        cell002.innerHTML = "MASS";
        massPlanet.forEach(element => {
            var row1 = table2.insertRow(-1);
            var cell01 = element.name;
            var cell02 = element.mass;

            var cell1 = row1.insertCell(-1);
            cell1.innerHTML = cell01;

            var cell2 = row1.insertCell(-1);
            cell2.innerHTML = cell02;
        })

        data_mass.appendChild(table2);

        //creating table to show Top 10 Orbital-Period Planet

        row0 = table3.insertRow(-1);
        cell001 = row0.insertCell(-1);
        cell002 = row0.insertCell(-1);
        cell001.innerHTML = "NAME";
        cell002.innerHTML = "ORBITAL-PERIOD";


        orbitalPlanet.forEach(element => {
            var row1 = table3.insertRow(-1);
            var cell01 = element.name;
            var cell02 = element.orbital_period;

            var cell1 = row1.insertCell(-1);
            cell1.innerHTML = cell01;

            var cell2 = row1.insertCell(-1);
            cell2.innerHTML = cell02;
        })

        data_orbital.appendChild(table3);
    })

}
