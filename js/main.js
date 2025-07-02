// header_top
const header = document.getElementById('header');
const spacer = document.getElementById('spacer');

window.addEventListener('scroll', () => {
  if (window.scrollY > 90) {
    header.classList.add('fixed');
    spacer.classList.add('active'); // 防止內容跳動
  } else {
    header.classList.remove('fixed');
    spacer.classList.remove('active');
  }
});

// ----------------------------------------------------------------------------------------

// menu 漢堡選單
document.querySelectorAll('.hamburger').forEach(hamburger => {
  const menuId = hamburger.dataset.menu;
  const navMenu = document.getElementById(menuId);

  // 檢查是否找到對應的選單
  if (!navMenu) {
    console.warn(`找不到對應的選單: ${menuId}`);
    return;
  }

  // 點擊漢堡切換該選單
  hamburger.addEventListener('click', (e) => {
    e.preventDefault(); // 防止預設行為
    e.stopPropagation(); // 防止冒泡到 window
    closeAllMenusExcept(navMenu);
    navMenu.classList.toggle('show');
  });

  // 點選選單內部不關閉
  navMenu.addEventListener('click', (e) => {
    e.stopPropagation(); // 防止冒泡到 window
  });
});

// 點擊畫面其他區域時，關閉所有選單
window.addEventListener('click', () => {
  closeAllMenusExcept(null);
});

// 關閉除了指定 menu 外的所有選單
function closeAllMenusExcept(currentMenu) {
  document.querySelectorAll('.nav-menu').forEach(menu => {
    if (menu !== currentMenu) {
      menu.classList.remove('show');
    }
  });
}

// ----------------------------------------------------------------------------------------

// 錨點 scroll
document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', (e) => {
    // 可自訂：GA 追蹤、動畫、console log 等
    console.log(`前往 ${link.getAttribute('href')}`);
  });
});

// ----------------------------------------------------------------------------------------

// language 語系
function toggleDropdown(event) {
  event.preventDefault();
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}

// 移除重複的 window.onclick，統一使用下面的 document.addEventListener

function changeLanguage(langCode) {
  // 關閉下拉選單
  document.getElementById('dropdownMenu').classList.remove('show');

  // 更新頂部圖示
  const topIcon = document.querySelector('.dropdown-toggle img');
  const newIconSrc = `./images/icon_${langCode === 'en' ? '1' :
    langCode === 'zh-CN' ? '2' :
      langCode === 'ja' ? '3' :
        langCode === 'pt' ? '4' : '1'
    }.svg`;

  if (topIcon) {
    topIcon.src = newIconSrc;
    topIcon.alt = `icon_${langCode}`;
  }

  // 設置 cookie
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.host}`;
  document.cookie = `googtrans=/en/${langCode}; path=/`;

  // 重新加載翻譯
  location.reload();
}

// 檢查當前語言並設置對應圖示
function setLanguageIcon() {
  const topIcon = document.querySelector('.dropdown-toggle img');
  if (!topIcon) return;

  // 從 cookie 獲取當前語言
  const cookie = document.cookie.split(';').find(c => c.trim().startsWith('googtrans='));
  let currentLang = 'en'; // 默認英文

  if (cookie) {
    const langCode = cookie.split('/')[2];
    currentLang = langCode;
  }

  // 設置對應圖示
  const newIconSrc = `./images/icon_${currentLang === 'en' ? '1' :
    currentLang === 'zh-CN' ? '2' :
      currentLang === 'ja' ? '3' :
        currentLang === 'pt' ? '4' : '1'
    }.svg`;

  topIcon.src = newIconSrc;
  topIcon.alt = `icon_${currentLang}`;
}

// 頁面加載時執行
window.addEventListener('load', setLanguageIcon);


// Close dropdown menus when clicking outside
document.addEventListener('click', (event) => {
  // Close language dropdown
  const dropdownMenu = document.getElementById('dropdownMenu');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  if (dropdownMenu && !dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.remove('show');
  }

  // Close all hamburger menus when clicking outside
  document.querySelectorAll('.hamburger').forEach(hamburger => {
    const menuId = hamburger.dataset.menu;
    const navMenu = document.getElementById(menuId);
    if (navMenu && !hamburger.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.classList.remove('show');
    }
  });

  // Close all dropdown-content menus when clicking outside
  if (!event.target.closest('.dropdown-toggle')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove("show");
    }
  }
});

// ----------------------------------------------------------------------------------------

// 多組跑馬燈配置系統
const marqueeConfigs = [
  {
    containerId: "marqueeContainer",
    imagePrefix: "games_min",
    imageCount: 23,
    lines: 1,
    altText: "Game",
    folder: "games_min/"
  },
  {
    containerId: "marqueeContainer_2", 
    imagePrefix: "product_img",
    imageCount: 2,
    lines: 1,
    altText: "Product",
    folder: ""
  },
];

// 通用跑馬燈創建函數
function createMarquee(config) {
  const container = document.getElementById(config.containerId);
  if (!container) {
    console.warn(`找不到跑馬燈容器: ${config.containerId}`);
    return;
  }

  // 清空容器
  container.innerHTML = '';

  // 創建圖片批次
  const imageBatches = [
    Array.from(
      { length: config.imageCount },
      (_, i) => `./images/${config.folder}${config.imagePrefix}_${i + 1}.png`
    ),
    Array.from(
      { length: config.imageCount },
      (_, i) => `./images/${config.folder}${config.imagePrefix}_${i + 1}.png`
    )
  ];

  for (let lineIndex = 0; lineIndex < config.lines; lineIndex++) {
    const line = document.createElement("div");
    line.className = "marquee-line";

    const track = document.createElement("div");
    track.className = "marquee-track";
    track.classList.add(lineIndex % 2 === 0 ? "scroll-left" : "scroll-right");

    // 動畫設定 - 調整為更慢的速度
    const minDuration = 60;
    const maxDuration = 150;
    const speedVariation = minDuration + Math.random() * (maxDuration - minDuration);
    const animationDuration = speedVariation + (lineIndex * 5);
    const animationDelay = -Math.floor(animationDuration / 2);
    track.style.animationDuration = `${animationDuration}s`;
    track.style.animationDelay = `${animationDelay}s`;

    const urls = imageBatches[lineIndex % imageBatches.length];

    // 複製圖片組以實現無限循環效果
    for (let k = 0; k < 8; k++) {
      urls.forEach((url, imageIndex) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = `${config.altText} ${imageIndex + 1}`;
        img.loading = "lazy";
        track.appendChild(img);
      });
    }

    line.appendChild(track);
    container.appendChild(line);
  }
}

// 初始化所有跑馬燈
marqueeConfigs.forEach(config => {
  createMarquee(config);
});

// ----------------------------------------------------------------------------------------

// 第二個跑馬燈已整合到上方的多組配置系統中

