<?php
define('ADMIN_PASS', '12345'); // Değiştirin!

session_start();
if (!empty($_POST['pass']) && $_POST['pass'] === ADMIN_PASS) $_SESSION['admin'] = true;
if (empty($_SESSION['admin'])) {
    echo '<form method="post" class="p-8 text-white bg-slate-800 max-w-xs mx-auto mt-20 rounded">
            <h2 class="mb-4 font-bold">Admin Girişi</h2>
            <input name="pass" type="password" placeholder="Şifre" class="w-full p-2 rounded mb-3 text-black">
            <button class="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded">Giriş</button>
          </form>';
    exit;
}

$videos = json_decode(file_get_contents('data.json'), true) ?: [];

if ($_POST['action'] ?? '' === 'add') {
    $ytlink = trim($_POST['ytlink']);
    preg_match('/[?&]v=([a-zA-Z0-9_-]+)/', $ytlink, $m);
    $ytid = $m[1] ?? '';
    if ($ytid) {
        $videos[] = [
            'id'    => uniqid(),
            'ytid'  => $ytid,
            'title' => trim($_POST['title']),
        ];
        file_put_contents('data.json', json_encode($videos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    header('Location: admin.php'); exit;
}
?>
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white">
<div class="max-w-xl mx-auto p-6">
  <h1 class="text-2xl mb-4">Video Ekle</h1>
  <form method="post" class="space-y-4">
      <input type="hidden" name="action" value="add">
      <input name="title"  placeholder="Başlık"  required class="w-full p-2 rounded text-black">
      <input name="ytlink" placeholder="YouTube Linki" required class="w-full p-2 rounded text-black">
      <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Ekle</button>
  </form>

  <h2 class="mt-10 mb-3 font-bold">Kayıtlı Videolar (<?= count($videos) ?>)</h2>
  <ul class="space-y-1">
  <?php foreach ($videos as $v): ?>
      <li class="flex justify-between bg-slate-800 p-2 rounded">
          <span><?= htmlspecialchars($v['title']) ?></span>
          <a class="text-blue-400 underline" href="watch/<?= $v['id'] ?>" target="_blank">İzle</a>
      </li>
  <?php endforeach; ?>
  </ul>
</div>
</body>
</html>