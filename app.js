const data = window.MOCHI_COMMANDS || {},
      list = document.getElementById('commandList'),
      search = document.getElementById('searchInput'),
      menuBtn = document.getElementById('menuBtn'),
      navLinks = document.getElementById('navLinks'),
      cmdCount = document.getElementById('cmdCount');

// Đếm tổng số lượng lệnh cực nhanh
cmdCount.textContent = Object.values(data).reduce((n, a) => n + a.length, 0);

// Hàm render danh sách lệnh mượt mà không đơ
function render(q = '') {
    list.innerHTML = '';
    q = q.trim().toLowerCase();
    
    Object.entries(data).forEach(([cat, items]) => {
        const f = items.filter(x => x.toLowerCase().includes(q) || cat.toLowerCase().includes(q));
        if (!f.length) return;
        
        const w = document.createElement('article');
        w.className = 'command-group glass reveal visible';
        
        const h = document.createElement('button');
        h.className = 'command-head';
        h.innerHTML = `<div><strong>${cat}</strong><br><span>${f.length} lệnh</span></div><b>⌃</b>`;
        
        const b = document.createElement('div');
        b.className = 'command-body' + (q ? ' open' : '');
        
        const inn = document.createElement('div');
        inn.className = 'command-items';
        
        f.forEach(x => {
            const e = document.createElement('div');
            e.className = 'command-item';
            e.textContent = x;
            inn.appendChild(e);
        });
        
        b.appendChild(inn);
        
        // Sự kiện click đóng mở mượt mà kết hợp xoay icon
        h.onclick = () => {
            const isOpen = b.classList.toggle('open');
            w.classList.toggle('active-group', isOpen);
        };
        
        w.append(h, b);
        list.appendChild(w);
    });
}

render();
search.oninput = e => render(e.target.value);

// Menu Reponsive trên Mobile
menuBtn.onclick = () => navLinks.classList.toggle('open');
navLinks.querySelectorAll('a').forEach(a => a.onclick = () => navLinks.classList.remove('open'));

// Hiệu ứng cuộn Reveal mượt mà bằng API IntersectionObserver phần cứng
const ob = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
        e.target.classList.add('visible');
    }
}), { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(e => ob.observe(e));

// 🔥 TÍNH NĂNG CHỮ CHẠY TỰ ĐỘNG (TYPING EFFECT)
const typingText = document.getElementById('typing-text');
const words = ["dễ thương 🌸", "mượt mà ✨", "miễn phí 💎", "đa năng ⚡"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Dừng lại ở từ đầy đủ 2 giây
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400; // Thời gian nghỉ trước khi gõ từ mới
    }

    setTimeout(typeEffect, typeSpeed);
}
document.addEventListener("DOMContentLoaded", () => setTimeout(typeEffect, 1000));

// 🔥 TÍNH NĂNG MẮT DI CHUYỂN THEO CHUỘT (Card Spotlight Effect)
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

// 🔥 ĐIỀU KHIỂN NHẠC NỀN TỰ ĐỘNG THÔNG MINH
const bgMusic = document.getElementById('bgMusic');
const musicPlayer = document.getElementById('musicPlayer');
const musicToggle = document.getElementById('musicToggle');
let hasInteracted = false;

// Hàm kích hoạt nhạc mượt mà
function startPlay() {
    bgMusic.play().then(() => {
        musicPlayer.classList.add('playing');
        musicToggle.textContent = '🔊';
    }).catch(err => {
        console.log("Trình duyệt đang chặn autoplay. Chờ click để phát...");
    });
}

// 1. Tự động phát khi người dùng có hành động click đầu tiên trên website
document.addEventListener('click', () => {
    if (!hasInteracted) {
        startPlay();
        hasInteracted = true;
    }
}, { once: false }); // Để cho phép kích hoạt nếu trước đó bị chặn

// 2. Click nút điều khiển để bật/tắt thủ công
musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Tránh kích hoạt sự kiện click của document
    hasInteracted = true; // Xác nhận đã tương tác
    if (bgMusic.paused) {
        bgMusic.play();
        musicPlayer.classList.add('playing');
        musicToggle.textContent = '🔊';
    } else {
        bgMusic.pause();
        musicPlayer.classList.remove('playing');
        musicToggle.textContent = '🔇';
    }
});
