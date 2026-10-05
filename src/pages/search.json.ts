import type { APIRoute } from 'astro';

interface SearchEntry {
  title: string;
  description: string;
  url: string;
  type: string;
  text: string;
}

const TYPE_LABEL: Record<string, string> = {
  blog: '博客',
  knowledge: '知识',
  projects: '项目',
};

function stripFrontmatter(raw: string): { title: string; description: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  let fm = '';
  let body = raw;
  if (match) {
    fm = match[1];
    body = raw.slice(match[0].length);
  }
  const title = fm.match(/^title:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim() || '';
  const description = fm.match(/^description:\s*["']?([^"'\n]*)["']?\s*$/m)?.[1]?.trim() || '';
  return { title, description, body };
}

// 去掉 markdown 语法符号，只留可读文本
function cleanMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/[*_>|#-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const modules = import.meta.glob('../content/**/*.md', {
    query: '?raw',
    import: 'default',
  });

  const entries: SearchEntry[] = [];

  for (const [path, loader] of Object.entries(modules)) {
    const raw = (await loader()) as string;
    const { title, description, body } = stripFrontmatter(raw);
    if (!title) continue;

    // ../content/blog/xxx.md → /blog/xxx
    const [, , type, ...rest] = path.split('/');
    const id = rest.join('/').replace(/\.md$/, '');
    const url = `/${type}/${id}`;

    entries.push({
      title,
      description,
      url,
      type: TYPE_LABEL[type] || type,
      // 截断以控制索引体积
      text: cleanMarkdown(body).slice(0, 3000),
    });
  }

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
