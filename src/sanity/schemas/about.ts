import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'about',
  title: 'За нас',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero секция' },
    { name: 'story', title: 'Нашата история' },
    { name: 'values', title: 'Ценности' },
    { name: 'instagram', title: 'Instagram' },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────
    defineField({ name: 'heroImage', title: 'Hero снимка', type: 'image', options: { hotspot: true }, group: 'hero' }),
    defineField({ name: 'heroOverlayOpacity', title: 'Тъмнина на фона (0–100)', type: 'number', initialValue: 60, validation: r => r.min(0).max(100), group: 'hero' }),
    defineField({ name: 'heroLabel', title: 'Надпис (малък текст)', type: 'string', initialValue: 'Нашата история', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Заглавие', type: 'string', initialValue: 'За нас', group: 'hero' }),
    defineField({ name: 'heroSubtitle', title: 'Подзаглавие/цитат', type: 'string', initialValue: '"Твори. Миксирай. Създай."', group: 'hero' }),

    // ── STORY ─────────────────────────────────────────────────────────
    defineField({ name: 'storyLabel', title: 'Малък надпис', type: 'string', initialValue: 'Нашата история', group: 'story' }),
    defineField({ name: 'storyTitle', title: 'Заглавие на историята', type: 'string', initialValue: 'Родено от страст към ръчната изработка', group: 'story' }),
    defineField({
      name: 'storyBody',
      title: 'Текст (може да се разделя на абзаци)',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'story',
    }),
    defineField({
      name: 'mainImage',
      title: 'Главна снимка (дясна, голяма)',
      type: 'image',
      options: { hotspot: true },
      group: 'story',
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Втора снимка (малка, долу-ляво)',
      type: 'image',
      options: { hotspot: true },
      group: 'story',
    }),

    // ── VALUES ─────────────────────────────────────────────────────────
    defineField({ name: 'valuesLabel', title: 'Малък надпис над ценностите', type: 'string', initialValue: 'Нашите ценности', group: 'values' }),
    defineField({ name: 'valuesTitle', title: 'Заглавие', type: 'string', initialValue: 'Защо избираме натуралното', group: 'values' }),
    defineField({
      name: 'values',
      title: 'Ценности (3 блока)',
      type: 'array',
      group: 'values',
      of: [{
        type: 'object',
        name: 'value',
        title: 'Ценност',
        fields: [
          { name: 'icon', title: 'Икона', type: 'string', options: { list: [{ title: '🌿 Лист', value: 'leaf' }, { title: '❤️ Сърце', value: 'heart' }, { title: '✨ Искра', value: 'sparkles' }] } },
          { name: 'title', title: 'Заглавие', type: 'string' },
          { name: 'desc', title: 'Описание', type: 'text', rows: 3 },
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── INSTAGRAM ─────────────────────────────────────────────────────
    defineField({ name: 'instagramTitle', title: 'Заглавие Instagram секция', type: 'string', initialValue: 'Следете ни в Instagram', group: 'instagram' }),
    defineField({ name: 'instagramText', title: 'Текст', type: 'text', rows: 2, group: 'instagram' }),
    defineField({ name: 'instagramHandle', title: 'Instagram потребителско име (напр. @eleganssastudio)', type: 'string', initialValue: '@eleganssastudio', group: 'instagram' }),
    defineField({ name: 'instagramUrl', title: 'Instagram линк', type: 'url', initialValue: 'https://www.instagram.com/eleganssastudio/', group: 'instagram' }),
  ],
})
