let isAutoContinueActive = false;

// 拡張機能のストレージから状態を取得してボタンの表示を更新
chrome.storage.local.get("autoContinueStatus", (data) => {
  isAutoContinueActive = data.autoContinueStatus || false;
  document.getElementById("activate").innerText = isAutoContinueActive
    ? "Deactivate"
    : "Activate";
});

document.getElementById("activate").addEventListener("click", () => {
  isAutoContinueActive = !isAutoContinueActive;
  const status = isAutoContinueActive ? "activated" : "deactivated";
  document.getElementById("activate").innerText = isAutoContinueActive
    ? "Deactivate"
    : "Activate";

  // ストレージに状態を保存
  chrome.storage.local.set({ autoContinueStatus: isAutoContinueActive }, () => {
    console.log(`Auto Continue is now ${status}`);
  });
});
