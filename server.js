const express = require('express');
const cron = require('node-cron');
const app = express();
app.use(express.json());
app.use(express.static('.'));

let patients = [];
let phoneRecords = new Set();

cron.schedule('0 8 * * *', () => { patients = []; phoneRecords.clear(); });

app.post('/book', (req, res) => {
    if (phoneRecords.has(req.body.phone)) return res.send('عذراً، مسجل مسبقاً لهذا اليوم!');
    patients.push(req.body);
    phoneRecords.add(req.body.phone);
    res.send('تم التسجيل بنجاح');
});

app.post('/admin-list', (req, res) => {
    const auth = { "0001": "أحمد", "0002": "ياسين", "0003": "صابر" };
    if (!auth[req.body.password]) return res.status(403).send('Error');
    res.json(patients.filter(p => p.barber === auth[req.body.password]));
});

app.post('/delete', (req, res) => {
    patients = patients.filter(p => p.phone !== req.body.phone);
    res.send('تم الحذف');
});

app.listen(3000);
