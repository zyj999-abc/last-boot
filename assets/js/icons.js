/* ============================================================
 * 《最后一次开机》 年代拟物 SVG 图标库
 * 参考 her-old-laptop 的内联 SVG 方案：精确、可缩放、带光泽
 * 用法：svgIcon('mycomp') 返回可直接插入的 HTML
 * ============================================================ */

const SVGI = {
  /* ---- 我的电脑：CRT 显示器 ---- */
  mycomp:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbMcShell" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#eef3f8"/><stop offset=".45" stop-color="#c2d0de"/><stop offset="1" stop-color="#8ba0b6"/>
      </linearGradient>
      <linearGradient id="lbMcScr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6db3e8"/><stop offset="1" stop-color="#16467c"/>
      </linearGradient>
      <linearGradient id="lbMcBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#dde6ee"/><stop offset="1" stop-color="#93a7bb"/>
      </linearGradient>
    </defs>
    <rect x="5" y="6" width="38" height="29" rx="3" fill="url(#lbMcShell)" stroke="#4a5a6c"/>
    <rect x="9" y="10" width="30" height="21" rx="1.5" fill="url(#lbMcScr)" stroke="#26415e"/>
    <path d="M9 12 Q24 8.5 39 11.5 L39 15 Q24 12 9 16.5 Z" fill="#ffffff" opacity=".22"/>
    <rect x="20" y="35" width="8" height="4" fill="#a9b7c5" stroke="#5a6a7c"/>
    <rect x="11" y="39" width="26" height="5" rx="1.5" fill="url(#lbMcBase)" stroke="#4a5a6c"/>
    <circle cx="33.5" cy="41.5" r="1.4" fill="#3ecf52" stroke="#1d7a2e" stroke-width=".6"/>
  </svg>`,

  /* ---- 文件夹 ---- */
  folder:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbFdF" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffe08e"/><stop offset=".55" stop-color="#f2ab2e"/><stop offset="1" stop-color="#d98d10"/>
      </linearGradient>
    </defs>
    <path d="M4 13 L17 13 L20 16 L44 16 L44 21 L4 21 Z" fill="#f5c96a" stroke="#c99321"/>
    <rect x="25" y="4" width="17" height="13" fill="#ffffff" stroke="#b9c2cc" transform="rotate(7 33.5 10.5)"/>
    <path d="M4 17 H44 V38 Q44 41.5 40.5 41.5 H7.5 Q4 41.5 4 38 Z" fill="url(#lbFdF)" stroke="#c99321"/>
    <path d="M5.5 18.5 H42.5 V21.5 Q24 25.5 5.5 22 Z" fill="#ffffff" opacity=".28"/>
  </svg>`,

  /* ---- 回收站 ---- */
  recycle:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbRbB" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#aecbe4"/><stop offset=".5" stop-color="#dcedfa"/><stop offset="1" stop-color="#9fc2de"/>
      </linearGradient>
    </defs>
    <path d="M12 15 L36 15 L33.2 41 Q33 44 30 44 H18 Q15 44 14.8 41 Z" fill="url(#lbRbB)" stroke="#58799a"/>
    <path d="M17 17 L18.6 42 M24 17 V42 M31 17 L29.4 42" stroke="#8fb4d4" stroke-width="1"/>
    <ellipse cx="24" cy="14.5" rx="13" ry="4.2" fill="#e2effa" stroke="#58799a"/>
    <ellipse cx="24" cy="14.5" rx="9.5" ry="2.6" fill="#7ea6c8"/>
    <text x="24" y="35" text-anchor="middle" font-size="15" fill="#2f9e44" stroke="#ffffff" stroke-width=".7" paint-order="stroke">♻</text>
  </svg>`,

  /* ---- IE 浏览器 ---- */
  ie:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="21.5" rx="17" ry="7.5" fill="none" stroke="#e8b90f" stroke-width="4.4"
             transform="rotate(-17 24 21.5)" opacity=".95"/>
    <text x="24" y="33" text-anchor="middle" font-family="'Times New Roman',serif" font-style="italic"
          font-weight="bold" font-size="31" fill="url(#lbIeB)"
          stroke="#ffffff" stroke-width="1" paint-order="stroke">e</text>
    <defs>
      <linearGradient id="lbIeB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#49a8ec"/><stop offset="1" stop-color="#114a8b"/>
      </linearGradient>
    </defs>
    <path d="M7.5 26.5 A 16.5 7.2 -17 0 0 40.5 18.5" fill="none" stroke="#e8b90f" stroke-width="4.4" stroke-linecap="round"/>
  </svg>`,

  /* ---- 信封（江州邮局） ---- */
  mail:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbMl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e2e8ef"/>
      </linearGradient>
    </defs>
    <rect x="5" y="11" width="38" height="27" rx="2" fill="url(#lbMl)" stroke="#8794a2"/>
    <path d="M5 12 L24 27 L43 12" fill="none" stroke="#97a4b2" stroke-width="2"/>
    <path d="M5 38 L19 24 M43 38 L29 24" fill="none" stroke="#c4cdd6" stroke-width="1.6"/>
  </svg>`,

  /* ---- 记事本 ---- */
  note:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="6" width="30" height="37" rx="1.5" fill="#ffffff" stroke="#8a99ab"/>
    <path d="M13 14 H35 M13 20 H35 M13 26 H35 M13 32 H30" stroke="#b9d0ea" stroke-width="1.4"/>
    <path d="M16 10 H32" stroke="#e8a0a0" stroke-width="1.4"/>
    <path d="M39 34 L39 43 L30 43 Z" fill="#dfe7ef" stroke="#8a99ab"/>
    <circle cx="14" cy="6.5" r="1.1" fill="#6b7c90"/><circle cx="24" cy="6.5" r="1.1" fill="#6b7c90"/><circle cx="34" cy="6.5" r="1.1" fill="#6b7c90"/>
  </svg>`,

  /* ---- 媒体播放器 ---- */
  wmp:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lbWp" cx=".35" cy=".28" r=".85">
        <stop offset="0" stop-color="#ffc978"/><stop offset=".55" stop-color="#f47b20"/><stop offset="1" stop-color="#c95408"/>
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="19" fill="url(#lbWp)" stroke="#a84a08" stroke-width="1.5"/>
    <circle cx="24" cy="24" r="15.5" fill="none" stroke="#ffffff" stroke-width="1.2" opacity=".35"/>
    <path d="M19.5 15.5 L33 24 L19.5 32.5 Z" fill="#ffffff" stroke="#d9d9d9" stroke-width=".8"/>
  </svg>`,

  /* ---- 软盘 ---- */
  floppy:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbFl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#41538a"/><stop offset="1" stop-color="#1a2547"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="32" height="32" rx="2" fill="url(#lbFl)" stroke="#101a33"/>
    <rect x="18" y="8" width="13" height="12" fill="#dfe3ea" stroke="#222c44"/>
    <rect x="26.5" y="9.5" width="3.4" height="9" fill="#8d99ae"/>
    <rect x="13" y="26" width="22" height="13" fill="#f4f4f4" stroke="#b9b9b9"/>
    <path d="M16 30 H32 M16 33 H32 M16 36 H27" stroke="#9aa5b5" stroke-width="1"/>
  </svg>`,

  /* ---- 光盘 ---- */
  cd:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lbCdA" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#f2f6fa"/><stop offset=".62" stop-color="#dbe4ee"/><stop offset=".68" stop-color="#ffffff"/><stop offset="1" stop-color="#b6c5d6"/>
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="19" fill="url(#lbCdA)" stroke="#97a5b6"/>
    <path d="M24 5 A19 19 0 0 1 43 24" fill="none" stroke="#ffb900" stroke-width="2" opacity=".35"/>
    <path d="M24 43 A19 19 0 0 1 5 24" fill="none" stroke="#00a4ef" stroke-width="2" opacity=".3"/>
    <circle cx="24" cy="24" r="5" fill="#eef2f6" stroke="#9fb0c0"/>
    <circle cx="24" cy="24" r="2.4" fill="#ffffff" stroke="#c2ced9"/>
  </svg>`,

  /* ---- 硬盘 ---- */
  hdd:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbHd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f0f4f8"/><stop offset=".6" stop-color="#bcc8d4"/><stop offset="1" stop-color="#94a3b4"/>
      </linearGradient>
    </defs>
    <rect x="6" y="13" width="36" height="23" rx="3" fill="url(#lbHd)" stroke="#5b6b7d"/>
    <rect x="9" y="24" width="30" height="9" rx="1.5" fill="#eef2f6" stroke="#8496aa"/>
    <circle cx="34" cy="28.5" r="2" fill="#3ecf52" stroke="#1d7a2e" stroke-width=".6"/>
    <path d="M12 27 H26 M12 30 H26" stroke="#aab6c4" stroke-width="1.4"/>
  </svg>`,

  /* ---- 日历 ---- */
  cal:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="9" width="34" height="32" rx="2" fill="#ffffff" stroke="#8496aa"/>
    <rect x="7" y="9" width="34" height="9" rx="2" fill="#d9534f" stroke="#a83232"/>
    <path d="M14 6 V11 M24 6 V11 M34 6 V11" stroke="#7a4a4a" stroke-width="2" stroke-linecap="round"/>
    <text x="24" y="35" text-anchor="middle" font-family="Tahoma" font-weight="bold" font-size="15" fill="#33465a">31</text>
  </svg>`,

  /* ---- 文件类：txt ---- */
  txt:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5 H30 L38 13 V43 H11 Z" fill="#ffffff" stroke="#97a4b3"/>
    <path d="M30 5 L38 13 H30 Z" fill="#dfe6ee" stroke="#97a4b3"/>
    <path d="M15 18 H33 M15 23 H33 M15 28 H33 M15 33 H28" stroke="#b9c8da" stroke-width="1.6"/>
  </svg>`,

  /* ---- 文件类：Word ---- */
  word:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5 H30 L38 13 V43 H11 Z" fill="#ffffff" stroke="#97a4b3"/>
    <path d="M30 5 L38 13 H30 Z" fill="#dfe6ee" stroke="#97a4b3"/>
    <rect x="14" y="18" width="13" height="13" rx="1.5" fill="url(#lbWdB)" stroke="#1e3f73"/>
    <defs><linearGradient id="lbWdB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a80c8"/><stop offset="1" stop-color="#274a86"/></linearGradient></defs>
    <text x="20.5" y="28.5" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="11" fill="#ffffff">W</text>
    <path d="M30 21 H34 M30 25 H34 M30 29 H34" stroke="#b9c8da" stroke-width="1.5"/>
  </svg>`,

  /* ---- 文件类：图片 ---- */
  pic:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5 H30 L38 13 V43 H11 Z" fill="#ffffff" stroke="#97a4b3"/>
    <path d="M30 5 L38 13 H30 Z" fill="#dfe6ee" stroke="#97a4b3"/>
    <rect x="14" y="17" width="21" height="18" fill="#b9ddf7" stroke="#8496aa"/>
    <circle cx="21" cy="24" r="3" fill="#ffd94d"/>
    <path d="M14 32 L22 26 L28 31 L33 27 L35 30 V35 H14 Z" fill="#7cc46b"/>
  </svg>`,

  /* ---- 文件类：音乐 ---- */
  music:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5 H30 L38 13 V43 H11 Z" fill="#ffffff" stroke="#97a4b3"/>
    <path d="M30 5 L38 13 H30 Z" fill="#dfe6ee" stroke="#97a4b3"/>
    <path d="M22 32 V17 L32 14 V29" fill="none" stroke="#7a4fb3" stroke-width="2.2"/>
    <ellipse cx="19.5" cy="32.5" rx="3.2" ry="2.5" fill="#7a4fb3"/>
    <ellipse cx="29.5" cy="29.5" rx="3.2" ry="2.5" fill="#7a4fb3"/>
  </svg>`,

  /* ---- 录音磁带 ---- */
  tape:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lbTp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e8edf3"/><stop offset=".5" stop-color="#b7c3d1"/><stop offset="1" stop-color="#93a3b5"/>
      </linearGradient>
    </defs>
    <rect x="5" y="13" width="38" height="23" rx="4" fill="url(#lbTp)" stroke="#55677a"/>
    <rect x="10" y="17" width="28" height="13" rx="2" fill="#fdfdfd" stroke="#8496aa"/>
    <circle cx="17" cy="23.5" r="4" fill="#ffffff" stroke="#66788c"/>
    <circle cx="31" cy="23.5" r="4" fill="#ffffff" stroke="#66788c"/>
    <circle cx="17" cy="23.5" r="1.4" fill="#33465a"/><circle cx="31" cy="23.5" r="1.4" fill="#33465a"/>
    <rect x="21" y="31" width="6" height="3" rx="1" fill="#d9534f"/>
  </svg>`,

  /* ---- 程序窗口（通用 exe） ---- */
  app:`<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="9" width="34" height="30" rx="2" fill="#ece9d8" stroke="#7f8ba0"/>
    <rect x="7" y="9" width="34" height="9" rx="2" fill="url(#xpT)" stroke="#0831d9"/>
    <defs><linearGradient id="xpT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a93ff"/><stop offset="1" stop-color="#0a52c8"/></linearGradient></defs>
    <rect x="11" y="22" width="26" height="13" fill="#ffffff" stroke="#c6c2ae"/>
    <path d="M13 25 H33 M13 28 H30 M13 31 H27" stroke="#c9d3e2" stroke-width="1.3"/>
  </svg>`,

  /* ---- 对话框小图标：信息 ---- */
  info:`<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="13" fill="url(#lbIf)" stroke="#1b5aa0"/>
    <defs><radialGradient id="lbIf" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#8ec8f2"/><stop offset="1" stop-color="#2470b8"/></radialGradient></defs>
    <text x="16" y="23" text-anchor="middle" font-family="Times New Roman,serif" font-weight="bold" font-style="italic" font-size="19" fill="#ffffff">i</text>
  </svg>`,

  /* ---- 对话框小图标：警告 ---- */
  warn:`<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3 L30 28 H2 Z" fill="url(#lbWn)" stroke="#a8791a"/>
    <defs><linearGradient id="lbWn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe28a"/><stop offset="1" stop-color="#f0b429"/></linearGradient></defs>
    <text x="16" y="25" text-anchor="middle" font-family="Tahoma" font-weight="bold" font-size="16" fill="#5a4200">!</text>
  </svg>`,

  /* ---- 对话框小图标：锁 ---- */
  lock:`<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 14 V10 a6 6 0 0 1 12 0 V14" fill="none" stroke="#8a99ab" stroke-width="3"/>
    <rect x="7" y="14" width="18" height="13" rx="2" fill="url(#lbLk)" stroke="#6b7c90"/>
    <defs><linearGradient id="lbLk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd97a"/><stop offset="1" stop-color="#e8b45a"/></linearGradient></defs>
    <circle cx="16" cy="19.5" r="2" fill="#5a4508"/><rect x="15" y="20" width="2" height="4" fill="#5a4508"/>
  </svg>`
};

/* 统一出口：包一层 span 控制尺寸（桌面 38px 由 .ic 类控制） */
function svgIcon(name){
  return '<span class="ico-svg">' + (SVGI[name]||SVGI.txt) + '</span>';
}
window.svgIcon = svgIcon;