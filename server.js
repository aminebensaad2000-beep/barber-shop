const express = require('express');
const cron = require('node-cron');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.')); // ليقرأ ملفات الـ html

let patients = []; // قائمة الزبائن

// تصفير اللائحة يومياً الساعة 8 صباحاً بتوقيت الجزائر
cron.schedule('0 8 * * *', () => { patients = []; }, { timezone: "Africa/Algiers" });

// مسار تسجيل الزبون
app.post('/book', (req, res) => {
    const { name, barber } = req.body;
    patients.push({ name, barber });
    res.status(200).send("تم الحجز بنجاح");
});

// مسار التحقق من كلمة سر الحلاق
app.post('/admin-login', (req, res) => {
    const { password } = req.body;
    const auth = { "0001": "أحمد", "0002": "ياسين", "0003": "صابر" };

    if (auth[password]) {
        const barberName = auth[password];
        const myPatients = patients.filter(p => p.barber === barberName);
        res.json({ name: barberName, patients: myPatients });
    } else {
        res.status(403).send("خطأ");
    }
});

// إرجاع قائمة الزبائن كاملة (إذا احتاجتها صفحة أخرى)
app.get('/patients', (req, res) => res.json(patients));

app.listen(3000, () => console.log('السيرفر يعمل...'));
