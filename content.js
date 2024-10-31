// 「生成を続ける」ボタンが表示されたら自動でクリックする関数
const autoContinueGeneration = () => {
  // ボタンのテキストで要素を取得
  const continueButton = Array.from(document.querySelectorAll("button")).find(
    (button) => button.textContent.includes("生成を続ける")
  );
  if (continueButton) {
    continueButton.click();
  }
};

// 10秒ごとに「生成を続ける」ボタンがあるかチェックしてクリック
const startAutoContinueCheck = () => {
  setInterval(() => {
    autoContinueGeneration();
  }, 10000); // 10秒ごとにチェック
};

// 自動生成継続をオン/オフにする状態を監視
chrome.storage.local.get("autoContinueStatus", (data) => {
  const isAutoContinueActive = data.autoContinueStatus;

  if (isAutoContinueActive) {
    startAutoContinueCheck();
  }
});

// 指定されたモデルにリダイレクトする関数
const redirectToModel = (model = "gpt-4o") => {
  const url = new URL(window.location.href);
  if (
    (url.pathname.startsWith("/g/") || url.pathname.startsWith("/gpts/")) &&
    url.searchParams.get("model") !== model
  ) {
    url.searchParams.set("model", model);
    window.location.href = url.toString();
  }
};

// 最初のページのロード時にリダイレクトを実行
redirectToModel();

// ページ内でのURL変更を監視してリダイレクトを実行
const pushStateOriginal = history.pushState;
history.pushState = function () {
  pushStateOriginal.apply(this, arguments);
  redirectToModel();
};

// 新しいチャットが作成されたときに指定したモデルを選択する
const redirectWithModel = (button, model = "gpt-4o") => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const url = new URL(button.href);
    url.searchParams.set("model", model);
    window.location.href = url.toString();
  });
};

// 新しいチャットボタンを監視してリダイレクトを設定
const newChatObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const newChatButton = document.querySelector(
        'a[href^="/g/"], a[href^="/gpts/"]'
      );
      if (newChatButton) {
        redirectWithModel(newChatButton);
      }
    }
  });
});

newChatObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
