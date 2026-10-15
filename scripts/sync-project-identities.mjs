import { readFile, writeFile } from 'node:fs/promises';

const identities = JSON.parse(await readFile(new URL('../vendor/portfolio-data/data/projects.json', import.meta.url)));

for (const file of ['README.md', 'README.zh-CN.md']) {
  let content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  const language = file === 'README.md' ? 2 : 1;

  for (const [id, [emoji, zhCN, en]] of Object.entries(identities.projects)) {
    const title = language === 2 ? en : zhCN;
    const markedRow = new RegExp(`^- <!-- portfolio:${id} --> .*? \\*\\*\\[[^\\]]+\\]`, 'gm');
    content = content.replace(markedRow, () => `- <!-- portfolio:${id} --> ${emoji} **[${title}]`);
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(new RegExp(`^- .{1,4} \\*\\*\\[${escaped}\\]`, 'gm'), `- ${emoji} **[${title}]`);
  }

  await writeFile(new URL(`../${file}`, import.meta.url), content);
}
