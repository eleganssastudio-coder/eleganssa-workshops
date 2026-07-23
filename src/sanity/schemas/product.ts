import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Продукт',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Наименование', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'description', title: 'Описание', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'shortDescription', title: 'Кратко описание', type: 'text', rows: 3 }),
    defineField({ name: 'price', title: 'Цена (лв)', type: 'number', validation: r => r.required().positive() }),
    defineField({ name: 'comparePrice', title: 'Стара цена (лв)', type: 'number' }),
    defineField({ name: 'images', title: 'Снимки', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], validation: r => r.required().min(1) }),
    defineField({ name: 'category', title: 'Категория', type: 'reference', to: [{ type: 'category' }], validation: r => r.required() }),
    defineField({ name: 'ingredients', title: 'Съставки / Материали', type: 'text', rows: 4 }),
    defineField({
      name: 'variants',
      title: 'Варианти (аромат, размер, цвят)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'type', title: 'Тип', type: 'string', options: { list: ['Аромат', 'Размер', 'Цвят'] } },
          { name: 'options', title: 'Опции (разделени със запетая)', type: 'string' },
        ],
      }],
    }),
    defineField({ name: 'inStock', title: 'Наличен', type: 'boolean', initialValue: true }),
    defineField({ name: 'featured', title: 'Препоръчан', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Наредба', type: 'number' }),
  ],
  orderings: [
    { title: 'Наредба', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Цена ↑', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
    { title: 'Цена ↓', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', media: 'images.0', price: 'price' },
    prepare({ title, media, price }) {
      return { title, media, subtitle: `${price} лв` }
    },
  },
})
