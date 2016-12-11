var https = require('https');
var screepsConfig = require('./screepsConfig');

var data = {};

var req = https.request({
	hostname: 'screeps.com',
	port: 443,
	// path: '/api/auth/me',
	// path: '/api/user/rooms?id=5838758f5264786f0892989b',
	path: '/api/user/memory',
	// path: '/api/user/code',
	method: 'GET',
	auth: screepsConfig.login + ':' + screepsConfig.password,
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
        // 'Cookie': 'auth.token=ba1aa56274e07658a603a0e0e7897293f03b1b92'
	}
}, (res) => {
    console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.write(JSON.stringify(data));
// req.write(JSON.stringify(data));
req.end();