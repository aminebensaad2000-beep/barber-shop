const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// تشغيل الملفات الثابتة مباشرة من المجلد الرئيسي للمشروع
app.use(express.static(__dirname));

// تخزين الحجوزات في ذاكرة السيرفر
let bookings = [];

// جلب الحجوزات
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

// استقبال حجز جديد
app.post('/api/bookings', (req, res) => {
    const newBooking = req.body;
    bookings.push(newBooking);
    res.status(201).json({ message: 'تم الحجز بنجاح' });
});

// حذف حجز
app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    bookings = bookings.filter(b => b.id !== id);
    res.json({ message: 'تم حذف الحجز بنجاح' });
});

// توجيه أي رابط فرعي لفتح صفحة index.html الرئيسية
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
