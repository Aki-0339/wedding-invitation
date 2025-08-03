'use strict';

// ==================================
// 0. Fix for Mobile Viewport Height
// ==================================
(() => {
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('load', setVh);
    window.addEventListener('resize', setVh);
})();

// ==================================
// 1. Omotenashi View Logic
// ==================================
(() => {
    const savedStatus = localStorage.getItem('weddingRsvpStatus');

    if (savedStatus) {
        const status = JSON.parse(savedStatus);
        const initialView = document.getElementById('rsvp-initial-view');
        const omotenashiView = document.getElementById('rsvp-omotenashi-view');

        // Hide form and show Omotenashi view
        initialView.style.display = 'none';
        omotenashiView.style.display = 'block';

        // Get dynamic elements
        const mainMessage = omotenashiView.querySelector('.omotenashi-main-message');
        const attendanceSpan = omotenashiView.querySelector('.status-attendance');
        const infoGuest = omotenashiView.querySelector('.info-guest');
        const infoReception = omotenashiView.querySelector('.info-reception');
        const infoFamily = omotenashiView.querySelector('.info-family');
        const infoAbsence = omotenashiView.querySelector('.info-absence');
        const commonInfo = omotenashiView.querySelector('.omotenashi-common-info');
        const shortcuts = omotenashiView.querySelector('.omotenashi-shortcuts');
        const contact = omotenashiView.querySelector('.omotenashi-contact');

        // 1. Display attendance status
        if (status.attendance === '出席') {
            attendanceSpan.textContent = 'ご出席';
            attendanceSpan.classList.add('attending');
            mainMessage.textContent = 'ご返信いただき誠にありがとうございます';
        } else {
            attendanceSpan.textContent = 'ご欠席';
            attendanceSpan.classList.add('absent');
            mainMessage.textContent = 'ご丁寧にご連絡いただきありがとうございます';
        }

        // 2. Display personalized info based on role and attendance
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
        } else { // If absent
            infoAbsence.style.display = 'block';
            commonInfo.style.display = 'none';
            shortcuts.innerHTML = `
                <a href="#gallery" class="shortcut-btn">ギャラリー</a>
                <a href="#greeting" class="shortcut-btn">メッセージをもう一度読む</a>
            `;
            contact.innerHTML = '';
            resetButtonWrapper.style.display = 'none';
        }

        // ★★★ 回答修正用リンクのイベントリスナーを追加 ★★★
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
// 5. Photo Gallery (Slick.js)
// ==================================
{
    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        slidesToShow: 1,
        adaptiveHeight: false,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
    });
}

// ===================================
// 6. RSVP Form Submission
// ===================================
{
    const form = document.getElementById('rsvp-form');
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
                // Save status to localStorage
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

                // Show confirmation and reload to trigger the Omotenashi view
                document.getElementById('rsvp-initial-view').style.display = 'none';
                formMessage.textContent = 'ご返信ありがとうございます。ページを更新します...';
                formMessage.style.display = 'block';
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
            submitButton.disabled = false;
            submitButton.textContent = '送信する';
        });
    });
}

// ==================================
// 7. Initialize AOS (Scroll Animation)
// ==================================
{
    AOS.init({
        duration: 1000,
        once: false,
    });
}