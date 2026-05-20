document.addEventListener("DOMContentLoaded", () => {
    checkBookingExpiry();
});

let selectedBarberName = "";
const SERVER_URL = window.location.origin; 

function checkBookingExpiry() {
    const hasBooked = localStorage.getItem("hasBooked");
    const bookingTime = localStorage.getItem("bookingTime");

    if (hasBooked === "true" && bookingTime) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - parseInt(bookingTime);
        const fortyEightHours = 48 * 60 * 60 * 1000;

        if (timeDifference >= fortyEightHours) {
            localStorage.removeItem("hasBooked");
            localStorage.removeItem("bookingTime");
            resetSuccessBox();
        } else {
            showAlreadyBookedPage();
        }
    }
}

function nextPage(pageId) {
    if (pageId !== 'admin-page') {
        checkBookingExpiry();
        if (localStorage.getItem("hasBooked") === "true") return;
    }
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// دالة الانتقال المباشر لصفحة الأدمن
window.openAdminPage = function() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('admin-page').classList.add('active');
};

function selectBarber(barberName) {
    selectedBarberName = barberName;
    document.getElementById('chosen-barber').innerText = barberName;
    nextPage('page3');
}

async function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    
    const bookingData = {
        id: Date.now().toString(),
        name: name,
        phone: phone,
        barber: selectedBarberName
    };

    try {
        await fetch(`${SERVER_URL}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        localStorage.setItem("hasBooked", "true");
        localStorage.setItem("bookingTime", new Date().getTime().toString());
        
        document.getElementById('booking-form').reset();
        nextPage('page4');
    } catch (error) {
        alert("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً");
    }
}

function showAlreadyBookedPage() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const successBox = document.querySelector('.success-box');
    if (successBox) {
        successBox.innerHTML = `
            <h2 style="color: #e74c3c;">! أنت مسجل بالفعل</h2>
            <p>لقد قمت بإجراء حجز مسبق من هذا الهاتف. يمكنك الحجز مجدداً بعد مرور 48 ساعة.</p>
        `;
    }
    document.getElementById('page4').classList.add('active');
}

function resetSuccessBox() {
    const successBox = document.querySelector('.success-box');
    if (successBox) {
        successBox.innerHTML = `
            <h2>✓ تم تأكيد التسجيل بنجاح!</h2>
            <p>شكراً لك، ننتظر زيارتك في الموعد المحدد.</p>
            <button onclick="nextPage('page1')">العودة للرئيسية</button>
        `;
    }
}

// ====== لوحة تحكم المالك ======

function loginAdmin(event) {
    event.preventDefault();
    const pass = document.getElementById('admin-password').value;
    
    // كلمة المرور الافتراضية لمالك المحل هي 1234
    if (pass === "1234") {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        loadReservations();
    } else {
        alert("كلمة المرور خاطئة!");
    }
}

function logoutAdmin() {
    document.getElementById('admin-password').value = "";
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-content').style.display = 'none';
    nextPage('page1');
}

async function loadReservations() {
    try {
        const response = await fetch(`${SERVER_URL}/api/bookings`);
        const bookings = await response.json();
        
        const listContainer = document.getElementById('reservations-list');
        listContainer.innerHTML = "";
        
        if (bookings.length === 0) {
            listContainer.innerHTML = `<tr><td colspan="4" style="padding: 20px;">لا توجد حجوزات حالية</td></tr>`;
            return;
        }
        
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
            row.innerHTML = `
                <td style="padding: 12px;">${booking.name}</td>
                <td style="padding: 12px; direction: ltr;">${booking.phone}</td>
                <td style="padding: 12px;">${booking.barber}</td>
                <td style="padding: 12px;">
                    <button onclick="deleteBooking('${booking.id}')" style="background-color: #e74c3c; padding: 5px 10px; font-size: 0.8rem; border-radius: 3px; color: white; border: none; cursor: pointer;">حذف</button>
                </td>
            `;
            listContainer.appendChild(row);
        });
    } catch (error) {
        console.error("خطأ في جلب البيانات");
    }
}

async function deleteBooking(id) {
    if (confirm("هل تريد حذف هذا الحجز؟")) {
        try {
            await fetch(`${SERVER_URL}/api/bookings/${id}`, { method: 'DELETE' });
            loadReservations();
        } catch (error) {
            alert("فشل الحذف");
        }
    }
}
