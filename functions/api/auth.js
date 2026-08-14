// 认证 API
export async function onRequestPost(context) {
  const { request, env } = context;
  const { password } = await request.json();

  // 验证密码
  if (password === env.SLIDES_PASSWORD) {
    return new Response(JSON.stringify({
      success: true,
      token: env.SLIDES_PASSWORD
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: '密码错误' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
