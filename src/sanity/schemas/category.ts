import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Категория',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Наименование', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'description', title: 'Описание', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Снимка', type: 'image', options: { hotspot: true } }),
  ],
})
