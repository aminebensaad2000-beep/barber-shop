const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

let bookings = [];

// 1. استقبال حجز جديد
app.post('/api/bookings', (req, res) => {
    bookings.push(req.body);
    res.status(201).json({ success: true });
});

// 2. جلب الحجوزات
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// 3. حذف حجز
app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    bookings = bookings.filter(b => b.id !== id);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
