const app = require('express');
const router = app.Router();

const convertObjectToString = (object) => {
	return Object.entries(object)
		.map(([key, value]) => `${key}: ${value}`)
		.join('\n');
};

router.get('/api/trace/', (req, res) => {
	res.status(405).send("Method not allowed");
});

router.trace('/api/trace/', (req, res) => {
	res.send(`TRACE HTTP/1.1\n${convertObjectToString(req.headers)}\n\n${JSON.stringify(req.body)}`);
});

router.trace('/api/trace/secure/', (req, res) => {
	if(req.headers["authorization"] != undefined) {
		res.send(`TRACE HTTP/1.1\n${convertObjectToString(req.headers)}\n\n${JSON.stringify(req.body)}`);
	} else {
		res.send(`Authorization Header is missing`);
	}
});

router.trace('/api/trace/filtered/', (req, res) => {
	var new_headers = req.headers;
	blacklisted_headers = [
		"host",
		"user-agent",
		"accept-encoding",
		"accept",
		"connection",
		"authorization",
		"content-length",
	]
	for(var i in new_headers) {
		if(blacklisted_headers.indexOf(i) > -1) {
			delete new_headers[i]
		}
	}
	res.send(`TRACE HTTP/1.1\n${convertObjectToString(new_headers)}\n\n${JSON.stringify(req.body)}`);
});

// use((req, res, next) => {
//   if (req.method === 'TRACE') {
//     res.send(`TRACE request received. Headers:\n${JSON.stringify(req.headers, null, 2)}`);
//   } else {
//     next();
//   }
// });

module.exports = router;
