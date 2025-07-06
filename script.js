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
    // 目標の日時を設定
    const targetDate = new Date('2025/11/08 15:00:00');
    // 現在の時刻を取得
    const now = new Date();
    // 残り時間をミリ秒で計算
    const remainingTime = targetDate.getTime() - now.getTime();

    // 期限が過ぎた場合
    if (remainingTime < 0) {
      document.getElementById('countdown-timer').innerHTML = 'Our Wedding has Started!';
      return;
    }

    // ミリ秒を日、時間、分、秒に変換
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // HTMLに表示
    document.getElementById('countdown-timer').innerHTML = 
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  // 1秒ごとにcountdown関数を呼び出す
  setInterval(countdown, 1000);
  // ページ読み込み時にも一度実行
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
        formMessage.style.display = 'block'; // メッセージを表示
        formMessage.style.color = '#333';
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
    once: true,     // アニメーションを1回だけ実行する
  });
}