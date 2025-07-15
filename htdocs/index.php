<?php
$videos = json_decode(file_get_contents('data.json'), true) ?: [];
?>
<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>PenguX Porn</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white">
<header class="p-6 bg-black/30">
  <h1 class="text-2xl font-bold">PenguX Porn</h1>
</header>

<main class="p-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
<?php foreach (array_reverse($videos) as $vid): ?>
  <a href="watch/<?= $vid['id'] ?>" class="block rounded overflow-hidden bg-slate-800 hover:bg-slate-700">
      <img src="https://img.youtube.com/vi/<?= $vid['ytid'] ?>/mqdefault.jpg" alt="">
      <div class="p-3 font-semibold truncate"><?= htmlspecialchars($vid['title']) ?></div>
  </a>
<?php endforeach; ?>
</main>
</body>
</html>