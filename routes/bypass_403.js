const app = require('express');
const router = app.Router();


router.use((req, res, next) => {
    console.log('Replacing URL...');
    let normalizedPath = req.path.replace("//", "/");
    normalizedPath = normalizedPath.replace("/./", "/");
    req.url = normalizedPath;  // Modify the URL for further processing
    next(); // Pass control to the next middleware or route handler
});

router.get('/403/regular', (req, res) => {
    res.status(200).send("Welcome to the backend service!");
});

router.get('/403/secure', (req, res) => {
    res.status(403).send("Forbidden");
});

router.get('/403/custom_headers', (req, res) => {
    if (req.headers['x-forwarded-for']) {
        res.status(200).send("Welcome to the backend service!");
    } else {
        res.status(403).send("Forbidden");
    }
});

router.get('/403/path_override', (req, res) => {
    if (req.headers['x-rewrite-url']) {
        res.status(200).send("Welcome to the backend service!");
    } else {
        res.status(403).send("Forbidden");
    }
});

router.all('/403/http_method', (req, res) => {
    if (req.method === 'PUT') {
        res.status(200).send("Welcome to the backend service!");
    } else {
        res.status(403).send("Forbidden");
    }
});

router.get('/403/http_method_override', (req, res) => {
    if (req.headers['x-http-method-override']) {
        res.status(200).send("Welcome to the backend service!");
    } else {
        res.status(403).send("Forbidden");
    }
});

router.get('/403/user_agent', (req, res) => {
    const secondaryUserAgent = "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:0.9.3) Gecko/20010801";
    const userAgent = req.headers['user-agent'];

    if (userAgent === secondaryUserAgent) {
        res.status(200).send("Welcome to the backend service!");
    } else {
        res.status(403).send("Forbidden");
    }
});

router.get('/403/auth_token', (req, res) => {
    if (req.headers['authorization']) {
        res.status(200).send("Welcome to the backend service!");
    } else {
        res.status(403).send("Forbidden");
    }
});

router.get('/403/port_header_override', (req, res) => {
    if (req.headers['x-forwarded-port'] === '8000') {
        res.status(200).send("Welcome to the backend service!");
    } else {
        res.status(403).send("Forbidden");
    }
});

router.all('/403/all_checks', (req, res) => {
    let responseStatusCode = 403;
    let messages = [];

    if (req.headers['x-forwarded-for']) {
        responseStatusCode = 200;
        messages.push("Custom headers check passed: X-Forwarded-For present");
    }

    if (req.headers['x-rewrite-url']) {
        responseStatusCode = 200;
        messages.push("Path override check passed: X-Rewrite-URL present");
    }

    if (req.method === 'PUT') {
        responseStatusCode = 200;
        messages.push("HTTP method check passed: PUT method");
    }

    if (req.headers['x-http-method-override']) {
        responseStatusCode = 200;
        messages.push("HTTP method override check passed: X-HTTP-Method-Override present");
    }

    const secondaryUserAgent = "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:0.9.3) Gecko/20010801";
    if (req.headers['user-agent'] === secondaryUserAgent) {
        responseStatusCode = 200;
        messages.push("User agent check passed: User-Agent matches");
    }

    if (req.headers['authorization']) {
        responseStatusCode = 200;
        messages.push("Authorization check passed: Authorization header present");
    }

    if (req.headers['x-forwarded-port'] === '8000') {
        responseStatusCode = 200;
        messages.push("Port header override check passed: X-Forwarded-Port is 8000");
    }

    res.status(responseStatusCode).json({ messages });
});

module.exports = router;