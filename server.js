const express = require('express');
const cron = require('node-cron');
const app = express();
let patients = []; // لائحة الزبائن

app.use(express.json());

// مسح اللائحة تلقائياً الساعة 8 صباحاً
cron.schedule('0 8 * * *', () => {
    patients = [];
    console.log('تم تصفير اللوائح بنجاح!');
}, { timezone: "Africa/Algiers" });

app.get('/patients', (req, res) => res.json(patients));

app.post('/book', (req, res) => {
    const { name, barber } = req.body;
    patients.push({ name, barber });
    res.send('تم الحجز');
});

app.listen(3000, () => console.log('السيرفر يعمل على بورت 3000'));
