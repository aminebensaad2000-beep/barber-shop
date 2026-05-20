document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    const bookingPage = document.getElementById('booking-page');
    const adminPage = document.getElementById('admin-page');
    const adminLink = document.getElementById('admin-link');
    const logoutBtn = document.getElementById('logout-btn');

    // جداول الحلاقين الثلاثة
    const tableBarber1 = document.getElementById('table-barber1');
    const tableBarber2 = document.getElementById('table-barber2');
    const tableBarber3 = document.getElementById('table-barber3');

    // 1. استقبال الحجز وتحديد القفل لـ 24 ساعة
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const lastBookingTime = localStorage.getItem('booking_timestamp');
        const currentTime = Date.now();

        // فحص مرور 24 ساعة (24 ساعة * 60 دقيقة * 60 ثانية * 1000 مللي ثانية)
        if (lastBookingTime && (currentTime - lastBookingTime < 24 * 60 * 60 * 1000)) {
            alert('لقد قمت بالحجز بالفعل! لا يمكنك الحجز مجدداً إلا بعد مرور 24 ساعة.');
            return;
        }

        const bookingData = {
            id: currentTime.toString(),
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            barber: document.getElementById('barber').value
        };

        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            alert('تم تأكيد حجزك بنجاح! يرجى الالتزام بالموعد.');
            localStorage.setItem('booking_timestamp', currentTime); // حفظ وقت الحجز الحالي
            bookingForm.reset();
        } else {
            alert('حدث خطأ أثناء الحجز، يرجى المحاولة مرة أخرى.');
        }
    });

    // 2. التحكم في الدخول بكلمة السر
    function checkRoute() {
        if (window.location.hash === '#admin-page') {
            const password = prompt('الرجاء إدخال كلمة المرور السرية للمالك:');
            if (password === '1234') {
                bookingPage.classList.add('hidden');
                adminPage.classList.remove('hidden');
                loadBookings();
            } else {
                alert('كلمة المرور خاطئة!');
                window.location.hash = '';
            }
        } else {
            adminPage.classList.add('hidden');
            bookingPage.classList.remove('hidden');
        }
    }

    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#admin-page';
        checkRoute();
    });

    logoutBtn.addEventListener('click', () => {
        window.location.hash = '';
        checkRoute();
    });

    // 3. جلب وتوزيع الحجوزات مع ميزة الاتصال التلقائي
    async function loadBookings() {
        const response = await fetch('/api/bookings');
        const bookings = await response.json();

        tableBarber1.innerHTML = '';
        tableBarber2.innerHTML = '';
        tableBarber3.innerHTML = '';

        bookings.forEach(booking => {
            const tr = document.createElement('tr');
            // جعل رقم الهاتف عبارة عن رابط يتصل مباشرة عند الضغط عليه href="tel:number"
            tr.innerHTML = `
                <td>${booking.name}</td>
                <td><a href="tel:${booking.phone}" class="phone-link">📞 ${booking.phone}</a></td>
                <td><button class="btn-delete" data-id="${booking.id}">حذف</button></td>
            `;

            if (booking.barber === 'حلاق 1') {
                tableBarber1.appendChild(tr);
            } else if (booking.barber === 'حلاق 2') {
                tableBarber2.appendChild(tr);
            } else if (booking.barber === 'حلاق 3') {
                tableBarber3.appendChild(tr);
            }
        });

        // تفعيل أزرار الحذف
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
                    const delRes = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
                    if (delRes.ok) {
                        loadBookings();
                    }
                }
            });
        });
    }

    window.addEventListener('hashchange', checkRoute);
});
