import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'legalPage',
  title: 'Правни страници',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Страница',
      type: 'string',
      options: {
        list: [
          { title: 'Политика за поверителност', value: 'politika-za-poveritelnost' },
          { title: 'Общи условия', value: 'obshti-uslovia' },
          { title: 'Право на отказ и връщане', value: 'pravo-na-otkaz' },
        ],
        layout: 'radio',
      },
      validation: r => r.required(),
    }),
    defineField({ name: 'title', title: 'Заглавие', type: 'string', validation: r => r.required() }),
    defineField({ name: 'subtitle', title: 'Надпис над заглавието', type: 'string', initialValue: 'Правна информация' }),
    defineField({
      name: 'body',
      title: 'Съдържание',
      type: 'array',
      of: [{
        type: 'block',
        styles: [
          { title: 'Нормален', value: 'normal' },
          { title: 'Заглавие H2', value: 'h2' },
          { title: 'Заглавие H3', value: 'h3' },
        ],
        lists: [
          { title: 'Булети', value: 'bullet' },
          { title: 'Номерирани', value: 'number' },
        ],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
        },
      }],
      validation: r => r.required(),
    }),
    defineField({ name: 'lastUpdated', title: 'Последна актуализация', type: 'string', initialValue: 'Декември 2024' }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug' },
    prepare({ title, slug }) {
      return { title: title || slug }
    },
  },
})
