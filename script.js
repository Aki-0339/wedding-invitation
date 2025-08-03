'use strict';

// ==================================
// 1. Omotenashi View Logic
// ==================================
(() => {
    const savedStatus = localStorage.getItem('weddingRsvpStatus');

    if (savedStatus) {
        const status = JSON.parse(savedStatus);
        const initialView = document.getElementById('rsvp-initial-view');
        const omotenashiView = document.getElementById('rsvp-omotenashi-view');

        initialView.style.display = 'none';
        omotenashiView.style.display = 'block';

        const mainMessage = omotenashiView.querySelector('.omotenashi-main-message');
        const attendanceSpan = omotenashiView.querySelector('.status-attendance');
        const infoGuest = omotenashiView.querySelector('.info-guest');
        const infoReception = omotenashiView.querySelector('.info-reception');
        const infoFamily = omotenashiView.querySelector('.info-family');
        const infoAbsence = omotenashiView.querySelector('.info-absence');
        const commonInfo = omotenashiView.querySelector('.omotenashi-common-info');
        const shortcuts = omotenashiView.querySelector('.omotenashi-shortcuts');
        const contact = omotenashiView.querySelector('.omotenashi-contact');

        if (status.attendance === '出席') {
            attendanceSpan.textContent = 'ご出席';
            attendanceSpan.classList.add('attending');
            mainMessage.textContent = 'ご返信いただき誠にありがとうございます';
        } else {
            attendanceSpan.textContent = 'ご欠席';
            attendanceSpan.classList.add('absent');
            mainMessage.textContent = 'ご丁寧にご連絡いただきありがとうございます';
        }

        infoGuest.style.display = 'none';
        infoReception.style.display = 'none';
        infoFamily.style.display = 'none';
        infoAbsence.style.display = 'none';

        if (status.attendance === '出席') {
            shortcuts.innerHTML = `
                <a href="#info" class="shortcut-btn">会場MAP</a>
                <a href="#gallery" class="shortcut-btn">ギャラリー</a>
            `;
            contact.innerHTML = '※アレルギー等、ご入力内容の確認・変更をご希望の場合は、<br>お手数ですが新郎新婦へ直接ご連絡ください';

            switch (status.role) {
                case 'reception':
                    infoReception.style.display = 'block';
                    break;
                case 'family':
                    infoFamily.style.display = 'block';
                    break;
                default:
                    infoGuest.style.display = 'block';
                    break;
            }
        } else {
            infoAbsence.style.display = 'block';
            commonInfo.style.display = 'none';
            shortcuts.innerHTML = `
                <a href="#gallery" class="shortcut-btn">ギャラリー</a>
                <a href="#greeting" class="shortcut-btn">メッセージをもう一度読む</a>
            `;
            contact.innerHTML = '';
        }

        const resetButton = document.getElementById('reset-rsvp-btn');
        if (resetButton) {
            resetButton.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('現在のご回答内容をリセットして、再度入力フォームを表示します。よろしいですか？')) {
                    localStorage.removeItem('weddingRsvpStatus');
                    alert('ご登録内容をリセットしました。ページを再読み込みします。');
                    location.reload();
                }
            });
        }
    }
})();


// ==================================
// 2. Loading Animation
// ==================================
(() => {
    const loadingLogo = document.querySelector('.loading-logo');
    setTimeout(() => {
        loadingLogo.classList.add('is-show');
    }, 100);
    window.onload = () => {
        const body = document.querySelector('body');
        setTimeout(() => {
            body.classList.add('loaded');
        }, 1500);
    };
})();

// ==================================
// 3. Scroll Effects
// ==================================
{
    const body = document.querySelector('body');
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight / 2) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }
    });
}

// ==================================
// 4. Countdown Timer
// ==================================
{
    function countdown() {
        const targetDate = new Date('2025/11/08 15:00:00');
        const now = new Date();
        const remainingTime = targetDate.getTime() - now.getTime();
        const timerElement = document.getElementById('countdown-timer');

        if (!timerElement) return;

        if (remainingTime < 0) {
            timerElement.innerHTML = '<div class="timer-unit"><span class="timer-value">Our Wedding has Started!</span></div>';
            return;
        }

        const f = (num) => String(num).padStart(2, '0');
        const days = f(Math.floor(remainingTime / (1000 * 60 * 60 * 24)));
        const hours = f(Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = f(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)));
        const seconds = f(Math.floor((remainingTime % (1000 * 60)) / 1000));

        timerElement.innerHTML = `
      <div class="timer-unit"><span class="timer-value">${days}</span><span class="timer-label">DAYS</span></div>
      <div class="timer-unit"><span class="timer-value">${hours}</span><span class="timer-label">HOURS</span></div>
      <div class="timer-unit"><span class="timer-value">${minutes}</span><span class="timer-label">MINUTES</span></div>
      <div class="timer-unit"><span class="timer-value">${seconds}</span><span class="timer-label">SECONDS</span></div>
    `;
    }
    setInterval(countdown, 1000);
    countdown();
}

