import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Начална страница',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero секция' },
    { name: 'pillars', title: 'Стълбове (иконки)' },
    { name: 'workshop', title: 'Работилници CTA' },
    { name: 'newsletter', title: 'Бюлетин' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────
    defineField({ name: 'heroImage', title: 'Hero снимка', type: 'image', options: { hotspot: true }, group: 'hero' }),
    defineField({
      name: 'heroOverlayOpacity',
      title: 'Тъмнина на фона (0 = без затъмнение, 70 = тъмен)',
      type: 'number',
      initialValue: 50,
      validation: r => r.min(0).max(100),
      group: 'hero',
    }),
    defineField({
      name: 'heroTextColor',
      title: 'Цвят на текста',
      type: 'string',
      initialValue: 'light',
      options: { list: [{ title: 'Светъл (бял/кремав)', value: 'light' }, { title: 'Тъмен (тъмносин)', value: 'dark' }], layout: 'radio' },
      group: 'hero',
    }),
    defineField({ name: 'heroLabel', title: 'Надпис над заглавието', type: 'string', initialValue: 'Ателие за ръчна изработка · Варна', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Hero заглавие', type: 'string', initialValue: 'Твори. Миксирай. Създай.', validation: r => r.required(), group: 'hero' }),
    defineField({ name: 'heroSubtitle', title: 'Hero подзаглавие', type: 'text', rows: 3, group: 'hero' }),
    defineField({ name: 'heroCta1Label', title: 'Бутон 1 — текст', type: 'string', initialValue: 'Разгледай магазина', group: 'hero' }),
    defineField({ name: 'heroCta1Link', title: 'Бутон 1 — линк', type: 'string', initialValue: '/magazin', group: 'hero' }),
    defineField({ name: 'heroCta2Label', title: 'Бутон 2 — текст', type: 'string', initialValue: 'Запиши се за работилница', group: 'hero' }),
    defineField({ name: 'heroCta2Link', title: 'Бутон 2 — линк', type: 'string', initialValue: '/rabotilnitsi', group: 'hero' }),

    // ── PILLARS ────────────────────────────────────────────────────────
    defineField({ name: 'pillarsTitle', title: 'Заглавие на секцията', type: 'string', initialValue: '', group: 'pillars' }),
    defineField({
      name: 'pillars',
      title: 'Стълбове (3 иконки)',
      type: 'array',
      group: 'pillars',
      of: [{
        type: 'object',
        name: 'pillar',
        title: 'Стълб',
        fields: [
          { name: 'icon', title: 'Икона', type: 'string', options: { list: [{ title: '🌿 Лист', value: 'leaf' }, { title: '✨ Искра', value: 'sparkles' }, { title: '❤️ Сърце', value: 'heart' }] } },
          { name: 'title', title: 'Заглавие', type: 'string' },
          { name: 'desc', title: 'Описание', type: 'text', rows: 3 },
        ],
        preview: { select: { title: 'title' } },
      }],
    }),

    // ── WORKSHOP CTA ───────────────────────────────────────────────────
    defineField({ name: 'workshopCtaImage', title: 'Снимка на секция Работилници', type: 'image', options: { hotspot: true }, group: 'workshop' }),
    defineField({ name: 'workshopCtaOverlay', title: 'Тъмнина на фона (0–100)', type: 'number', initialValue: 70, validation: r => r.min(0).max(100), group: 'workshop' }),
    defineField({ name: 'workshopCtaLabel', title: 'Надпис над заглавието', type: 'string', initialValue: 'Творчески преживявания', group: 'workshop' }),
    defineField({ name: 'workshopCtaTitle', title: 'Заглавие', type: 'string', initialValue: 'Работилници за всеки', group: 'workshop' }),
    defineField({ name: 'workshopCtaText', title: 'Текст', type: 'text', rows: 4, group: 'workshop' }),
    defineField({
      name: 'workshopCtaBullets',
      title: 'Булети (✓ точки)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'workshop',
    }),
    defineField({ name: 'workshopCtaBtnLabel', title: 'Текст на бутона', type: 'string', initialValue: 'Разгледай работилниците', group: 'workshop' }),

    // ── NEWSLETTER ─────────────────────────────────────────────────────
    defineField({ name: 'newsletterTitle', title: 'Заглавие Бюлетин', type: 'string', initialValue: 'Бъди в час с новостите', group: 'newsletter' }),
    defineField({ name: 'newsletterText', title: 'Текст Бюлетин', type: 'text', rows: 2, group: 'newsletter' }),

    // ── SEO ────────────────────────────────────────────────────────────
    defineField({ name: 'seoTitle', title: 'SEO заглавие', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', title: 'SEO описание', type: 'text', rows: 2, group: 'seo' }),
  ],
})
