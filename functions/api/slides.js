// 幻灯片 CRUD API
export async function onRequest(context) {
  const { request, env } = context;

  // 验证认证
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token || token !== env.SLIDES_PASSWORD) {
    return new Response(JSON.stringify({ error: '未授权' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 处理不同请求方法
  switch (request.method) {
    case 'GET':
      return handleGet(env);
    case 'POST':
      return handlePost(request, env);
    case 'DELETE':
      return handleDelete(request, env);
    default:
      return new Response(JSON.stringify({ error: '方法不允许' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
  }
}

// 获取所有幻灯片
async function handleGet(env) {
  const data = await env.SLIDES_KV?.get('slides', { type: 'json' }) || [];
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// 创建幻灯片
async function handlePost(request, env) {
  const body = await request.json();

  const slide = {
    id: Date.now().toString(),
    title: body.title,
    fileName: body.fileName,
    date: new Date().toLocaleDateString('zh-CN'),
    slides: body.slides,
    createdAt: new Date().toISOString(),
  };

  // 保存到 KV
  const data = await env.SLIDES_KV?.get('slides', { type: 'json' }) || [];
  data.unshift(slide);
  await env.SLIDES_KV?.put('slides', JSON.stringify(data));

  return new Response(JSON.stringify({ success: true, id: slide.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// 删除幻灯片
async function handleDelete(request, env) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: '缺少 ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await env.SLIDES_KV?.get('slides', { type: 'json' }) || [];
  const newData = data.filter(s => s.id !== id);
  await env.SLIDES_KV?.put('slides', JSON.stringify(newData));

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
