const todoList = document.getElementById('todo-list');
const filterInput = document.getElementById('filter-input');
const notificationBtn = document.getElementById('notification-btn');
const installBtn = document.getElementById('install-btn');
const installGuide = document.getElementById('install-guide');
const loadingScreen = document.getElementById('loading-screen');
const mainContainer = document.getElementById('main-container');

// JSON verisi (tamamını buraya ekleyin veya harici bir dosyadan çekin)
const plan = {
  "plan": [
    {
      "day": 1,
      "title": "Python Temelleri 1",
      "tasks": [
        "Replit hesabı oluştur",
        "Python'da değişkenler, veri türleri (int, str, float, bool) öğren",
        "Toplama, çarpma, bölme yapan basit bir hesap makinesi yaz"
      ]
    },
    // ... diğer günler (tam JSON verisini buraya ekleyin)
  ]
};

// Başlangıç tarihi: 12 Mayıs 2025
const startDate = new Date('2025-05-12');

// LocalStorage'dan tamamlanmış görevleri yükle
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {};

// PWA yükleme eventi
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installGuide.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installGuide.style.display = 'none';
    }
    deferredPrompt = null;
  }
});

// Uygulama zaten yüklüyse rehberi gizle
window.addEventListener('appinstalled', () => {
  installGuide.style.display = 'none';
});

// Tarih formatlama fonksiyonu
function formatDate(date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('tr-TR', options);
}

// Görevleri ekrana yazdırma
function renderTasks(filter = '') {
  todoList.innerHTML = '';
  plan.plan.forEach(day => {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + (day.day - 1));

    const dayTitleText = `Gün ${day.day} (${formatDate(dayDate)}): ${day.title}`;
    if (filter && !dayTitleText.toLowerCase().includes(filter.toLowerCase())) {
      return;
    }

    const dayCard = document.createElement('div');
    dayCard.classList.add('day-card');

    const dayTitle = document.createElement('h2');
    dayTitle.textContent = dayTitleText;
    dayCard.appendChild(dayTitle);

    const taskList = document.createElement('ul');
    day.tasks.forEach((task, index) => {
      const taskId = `day${day.day}-task${index}`;
      const taskItem = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = taskId;
      checkbox.checked = !!completedTasks[taskId];
      if (checkbox.checked) {
        taskItem.classList.add('completed');
      }

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          completedTasks[taskId] = true;
          taskItem.classList.add('completed');
        } else {
          delete completedTasks[taskId];
          taskItem.classList.remove('completed');
        }
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
      });

      const label = document.createElement('label');
      label.htmlFor = taskId;
      label.textContent = task;

      taskItem.appendChild(checkbox);
      taskItem.appendChild(label);
      taskList.appendChild(taskItem);
    });
    dayCard.appendChild(taskList);

    todoList.appendChild(dayCard);
  });
}

// Filtreleme
filterInput.addEventListener('input', () => {
  renderTasks(filterInput.value);
});

// Bildirim izni isteme
notificationBtn.addEventListener('click', () => {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      notificationBtn.textContent = 'Bildirimler Açık';
      notificationBtn.disabled = true;
    }
  });
});

// Günlük 17:30 bildirimi
function scheduleDailyNotification() {
  setInterval(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Saat 17:30 kontrolü
    if (currentHour === 17 && currentMinute === 30) {
      const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const currentDay = plan.plan.find(day => day.day === daysSinceStart);

      if (currentDay && Notification.permission === 'granted') {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + (currentDay.day - 1));
        const notificationBody = `Bugün (${formatDate(dayDate)}): ${currentDay.title}\nGörevler:\n${currentDay.tasks.join('\n')}`;
        new Notification('Günlük Görev Hatırlatıcı', {
          body: notificationBody,
          icon: '/assets/icon.png'
        });
      }
    }
  }, 60000); // Her dakika kontrol et
}

// Bildirim zamanlayıcısını başlat
scheduleDailyNotification();

// Yükleme ekranını kaldır ve ana içeriği göster
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    mainContainer.style.display = 'block';
  }, 1000); // 1 saniye yükleme ekranı
});

// İlk yüklemede görevleri render et
renderTasks();

// Service Worker kaydı
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}
