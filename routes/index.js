var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Scraping route
router.get('/scrape', function(req, res) {
    url = 'http://www.imdb.com/title/tt1663202/';
    json = { title : "", otherInfo : ""};
    //Callback at the end of scraping to write scraped data to output file
    //Sends a header back to the front-end to notify user that output will be in a file
    callback = function() {
          fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
              console.log("Output successfully written to a file, check directory");
          });
          res.send("Check the file for output"); 
    }
    //Starting GET request
    request(url, function(error, response, html) {
    	console.log("Starting request - This may take long or may timeout");
        if(!error) {
          //Store content of IMBD page into its DOM(HTML) format for jQuery like navigation
          var $dom = cheerio.load(html);
          var title;
          var release;
          var rating;
          //Easily navigate the DOM by jumping to a node with a specific class
          $dom('.title_wrapper').filter(function() {
              var $element = $dom(this);
              title = $element.children().first().text();
              json.title = title.replace(/\s/g, '');
              otherInfo = $element.children().last().children().text();
              json.otherInfo = otherInfo.replace(/\s/g, '');
              callback();          
          });
        } else {
        	console.log("There was an error in retrieving the DOM");
        }
    });
});

module.exports = router;
