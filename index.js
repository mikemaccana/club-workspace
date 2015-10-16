#!/usr/bin/env node
var log = console.log.bind(console);
var superagent = require('superagent');
var cheerio = require('cheerio');
var config = require('./config.js')

var CAPTIVE_PORTAL_URL = 'http://1.1.103.1/reg.php'

var agent = superagent.agent()

agent
.get(CAPTIVE_PORTAL_URL)
.end(function(err, res){
	if ( err ) {
		return cb(err)
	}

	var $ = cheerio.load(res.text);

	// AFAICT this is a CSRF token
	var magicURLValue = $('input[name=url]').value;

	var loginDetails = {
		'url': magicURLValue,
		'username': config.username,
		'password': config.password
	}

	agent
	.post(CAPTIVE_PORTAL_URL)
	// Superagent uses JSON by default
	.type('form')
	.send(loginDetails)
	.end(function(err, res){
		if ( err ) {
			log(err)
			return
		}
		var $ = cheerio.load(res.text);
		// h2 contains the login successful text
		log($('h2').text())
	})
})
