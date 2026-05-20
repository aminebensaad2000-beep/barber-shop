// عند تحميل الصفحة، نتحقق فوراً إن كان هذا الهاتف قد سجل من قبل
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("hasBooked") === "true") {
        showAlreadyBookedPage();
    }
});

let selectedBarberName = "";

function nextPage(pageId) {
    // إذا كان الشخص قد سجل سابقاً، نمنعه من التنقل ونتركه في صفحة الحظر
    if (localStorage.getItem("hasBooked") === "true") {
        showAlreadyBookedPage();
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
    
    // هنا السر: نحفظ في ذاكرة الهاتف أنه قام بالتسجيل بنجاح
    localStorage.setItem("hasBooked", "true");
    
    document.getElementById('booking-form').reset();
    nextPage('page4');
}

// دالة خاصة لإظهار صفحة تخبر المستخدم أنه سجل بالفعل وتمنعه من الحجز مجدداً
function showAlreadyBookedPage() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // نقوم بتعديل محتوى الصفحة الرابعة لتناسب حالة المحظور وتمنعه من العودة للرئيسية
    const successBox = document.querySelector('.success-box');
    if (successBox) {
        successBox.innerHTML = `
            <h2 style="color: #e74c3c;">! أنت مسجل بالفعل</h2>
            <p>لقد قمت بإجراء حجز مسبق من هذا الهاتف. لا يمكنك الحجز أكثر من مرة.</p>
        `;
    }
    document.getElementById('page4').classList.add('active');
}