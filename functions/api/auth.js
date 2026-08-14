// 认证 API
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { password } = body;

    console.log('Received password:', password);
    console.log('Expected password:', env.SLIDES_PASSWORD);

    // 验证密码
    if (password === env.SLIDES_PASSWORD) {
      return new Response(JSON.stringify({
        success: true,
        token: env.SLIDES_PASSWORD
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      error: '密码错误',
      received: password ? 'provided' : 'empty',
      expected: env.SLIDES_PASSWORD ? 'set' : 'not set'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '请求处理失败', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
