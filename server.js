const express = require('express');
const cron = require('node-cron');
const app = express();
app.use(express.json());
app.use(express.static('.'));

let patients = []; 
let phoneRecords = new Set(); 

// تصفير القوائم يومياً الساعة 8 صباحاً
cron.schedule('0 8 * * *', () => { 
    patients = []; 
    phoneRecords.clear(); 
}, { timezone: "Africa/Algiers" });

app.post('/book', (req, res) => {
    if (phoneRecords.has(req.body.phone)) return res.send('عذراً، لا يمكن الحجز مرتين في نفس اليوم لنفس الرقم.');
    patients.push(req.body);
    phoneRecords.add(req.body.phone);
    res.send('تم تسجيل حجزك بنجاح!');
});

app.post('/admin-list', (req, res) => {
    const auth = { "0001": "أحمد", "0002": "ياسين", "0003": "صابر" };
    const name = auth[req.body.password];
    if (!name) return res.status(403).send('خطأ: رقم سري غير صحيح');
    res.json(patients.filter(p => p.barber === name));
});

app.listen(3000);
