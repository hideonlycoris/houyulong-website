// 知识库 API - 通过 GitHub API 提交文章

// Unicode 字符串转 Base64
function encodeToBase64(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  let binary = '';
  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export async function onRequestPost(context) {
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

  // 检查 GitHub Token
  if (!env.GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: '未配置 GITHUB_TOKEN' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { title, description, category, order, content } = body;

    if (!title || !content) {
      return new Response(JSON.stringify({ error: '标题和内容不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 生成文件名
    const slug = title
      .toLowerCase()
      .replace(/[^\w一-龥]+/g, '-')
      .replace(/^-|-$/g, '');
    const fileName = `${slug}.md`;

    // 构建 Markdown 内容
    const frontmatter = `---
title: "${title}"
description: "${description || ''}"
category: "${category || '供应链'}"
order: ${order || 1}
---

${content}`;

    // GitHub API 提交文件
    const githubToken = env.GITHUB_TOKEN;
    const repo = env.GITHUB_REPO || 'hideonlycoris/houyulong-website';
    const filePath = `src/content/knowledge/${fileName}`;
    const encodedContent = encodeToBase64(frontmatter);
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    const githubResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Knowledge-Editor',
      },
      body: JSON.stringify({
        message: `新增知识库: ${title}`,
        content: encodedContent,
        branch: 'master',
      }),
    });

    const githubData = await githubResponse.json();

    if (githubResponse.ok) {
      return new Response(JSON.stringify({
        success: true,
        fileName,
        githubUrl: githubData.content?.html_url,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({
        error: 'GitHub API 错误',
        detail: githubData.message,
        status: githubResponse.status,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: '服务器错误',
      detail: error.message || String(error),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
