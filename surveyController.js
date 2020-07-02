// required packages
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');

// read the data file
function readData(fileName){
    let dataRead = fs.readFileSync('./data/' + fileName + '.json');
    let infoRead = JSON.parse(dataRead);
    return infoRead;
}

// read the data file
function writeData(info, fileName){
    data = JSON.stringify(info);
    fs.writeFileSync('./data/' + fileName + '.json', data);
}

// update the data file, I use "name" to be equal to fruit, or animal or color
// to match with the file names
// I assume we always just add 1 to a single item
function combineCounts(name, value){
    // console.log(value);
    info = readData(name);
     // will be useful for text entry, since the item typed in might not be in the list
    var found = 0;
    for (var i=0; i<info.length; i++){
        if (info[i].answer === value){
            info[i].count = parseInt(info[i].count) + 1;
            found = 1;
        }
    }
    if (found === 0){
        info.push({"answer" : value, count: 1});
    }
    console.log(info);
    writeData(info, name);
}

function addElement(name, value){
    info = readData(name);
    info[0].answers.push(value);
    info[0].count++;
    console.log(info);
    writeData(info, name);
}

// This is the controler per se, with the get/post
module.exports = function(app){

    // when a user goes to localhost:3000/analysis
    // serve a template (ejs file) which will include the data from the data files
    app.get('/analysis', function(req, res){
        var question1 = readData("question1");
        var question2 = readData("question2");
        var question3 = readData("question3");
        var question4 = readData("question4");
        var question5 = readData("question5");
        var question6 = readData("question6");
        var comments = readData("comments");
        res.render('showResults', {results: [question1, question2, question3, question4, question5, question6, comments]});
        console.log([question1, question2, question3, question4, question5, question6, comments]);
    });

    // when a user goes to localhost:3000/bitesiteSurvey
    // serve a static html (the survey itself to fill in)
    app.get('/bitesiteSurvey', function(req, res){
        res.sendFile(__dirname+'/views/bitesiteSurvey.html');
    });

    // when a user types SUBMIT in localhost:3000/niceSurvey 
    // the action.js code will POST, and what is sent in the POST
    // will be recuperated here, parsed and used to update the data files
    app.post('/bitesiteSurvey', urlencodedParser, function(req, res){
        console.log(req.body);
        var json = req.body;
        for (var key in json){
            console.log(key + ": " + json[key]);
            
            if (key === "question1" || key === "question6" || key === "comments"){
                if(json[key] !== ''){
                    addElement(key, json[key]);
                }
            }
            else {
                combineCounts(key, json[key]);
            }
        }
        // mystery line... (if I take it out, the SUBMIT button does change)
        // if anyone can figure this out, let me know!
        res.sendFile(__dirname + "/views/bitesiteSurvey.html");
    });
    

};