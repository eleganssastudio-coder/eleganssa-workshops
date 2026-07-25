import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'workshopsPage',
  title: 'Страница Работилници',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero секция' },
    { name: 'benefits', title: 'Предимства (тъмна лента)' },
    { name: 'private', title: 'Частни работилници' },
  ],
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────
    defineField({ name: 'heroLabel', title: 'Надпис над заглавието', type: 'string', initialValue: 'Творчески преживявания', group: 'hero' }),
    defineField({ name: 'heroTitle', title: 'Заглавие', type: 'string', initialValue: 'Работилници', group: 'hero' }),
    defineField({ name: 'heroText', title: 'Текст', type: 'text', rows: 3, group: 'hero' }),

    // ── BENEFITS ────────────────────────────────────────────────────────
    defineField({
      name: 'benefits',
      title: 'Предимства',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'benefits',
      description: 'Показват се в тъмната лента под hero-а',
    }),

    // ── PRIVATE WORKSHOPS ───────────────────────────────────────────────
    defineField({ name: 'privateLabel', title: 'Надпис над заглавието', type: 'string', initialValue: 'За вашата група', group: 'private' }),
    defineField({ name: 'privateTitle', title: 'Заглавие', type: 'string', initialValue: 'Частни и корпоративни работилници', group: 'private' }),
    defineField({ name: 'privateText', title: 'Текст', type: 'text', rows: 4, group: 'private' }),
    defineField({
      name: 'privateBullets',
      title: 'Булети',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'private',
    }),
    defineField({ name: 'privateImage', title: 'Снимка', type: 'image', options: { hotspot: true }, group: 'private' }),
    defineField({ name: 'privateBtnLabel', title: 'Текст на бутона', type: 'string', initialValue: 'Свържи се с нас', group: 'private' }),
    defineField({ name: 'privateBtnEmail', title: 'Имейл на бутона', type: 'string', initialValue: 'eleganssastudio@gmail.com', group: 'private' }),
  ],
  preview: {
    prepare() {
      return { title: 'Страница Работилници' }
    },
  },
})
