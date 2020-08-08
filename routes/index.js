var express = require('express');
var router = express.Router();
var request = require('request');
var constants = require('../resources/constants');
var utils = require('../app-utils/utils');
var url = require('url');
var CONSTANTS = constants.CONSTANTS;
var dropboxDao = require('../daos/dropbox-dao.js');


/* GET home page. */
router.get('/', function (req, res, next) {
	var CSRFToken = utils.getCSRFToken();
	res.cookie('csrf', CSRFToken);
	res.redirect(url.format({
		protocol: 'https',
		hostname: 'www.dropbox.com',
		pathname: '1/oauth2/authorize',
		query: {
			client_id: process.env.API_KEY,
			response_type: 'code',
			state: CSRFToken,
			redirect_uri: CONSTANTS.REDIRECT_URI
		}
	}));

});

router.get('/callback', function (req, res, next) {
	if (req.query.error) {
		return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
	}
	if (req.query.state !== req.cookies.csrf) {
		return res.status(401).send(
			'Unauthorized access'
		);
	}
	request.post(CONSTANTS.AUTHTOKEN_URI, {
		form: {
			code: req.query.code,
			grant_type: 'authorization_code',
			redirect_uri: CONSTANTS.REDIRECT_URI
		},
		auth: {
			user: process.env.API_KEY,
			pass: process.env.API_SECRET
		}
	}, function (error, response, body) {
		var data = JSON.parse(body);
		if (data.error) {
			return res.send('ERROR: ' + data.error);
		}
		var token = data.access_token;
		dropboxDao.listFolder(token, function (info) {
			res.render('dashboard', { data: info });
		});
	});
})



module.exports = router;