// ==================================
// 5. Photo Gallery (Swiper.js with Lightbox)
// ==================================
{
    const swiper = new Swiper('.mySwiper', {
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (lightbox) {
        document.querySelectorAll('.swiper-slide img').forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                // ★★★ 修正箇所 ★★★
                lightboxImg.src = img.src; 
                lightboxCaption.textContent = img.dataset.caption || '';
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
}

// ===================================
// 6. RSVP Form Submission
// ===================================
{
    const form = document.getElementById('rsvp-form');
    if (form) {
        const formMessage = document.getElementById('form-message');
        const GAS_URL = 'https://script.google.com/macros/s/AKfycbz3A3_92ekWk0KJdHEklUR4vuM3NLaSxWGOWG8CCaxFNoZPt4XuJ0bLaHrTguuUAOv7/exec';

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = '送信中...';

            const formData = new FormData(form);

            fetch(GAS_URL, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const nameValue = formData.get('name');
                    const attendanceValue = formData.get('attendance');
                    const receptionList = ['宗野', '山内', '受付'];
                    const familyList = ['野口', '岡副', '親族'];
                    let role = 'guest';

                    if (receptionList.some(receptionName => nameValue.includes(receptionName))) {
                        role = 'reception';
                    } else if (familyList.some(familyName => nameValue.includes(familyName))) {
                        role = 'family';
                    }

                    const rsvpStatus = {
                        submitted: true,
                        role: role,
                        attendance: attendanceValue
                    };
                    localStorage.setItem('weddingRsvpStatus', JSON.stringify(rsvpStatus));

                    document.getElementById('rsvp-initial-view').style.display = 'none';
                    formMessage.textContent = 'ご返信ありがとうございます。ページを更新します...';
                    formMessage.style.display = 'block';
                    formMessage.classList.add('is-show');
                    setTimeout(() => {
                        location.reload();
                    }, 1500);

                } else {
                    throw new Error('送信に失敗しました。');
                }
            })
            .catch(error => {
                formMessage.style.display = 'block';
                formMessage.textContent = 'エラーが発生しました。時間をおいて再度お試しください。';
                formMessage.style.color = 'red';
                formMessage.classList.add('is-show');
                submitButton.disabled = false;
                submitButton.textContent = '送信する';
            });
        });
    }
}

// ==================================
// 7. Add to Calendar Function
// ==================================
(() => {
    const title = "晃広＆瑠里奈 Wedding";
    const startTime = new Date('2025-11-08T15:00:00+09:00'); 
    const endTime = new Date('2025-11-08T17:30:00+09:00');
    const location = "ストリングスホテル名古屋 愛知県名古屋市中村区平池町4-60-7";
    const description = "晃広＆瑠里奈 Wedding Reception\n\n挙式：午後3時00分\n披露宴：午後3時50分\n\n当日はお気をつけてお越しください。";

    const googleBtn = document.getElementById('google-calendar-btn');
    if (googleBtn) {
        const formatGoogleDate = (date) => date.toISOString().replace(/[-:.]/g, '').slice(0, -4) + 'Z';
        const googleUrl = new URL('https://www.google.com/calendar/render');
        googleUrl.searchParams.append('action', 'TEMPLATE');
        googleUrl.searchParams.append('text', title);
        googleUrl.searchParams.append('dates', `${formatGoogleDate(startTime)}/${formatGoogleDate(endTime)}`);
        googleUrl.searchParams.append('details', description);
        googleUrl.searchParams.append('location', location);
        googleBtn.href = googleUrl.toString();
    }
    
    const appleBtn = document.getElementById('apple-calendar-btn');
    if (appleBtn) {
        const formatIcsDate = (date) => {
            const pad = (n) => n < 10 ? '0' + n : n;
            return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
        }
        
        const icsData = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            'DTSTAMP:' + new Date().toISOString().replace(/[-:.]/g, ''),
            'UID:' + Math.random().toString(36).substring(2) + '@your-wedding.com',
            'SUMMARY:' + title,
            'DESCRIPTION:' + description.replace(/\n/g, '\\n'),
            'LOCATION:' + location,
            'DTSTART;TZID=Asia/Tokyo:' + formatIcsDate(startTime),
            'DTEND;TZID=Asia/Tokyo:' + formatIcsDate(endTime),
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
        
        appleBtn.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsData);
    }
})();

// ==================================
// 8. Initialize AOS (Scroll Animation)
// ==================================
{
    AOS.init({
        duration: 1000,
        once: false,
    });
}