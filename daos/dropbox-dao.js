var constants = require('../resources/constants');
var CONSTANTS = constants.CONSTANTS;
var request = require('request');
exports.getAccountInfo = function (token, callback) {
	request.get(CONSTANTS.ACCOUNTINFO_URI, {
		headers: { Authorization: 'Bearer ' + token }
	}, function (error, response, body) {
		try {
			var accountInfo = JSON.parse(body);
			callback(accountInfo);
		}
		catch (e) {
			callback(e);
		}

	});
}
exports.listFolderContinue = function (token, cursor, callback) {

	var postData = {
		"cursor": cursor
	}

	var url = CONSTANTS.LIST_FOLDER_CONTINUE;
	var options = {
		method: 'post',
		body: postData,
		json: true,
		url: url,
		headers: { Authorization: 'Bearer ' + token }
	}
	request(options, function (err, res, body) {

		if (err) {
			callback(err);
		}
		else {

			var files = res.body.entries;
			console.dir(files)
			callback(files)
		}

	})

}
exports.listFolder = function (token, callback) {

	var postData = {
		"path": "",
		"recursive": true,
		"include_media_info": false,
		"include_deleted": false,
		"include_has_explicit_shared_members": false
	}

	var url = CONSTANTS.LIST_FOLDER;
	var options = {
		method: 'post',
		body: postData,
		json: true,
		url: url,
		headers: { Authorization: 'Bearer ' + token }
	}
	request(options, function (err, res, body) {

		if (err) {
			callback(err);
		}
		else {

			var files = res.body.entries;

			console.dir(files)
			callback(files)
		}

	})

}