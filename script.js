document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const bookingPage = document.getElementById('booking-page');
    const adminPage = document.getElementById('admin-page');

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = { id: Date.now().toString(), name: document.getElementById('name').value, phone: document.getElementById('phone').value, barber: document.getElementById('barber').value };
        await fetch('/api/bookings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
        alert('تم الحجز بنجاح!');
        location.reload();
    });

    document.getElementById('admin-link').addEventListener('click', (e) => {
        e.preventDefault();
        const pass = prompt('ادخل الرمز السري:');
        const roles = {'1234': 'all', '1111': 'حلاق 1', '2222': 'حلاق 2', '3333': 'حلاق 3'};
        if(roles[pass]) {
            bookingPage.classList.add('hidden');
            adminPage.classList.remove('hidden');
            loadBookings(roles[pass]);
        }
    });

    async function loadBookings(role) {
        const res = await fetch('/api/bookings');
        const bookings = await res.json();
        ['حلاق 1', 'حلاق 2', 'حلاق 3'].forEach(b => {
            const sec = document.getElementById('section-' + b.replace(' ', ''));
            if(role !== 'all' && role !== b) sec.classList.add('hidden');
            else {
                document.getElementById('table-' + b.replace(' ', '')).innerHTML = bookings.filter(book => book.barber === b).map(book => 
                    `<tr><td>${book.name}</td><td><a href="tel:${book.phone}">${book.phone}</a></td><td><button onclick="del('${book.id}')">حذف</button></td></tr>`
                ).join('');
            }
        });
    }

    window.del = async (id) => {
        await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
        location.reload();
    };
});
