const express = require('express');
const cron = require('node-cron');
const app = express();
app.use(express.json());

let patients = []; // مصفوفة لحفظ الزبائن

// تصفير البيانات يومياً الساعة 8 صباحاً
cron.schedule('0 8 * * *', () => { patients = []; }, { timezone: "Africa/Algiers" });

// تسجيل حجز جديد (الزبون)
app.post('/book', (req, res) => {
    const { name, barber } = req.body;
    patients.push({ name, barber });
    res.status(200).send("تم الحجز بنجاح");
});

// الدخول للإدارة (الحلاق)
app.post('/admin-login', (req, res) => {
    const { password } = req.body;
    const auth = { "0001": "أحمد", "0002": "ياسين", "0003": "صابر" };

    if (auth[password]) {
        const myPatients = patients.filter(p => p.barber === auth[password]);
        res.json({ name: auth[password], patients: myPatients });
    } else {
        res.status(403).send("رقم سري خاطئ");
    }
});

app.listen(3000);
