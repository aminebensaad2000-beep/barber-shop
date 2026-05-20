// عند تحميل الصفحة، نتحقق فوراً إن كان الحظر قد انتهى أو ما زال سارياً
document.addEventListener("DOMContentLoaded", () => {
    checkBookingExpiry();
});

let selectedBarberName = "";

function checkBookingExpiry() {
    const hasBooked = localStorage.getItem("hasBooked");
    const bookingTime = localStorage.getItem("bookingTime");

    if (hasBooked === "true" && bookingTime) {
        const currentTime = new Date().getTime(); // الوقت الحالي بالملي ثانية
        const timeDifference = currentTime - parseInt(bookingTime); // الفارق الزمني
        
        // 48 ساعة بالملي ثانية = 48 * 60 * 60 * 1000
        const fortyEightHours = 48 * 60 * 60 * 1000;

        if (timeDifference >= fortyEightHours) {
            // إذا مرت 48 ساعة أو أكثر، نقوم بإلغاء الحظر تلقائياً
            localStorage.removeItem("hasBooked");
            localStorage.removeItem("bookingTime");
        } else {
            // إذا لم تمر 48 ساعة بعد، نأخذه لصفحة الحظر مباشرة
            showAlreadyBookedPage();
        }
    }
}

function nextPage(pageId) {
    // نتحقق مجدداً قبل التنقل للتأكد
    checkBookingExpiry();
    if (localStorage.getItem("hasBooked") === "true") {
        return;
    }
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function selectBarber(barberName) {
    selectedBarberName = barberName;
    document.getElementById('chosen-barber').innerText = barberName;
    nextPage('page3');
}

function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    
    console.log(`تم الحجز: (${selectedBarberName}) - العميل (${name}) - الهاتف (${phone})`);
    
    // حفظ حالة الحجز مع تسجيل الوقت الحالي بدقة
    localStorage.setItem("hasBooked", "true");
    localStorage.setItem("bookingTime", new Date().getTime().toString());
    
    document.getElementById('booking-form').reset();
    nextPage('page4');
}

function showAlreadyBookedPage() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const successBox = document.querySelector('.success-box');
    if (successBox) {
        successBox.innerHTML = `
            <h2 style="color: #e74c3c;">! أنت مسجل بالفعل</h2>
            <p>لقد قمت بإجراء حجز مسبق من هذا الهاتف. يمكنك الحجز مجدداً بعد مرور 48 ساعة من حجزك السابق.</p>
        `;
    }
    document.getElementById('page4').classList.add('active');
}