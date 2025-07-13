'use strict';

// ==================================
// ローディング演出
// ==================================
// 即時実行関数で囲む
(() => {
  const loadingLogo = document.querySelector('.loading-logo');

  // ★★★ まず、ロゴに is-show クラスを付けて表示アニメーションを開始 ★★★
  // 少し遅延させることで、CSSのtransitionが確実に発動する
  setTimeout(() => {
    loadingLogo.classList.add('is-show');
  }, 100); // 0.1秒後

  // windowの読み込みが"全て"完了したら、ローディング画面を消す
  window.onload = () => {
    const body = document.querySelector('body');
    // .loaded クラスを付けて、メインコンテンツの表示とローディング画面を消すアニメーションを開始
    setTimeout(() => {
      body.classList.add('loaded');
    }, 1500); // ロゴが表示されてから1.5秒後に実行
  };
})();

// ==================================
// カウントダウンタイマー
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

    const days = String(Math.floor(remainingTime / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const hours = String(Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((remainingTime % (1000 * 60)) / 1000)).padStart(2, '0');

    // HTML構造を動的に生成
    timerElement.innerHTML = `
      <div class="timer-unit">
        <span class="timer-value">${days}</span>
        <span class="timer-label">DAYS</span>
      </div>
      <div class="timer-unit">
        <span class="timer-value">${hours}</span>
        <span class="timer-label">HOURS</span>
      </div>
      <div class="timer-unit">
        <span class="timer-value">${minutes}</span>
        <span class="timer-label">MINUTES</span>
      </div>
      <div class="timer-unit">
        <span class="timer-value">${seconds}</span>
        <span class="timer-label">SECONDS</span>
      </div>
    `;
  }
  
  setInterval(countdown, 1000);
  countdown();
}

// ==================================
// フォトギャラリー（スライドショー）
// ==================================
{
  $('.slider').slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true, /* ★追加★ ふわっと切り替わるエフェクト */
    cssEase: 'linear', /* ★追加★ fadeと合わせて使う */
    slidesToShow: 1,
    adaptiveHeight: false, /* ★変更★ 高さを固定するためfalseに */
    autoplay: true,        /* 自動再生をON */
    autoplaySpeed: 2000,   /* 4秒ごとに切り替え */
    arrows: true,          /* 左右の矢印を表示 */
  });
}

// ===================================
// 出欠フォームの送信処理
// ===================================
{
  const form = document.getElementById('rsvp-form');
  const formMessage = document.getElementById('form-message');
  
  // ★ここにあなたのGASのウェブアプリURLを貼り付け★
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbz3A3_92ekWk0KJdHEklUR4vuM3NLaSxWGOWG8CCaxFNoZPt4XuJ0bLaHrTguuUAOv7/exec';

  form.addEventListener('submit', function(e) {
    // フォームのデフォルトの送信動作をキャンセル
    e.preventDefault();

    // 送信ボタンを無効化して二重送信を防ぐ
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    
    // フォームのデータを準備
    const formData = new FormData(form);

    // fetch APIを使ってGASにデータを送信
    fetch(GAS_URL, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // 成功した場合
        form.style.display = 'none'; // フォームを非表示に
        formMessage.textContent = 'ご返信ありがとうございます。当日お会いできるのを楽しみにしております！';
        formMessage.style.display = 'block'; // まず表示領域を確保
        formMessage.style.color = '#333';
        
        // 少し遅れてクラスを付与し、フェードインアニメーションを開始
        setTimeout(() => {
          formMessage.classList.add('is-show');
        }, 100);
      } else {
        // 失敗した場合
        throw new Error('送信に失敗しました。');
      }
    })
    .catch(error => {
      // エラー処理
      formMessage.textContent = 'エラーが発生しました。時間をおいて再度お試しください。';
      formMessage.style.display = 'block';
      formMessage.style.color = 'red';
      // 送信ボタンを元に戻す
      submitButton.disabled = false;
      submitButton.textContent = '送信する';
    });
  });
}

// ==================================
// AOS (スクロールアニメーション) の初期化
// ==================================
{
  AOS.init({
    duration: 1000, // アニメーションが完了するまでの時間（ミリ秒）
    once: false,     // アニメーションを1回だけ実行する
  });
}

// ==================================
// スクロール連動エフェクト
// ==================================
{
  const body = document.querySelector('body');
  window.addEventListener('scroll', () => {
    // 画面の高さの半分くらいスクロールされたら
    if (window.scrollY > window.innerHeight / 2) {
      body.classList.add('scrolled');
    } else {
      body.classList.remove('scrolled');
    }
  });
}

// ==================================
// 挨拶モーダル（障子）の表示・非表示制御 - 修正版
// ==================================
{
  const modal = document.getElementById('greeting-modal');
  const openBtn = document.getElementById('greeting-open-btn');
  const closeBtn = document.getElementById('modal-close-btn');
  const greetingSection = document.getElementById('greeting');
  
  const openModal = () => {
    modal.classList.add('is-open');
    // AOSアニメーションを再初期化してモーダル内で動かす
    // 少し遅延させて、モーダル表示アニメーションが終わってから発動
    setTimeout(() => AOS.refresh(), 800);
  };
  const closeModal = () => modal.classList.remove('is-open');
  
  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    // パネルの外側（黒い背景）をクリックした場合のみ閉じる
    if (e.target === modal) closeModal();
  });

  // 初回のみ自動で開くロジックは以前のものを流用
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