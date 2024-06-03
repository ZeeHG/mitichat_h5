function openApp(): void {
  const userAgent = navigator.userAgent;
  const startTime = new Date().getTime();
  let hasApp = true; // 假设设备上已安装应用

  if (/iPhone|iPod|iPad/i.test(userAgent)) {
    window.location.href = "{$ios_link}"; // 尝试打开 iOS 应用的 URL

    setTimeout(() => {
      const endTime = new Date().getTime();
      if (endTime - startTime < 2000) {
        hasApp = false;
        window.location.href = "{$ios_down}"; // 跳转到 iOS 下载页面的 URL
      }
    }, 1000);
  } else if (/android/i.test(userAgent)) {
    window.location.href = "{$android_link}"; // 尝试打开 Android 应用的 URL

    setTimeout(() => {
      const endTime = new Date().getTime();
      if (endTime - startTime < 2000) {
        hasApp = false;
        window.location.href = "{$android_down}"; // 跳转到 Android 下载页面的 URL
      }
    }, 1000);
  }
}
