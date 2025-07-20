'use strict';

// ==================================
// 1. ローディング演出
// ==================================
(() => {
  const loadingLogo = document.querySelector('.loading-logo');
  // ページ読み込み後、すぐにロゴ表示アニメーションを開始
  setTimeout(() => {
    loadingLogo.classList.add('is-show');
  }, 100);
  // 画像など全てのリソースが読み込み完了したら、ローディング画面を消す
  window.onload = () => {
    const body = document.querySelector('body');
    setTimeout(() => {
      body.classList.add('loaded');
    }, 1500); // ロゴ表示から1.5秒後に実行
  };
})();

// ==================================
// 2. スクロール連動エフェクト (パララックス)
// ==================================
{
  const body = document.querySelector('body');
  window.addEventListener('scroll', () => {
    // 画面の高さの半分くらいスクロールされたらクラスを付与
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

  // --- 開閉機能 ---
  const openModal = () => {
    modal.classList.add('is-open');
    // 少し遅れてAOSをリフレッシュし、モーダル内のアニメーションを有効化
    setTimeout(() => AOS.refresh(), 500);
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
  };
  
  // --- イベント設定 ---
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) { // 背景の黒い部分をクリックしたら閉じる
      closeModal();
    }
  });

  // --- 初回のみ自動表示 ---
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
    dots: true, infinite: true, speed: 500, fade: true, cssEase: 'linear',
    slidesToShow: 1, adaptiveHeight: false, autoplay: true, autoplaySpeed: 4000, arrows: true,
  });
}

// ===================================
// 6. 出欠フォームの送信処理
// ===================================
{
  const form = document.getElementById('rsvp-form');
  const formMessage = document.getElementById('form-message');
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbz3A3_92ekWk0KJdHEklUR4vuM3NLaSxWGOWG8CCaxFNoZPt4XuJ0bLaHrTguuUAOv7/exec'; // あなたのGASのURLに書き換えてください

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    const formData = new FormData(form);
    fetch(GAS_URL, { method: 'POST', body: formData, })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        form.style.display = 'none';
        formMessage.style.display = 'block';
        formMessage.textContent = '（実装修正中ー苗字によって文言を判定）ご返信ありがとうございます。当日お会いできるのを楽しみにしております！（受付の人の場合）誠に恐れ入りますが私共の受付係をお願いいたしたく存じますので\n当日は午後１時４５分迄に\nお越しくださいますようお願い申し上げます\n（親族向け）誠に恐縮に存じますが親族紹介にもご列席賜りたく\n当日午後２時１０分迄に\nお越しくださいますようお願い申し上げます';
        formMessage.style.color = '#333';
        setTimeout(() => { formMessage.classList.add('is-show'); }, 100);
      } else { throw new Error('送信に失敗しました。'); }
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
    once: false, // falseにすることでアニメーションが繰り返される
  });
}