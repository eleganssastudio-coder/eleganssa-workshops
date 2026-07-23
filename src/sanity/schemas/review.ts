import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Отзив',
  type: 'document',
  fields: [
    defineField({ name: 'author', title: 'Автор', type: 'string', validation: r => r.required() }),
    defineField({ name: 'rating', title: 'Оценка', type: 'number', options: { list: [1, 2, 3, 4, 5] }, validation: r => r.required() }),
    defineField({ name: 'title', title: 'Заглавие', type: 'string' }),
    defineField({ name: 'body', title: 'Текст', type: 'text', rows: 4, validation: r => r.required() }),
    defineField({ name: 'date', title: 'Дата', type: 'string' }),
    defineField({ name: 'featured', title: 'Показвай на начало', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'body', rating: 'rating' },
    prepare({ title, subtitle, rating }) {
      return { title: `${'⭐'.repeat(rating)} ${title}`, subtitle }
    },
  },
})
