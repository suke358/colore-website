// 名刺の QR の転送（2026/10/16 作成。本公開＝10/20 に main に出したときに初めて効く）
//
// やること：仮の住所 https://colore-website.liftoff-358.workers.dev/〇〇 で来た人だけを
//           本当の住所 https://colore-yomogi.com/〇〇 へ 301（ずっと引っ越しました）で送る。
// それ以外（colore-yomogi.com・確認用の preview-〇〇.workers.dev・ローカル）は、何もせずサイトのファイルをそのまま返す。
// ホスト名が「ぴったり同じ」ときだけ転送するので、colore-yomogi.com で転送が回り続ける（ループ）ことはない。
//
// しくみ：wrangler.jsonc の "main" がこのファイル。"run_worker_first": true で、どのページも先にこのコードを通ってから
//         ファイル（index.html・images など）が返る。ファイルを返すのは env.ASSETS.fetch(request)。
// 注意：確認用の preview ブランチでは、ホスト名が preview-colore-website.… なので転送しない（= 今日は何も起きない）。
//       main に出すと、ホスト名が colore-website.… になるので、その瞬間から転送が効く。

var OLD_HOST = 'colore-website.liftoff-358.workers.dev';
var NEW_ORIGIN = 'https://colore-yomogi.com';

export default {
  fetch: function (request, env) {
    var url = new URL(request.url);
    if (url.hostname === OLD_HOST) {
      // 道（/〇〇）と ?の後ろ（?v=12 など）はそのまま引きつぐ
      return Response.redirect(NEW_ORIGIN + url.pathname + url.search, 301);
    }
    return env.ASSETS.fetch(request);
  }
};
