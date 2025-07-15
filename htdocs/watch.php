<?php
$id = $_GET['id'] ?? '';
$videos = json_decode(file_get_contents('data.json'), true) ?: [];
$video  = null;
foreach ($videos as $v) if ($v['id'] === $id) { $video = $v; break; }
if (!$video) { http_response_code(404); echo "Video bulunamadı"; exit; }
?>
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title><?= htmlspecialchars($video['title']) ?></title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white">
<header class="p-4 bg-black/30">
  <a href="/" class="text-xl font-bold">← Geri</a>
</header>

<div class="max-w-4xl mx-auto p-4">
  <h2 class="text-2xl mb-4"><?= htmlspecialchars($video['title']) ?></h2>
  <div class="aspect-video">
      <iframe class="w-full h-full rounded"
              src="https://www.youtube.com/embed/<?= $video['ytid'] ?>"
              frameborder="0"
              allowfullscreen></iframe>
  </div>
</div>
</body>
</html>