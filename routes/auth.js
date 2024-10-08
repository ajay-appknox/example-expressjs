const app = require('express');
const router = app.Router();
const jwt = require('jsonwebtoken');

const USERS = {
    user1: 'password1',
    user2: 'password2'
};

function createToken(payload) {
    return jwt.sign(payload, "secret", { algorithm: 'HS256' });
}

router.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (username && password && USERS[username] === password) {
        const token = createToken({ username });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;