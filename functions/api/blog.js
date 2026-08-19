// 博客 API - 通过 GitHub API 提交文章
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
    const { title, description, category, tags, content } = body;

    if (!title || !content) {
      return new Response(JSON.stringify({ error: '标题和内容不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 生成文件名（使用日期+标题拼音或随机ID）
    const date = new Date().toISOString().split('T')[0];
    const slug = title
      .toLowerCase()
      .replace(/[^\w一-龥]+/g, '-')
      .replace(/^-|-$/g, '');
    const fileName = `${date}-${slug}.md`;

    // 构建 Markdown 内容
    const frontmatter = `---
title: "${title}"
description: "${description || ''}"
date: ${date}
tags: [${tags.map(t => `"${t}"`).join(', ')}]
category: "${category}"
---

${content}`;

    // GitHub API 提交文件
    const githubToken = env.GITHUB_TOKEN;
    const repo = env.GITHUB_REPO || 'hideonlycoris/houyulong-website';
    const filePath = `src/content/blog/${fileName}`;

    const githubResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `新增博客: ${title}`,
          content: btoa(unescape(encodeURIComponent(frontmatter))),
          branch: 'master',
        }),
      }
    );

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
        error: 'GitHub 提交失败',
        detail: githubData.message,
      }), {
        status: githubResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: '请求处理失败',
      detail: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
