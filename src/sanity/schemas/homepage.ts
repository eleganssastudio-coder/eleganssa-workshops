import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Начална страница',
  type: 'document',
  fields: [
    defineField({ name: 'heroTitle', title: 'Hero заглавие', type: 'string', initialValue: 'Твори. Миксирай. Създай.' }),
    defineField({ name: 'heroSubtitle', title: 'Hero подзаглавие', type: 'text', rows: 3 }),
    defineField({ name: 'heroImage', title: 'Hero снимка', type: 'image', options: { hotspot: true } }),
  ],
})
