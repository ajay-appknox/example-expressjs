/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */

const app = require('express');
const router = app.Router();

router.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' }
    ]);
});

router.post('/api/users', (req, res) => {
    const newUser = req.body;
    res.status(201).json({ message: 'User created', user: newUser });
});

router.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    res.json({ message: `User ${userId} updated`, user: updatedUser });
});

router.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User ${userId} deleted` });
});

module.exports = router;