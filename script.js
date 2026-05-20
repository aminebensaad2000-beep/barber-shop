document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const bookingPage = document.getElementById('booking-page');
    const adminPage = document.getElementById('admin-page');

    // تقديم الحجز
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const lastBooking = localStorage.getItem('last_booking_time');
        if (lastBooking && (Date.now() - lastBooking < 24 * 60 * 60 * 1000)) {
            alert('عذراً، يمكنك الحجز مرة كل 24 ساعة.');
            return;
        }

        const data = { id: Date.now().toString(), name: document.getElementById('name').value, phone: document.getElementById('phone').value, barber: document.getElementById('barber').value };
        const res = await fetch('/api/bookings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        
        if (res.ok) {
            localStorage.setItem('last_booking_time', Date.now());
            alert('تم الحجز بنجاح!');
            location.reload();
        }
    });

    // الدخول للوحة الإدارة
    document.getElementById('admin-link').addEventListener('click', (e) => {
        e.preventDefault();
        const pass = prompt('ادخل الرمز السري:');
        const roles = {'1234': 'all', '1111': 'حلاق 1', '2222': 'حلاق 2', '3333': 'حلاق 3'};
        
        if(roles[pass]) {
            localStorage.setItem('user_role', roles[pass]); // حفظ الصلاحية
            bookingPage.classList.add('hidden');
            adminPage.classList.remove('hidden');
            loadBookings(roles[pass]);
        } else {
            alert('رمز خاطئ!');
        }
    });

    // تحميل الحجوزات (بدون تحديث الصفحة)
    async function loadBookings(role) {
        const res = await fetch('/api/bookings');
        const bookings = await res.json();
        ['حلاق 1', 'حلاق 2', 'حلاق 3'].forEach(b => {
            const sec = document.getElementById('section-' + b.replace(' ', ''));
            const table = document.getElementById('table-' + b.replace(' ', ''));
            if(role !== 'all' && role !== b) {
                sec.classList.add('hidden');
            } else {
                sec.classList.remove('hidden');
                table.innerHTML = bookings.filter(book => book.barber === b).map(book => 
                    `<tr><td>${book.name}</td><td><a href="tel:${book.phone}">${book.phone}</a></td><td><button onclick="del('${book.id}')">حذف</button></td></tr>`
                ).join('');
            }
        });
    }

    // دالة الحذف الذكية
    window.del = async (id) => {
        if(confirm('هل تريد حذف هذا الحجز؟')) {
            await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
            const currentRole = localStorage.getItem('user_role'); 
            loadBookings(currentRole); // تحديث الجدول فقط دون تحديث الصفحة!
        }
    };
});
