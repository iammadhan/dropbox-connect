var crypto=require('crypto');
exports.getCSRFToken=function() {
	return crypto.randomBytes(18).toString('base64')
		.replace(/\//g, '-').replace(/\+/g, '_');
}
