import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const to = req.nextUrl.searchParams.get("to") ?? "/";
  // to 파라미터가 외부 URL이면 차단
  const target = to.startsWith("/") ? `https://fishare.vercel.app${to}` : "https://fishare.vercel.app";

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fishare 열기</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, sans-serif; background: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { background: white; border-radius: 20px; padding: 32px 24px; max-width: 360px; width: 100%; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .logo { font-size: 32px; margin-bottom: 12px; }
    h1 { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
    p { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: block; background: #0284c7; color: white; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 600; text-decoration: none; margin-bottom: 12px; }
    .hint { font-size: 12px; color: #94a3b8; }
    .steps { text-align: left; background: #f1f5f9; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .steps li { font-size: 13px; color: #475569; margin-left: 16px; margin-bottom: 4px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🎣</div>
    <h1>외부 브라우저에서 열기</h1>
    <p>카카오톡 내부 브라우저에서는 일부 기능이 제한될 수 있어요.</p>

    <div class="steps" id="ios-steps" style="display:none">
      <strong style="font-size:13px;color:#334155;display:block;margin-bottom:8px">📱 Safari에서 여는 방법</strong>
      <ol>
        <li>우측 하단 <strong>···</strong> 버튼 탭</li>
        <li><strong>기본 브라우저로 열기</strong> 선택</li>
      </ol>
    </div>

    <a class="btn" href="${target}" id="open-btn">Fishare 바로 열기</a>
    <p class="hint" id="hint-text"></p>
  </div>

  <script>
    const ua = navigator.userAgent || '';
    const isKakao = /KAKAOTALK/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const target = ${JSON.stringify(target)};

    if (isAndroid && isKakao) {
      // Android: intent URL로 크롬 강제 오픈
      const intentUrl = 'intent://' + target.replace(/^https?:\\/\\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';
      document.getElementById('open-btn').href = intentUrl;
      document.getElementById('hint-text').textContent = '버튼을 누르면 Chrome에서 열립니다';
      // 자동 리다이렉트 시도
      setTimeout(() => { location.href = intentUrl; }, 300);
    } else if (isIOS && isKakao) {
      document.getElementById('ios-steps').style.display = 'block';
      document.getElementById('hint-text').textContent = '또는 위 안내를 따라 Safari에서 여세요';
    } else {
      // 일반 브라우저면 바로 이동
      location.replace(target);
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
