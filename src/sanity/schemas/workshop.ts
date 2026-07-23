import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'workshop',
  title: 'Работилница',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Заглавие', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'shortDescription', title: 'Кратко описание', type: 'text', rows: 3 }),
    defineField({ name: 'description', title: 'Пълно описание', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', title: 'Снимка', type: 'image', options: { hotspot: true }, validation: r => r.required() }),
    defineField({ name: 'price', title: 'Цена (€)', type: 'number', validation: r => r.required().positive() }),
    defineField({ name: 'duration', title: 'Продължителност', type: 'string' }),
    defineField({ name: 'maxSpots', title: 'Макс. участника', type: 'number', initialValue: 8 }),
    defineField({ name: 'includes', title: 'Включва', type: 'array', of: [{ type: 'string' }], description: 'Какво включва цената' }),
    defineField({ name: 'steps', title: 'Стъпки на работилницата', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'sessions',
      title: 'Дати и часове',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'date', title: 'Дата', type: 'date' },
          { name: 'startTime', title: 'Начален час', type: 'string' },
          { name: 'endTime', title: 'Краен час', type: 'string' },
          { name: 'spotsLeft', title: 'Свободни места', type: 'number' },
        ],
        preview: {
          select: { date: 'date', startTime: 'startTime', spotsLeft: 'spotsLeft' },
          prepare({ date, startTime, spotsLeft }: { date?: string; startTime?: string; spotsLeft?: number }) {
            return { title: `${date} от ${startTime}`, subtitle: `${spotsLeft} места` }
          },
        },
      }],
    }),
    defineField({ name: 'active', title: 'Активна', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', media: 'image', price: 'price' },
    prepare({ title, media, price }) {
      return { title, media, subtitle: `${price}€` }
    },
  },
})
