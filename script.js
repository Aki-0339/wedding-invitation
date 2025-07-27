'use strict';

// ==================================
// 1. ローディング演出
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
// 2. スクロール連動エフェクト
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
// 3. 挨拶モーダル（障子演出）
// ==================================
{
  const modal = document.getElementById('greeting-modal');
  const openBtn = document.getElementById('greeting-open-btn');
  const closeBtn = document.getElementById('modal-close-btn');
  const greetingSection = document.getElementById('greeting'); 
  
  const openModal = () => {
    modal.classList.add('is-open');
    setTimeout(() => AOS.refresh(), 500);
  };
  
  const closeModal = () => {
    modal.classList.remove('is-open');
  };
  
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  let hasBeenShown = sessionStorage.getItem('greetingModalShown');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasBeenShown) {
        setTimeout(openModal, 500);
        hasBeenShown = true;
        sessionStorage.setItem('greetingModalShown', 'true');
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(greetingSection);
}

// ==================================
// 4. カウントダウンタイマー
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
// 5. フォトギャラリー（Slick.js）
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
// 6. 出欠フォームの送信処理
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
    
    fetch(GAS_URL, { method: 'POST', body: formData, })
    .then(response => {
      if (!response.ok) {
        throw new Error('ネットワーク応答が正常ではありませんでした。');
      }
      return response.json();
    })
    .then(data => {
      if (data.status === 'success') {
        form.style.display = 'none';
        formMessage.style.display = 'block';

        const attendanceValue = formData.get('attendance');
        const nameValue = formData.get('name');
        let messageText = '';

        if (attendanceValue === '出席') {
          messageText = 'ご多用の中 ご出席とのご返事をいただき\n誠にありがとうございます\n当日お会いできることを心より楽しみにしております';
          
          const receptionList = ['山田', '山内', '受付'];
          const familyList = ['野口', '岡副', '親族'];

          if (receptionList.some(receptionName => nameValue.includes(receptionName))) {
            messageText += '\n\n誠に恐れ入りますが 私共の受付係をお願いいたしたく存じますので\n当日は午後1時45分迄にお越しくださいますようお願い申し上げます';
          } else if (familyList.some(familyName => nameValue.includes(familyName))) {
             messageText += '\n\n誠に恐縮に存じますが 親族紹介にもご列席賜りたく\n当日午後2時10分迄にお越しくださいますようお願い申し上げます';
          }

        } else {
          messageText = 'ご丁寧にご連絡いただきありがとうございます\nお気持ち大変嬉しく存じます\nまたお会いできる日を楽しみにしております';
        }

        formMessage.textContent = messageText;
        setTimeout(() => { formMessage.classList.add('is-show'); }, 100);

      } else {
        throw new Error(data.message || '送信に失敗しました。');
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
// 7. AOS (スクロールアニメーション) の初期化
// ==================================
{
  AOS.init({
    duration: 1000,
    once: false,
  });
}