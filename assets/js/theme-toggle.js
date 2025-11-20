document.addEventListener('DOMContentLoaded', function () {
    const storageKey = 'theme';
    const attr = 'data-theme';
    const dark = 'dark';
    const light = 'light';
  
    const root = document.documentElement; // <html>
    const switchEl = document.getElementById('theme-switch');
  
    // 스위치 요소 없으면 그냥 종료
    if (!switchEl) return;
  
    const buttons = switchEl.querySelectorAll('[data-theme-toggle]');
    const saved = localStorage.getItem(storageKey);
  
    function applyTheme(theme) {
      const t = theme === light ? light : dark;
  
      // 1) html 에 data-theme 설정
      root.setAttribute(attr, t);
      localStorage.setItem(storageKey, t);
  
      // 2) 스위치 상태 클래스 갱신
      switchEl.classList.remove('theme-switch--dark-active', 'theme-switch--light-active');
      switchEl.classList.add(
        t === dark ? 'theme-switch--dark-active' : 'theme-switch--light-active'
      );
    }
  
    // 초기 테마 결정
    if (saved === dark || saved === light) {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? dark : light);
    }
  
    // 버튼 클릭 이벤트
    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        const theme = this.getAttribute('data-theme-toggle');
        applyTheme(theme);
      });
    });
  });
  