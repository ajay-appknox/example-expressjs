const app = require('express');
const router = app.Router();

router.get('/api/csp/insecure/', (req, res) => {
	const csp = "default-src 'self'; script-src 'https://example.com'";
	res.set("Content-Security-Policy", csp);
	res.send("CSP HTTP/1.1\n" + csp);
});

router.get('/api/csp/secure/', (req, res) => {
	const csp = "script-src 'strict-dynamic' 'nonce-rAnd0m123' 'unsafe-inline' http: https:; object-src 'none'; base-uri 'none';";
	res.set("Content-Security-Policy", csp);
	res.send("CSP HTTP/1.1\n" + csp);
});

module.exports = router;
