let selectedBarberName = "";

function nextPage(pageId) {
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
    
    document.getElementById('booking-form').reset();
    nextPage('page4');
}