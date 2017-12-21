const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 8000;
const io = require('socket.io').listen(server);
const fs = require('fs');
const request = require('sync-request');

//ejs engine is used  
app.set('view engine', 'ejs');
//made assets static folder so that no need to provide path for static files
app.use(express.static('assets'));


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

//route to '/server' which provide front-end file as file.ejs
app.get('/server', function (req, res) {
    res.render('file');
})

//sockets used here which wait for client to connect using connection event 
io.sockets.on('connection', function (socket) {
    console.log("Client connected");

    //This event emit only when file being uploaded so that the data shared by the server 
    socket.on('data', function (data) {
        var arrayData = data.array;
        var length = arrayData.length;

        var options = {
            timeout: 120000
        }

        //Take DataSet From API and saved that in file called checkData.txt
        arrayData.forEach(element => {
            var name = element.name1 + " " + element.name2;
            var uri = 'https://api.arcsecond.io/exoplanets/' + name + '/?format=json';

            try {
                res1 = request('GET', uri, options);
                var str = (res1.getBody()).toString();
                fs.appendFileSync('checkData.txt', str + '\n' + ',');
            } catch (e) {
                console.log('ERROR : ' + e);
            }


        });

        ///////DOING TASKS

        var Top_Radius = [];
        var Top_Mass = [];
        var Top_OrbitalPeriod = [];

        //file(checkData) read synchronously in which data have been saved     
        var dataset = fs.readFileSync('checkData.txt', 'utf8');
        dataset = dataset.slice(0, -1);
        dataset = "[" + dataset + "]";

        dataset = JSON.parse(dataset);

        //read the dataset array using foreach loop 
        dataset.forEach(data => {
            if (data.mass != null) {
                Top_Mass.push({ name: data.name, mass: data.mass.value });
            }
            if (data.radius != null) {
                Top_Radius.push({ name: data.name, radius: data.radius.value });
            }
            if (data.orbital_period != null) {
                Top_OrbitalPeriod.push({ name: data.name, orbital_period: data.orbital_period.value });
            }
            return true;

        })

        //data sort in descending order and sliced to 10 values
        Top_Mass.sort(function (a, b) {
            return b.mass - a.mass;
        });
        var topMassPlanet = Top_Mass.slice(0, 10);

        Top_Radius.sort(function (a, b) {
            return b.radius - a.radius;
        });
        var topRadiusPlanet = Top_Radius.slice(0, 10);

        Top_OrbitalPeriod.sort(function (a, b) {
            return b.orbital_period - a.orbital_period;
        });
        var topOrbitalPlanet = Top_OrbitalPeriod.slice(0, 10);

        //data send to client to show or display on the interface    
        socket.emit('output', {
            radius: JSON.stringify(topRadiusPlanet),
            mass: JSON.stringify(topMassPlanet),
            orbit: JSON.stringify(topOrbitalPlanet)
        });


    });

});

//server is listen on provided port number
server.listen(port, function (data) {
    console.log('server is running on port ', port);
});