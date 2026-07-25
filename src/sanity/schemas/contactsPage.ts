import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactsPage',
  title: 'Страница Контакти',
  type: 'document',
  fields: [
    defineField({ name: 'address', title: 'Адрес (ред 1)', type: 'string', initialValue: 'Варна, ул. Бреза 2' }),
    defineField({ name: 'addressLine2', title: 'Адрес (ред 2)', type: 'string', initialValue: 'България' }),
    defineField({ name: 'email', title: 'Имейл', type: 'string', initialValue: 'eleganssastudio@gmail.com' }),
    defineField({ name: 'instagramHandle', title: 'Instagram потребителско ime (без @)', type: 'string', initialValue: 'eleganssastudio' }),
    defineField({ name: 'instagramUrl', title: 'Instagram линк', type: 'url', initialValue: 'https://www.instagram.com/eleganssastudio/' }),
    defineField({ name: 'phone', title: 'Телефон (по избор)', type: 'string' }),
    defineField({
      name: 'workingHours',
      title: 'Работно време',
      type: 'array',
      of: [{ type: 'string' }],
      initialValue: ['Вторник - Събота: 10:00 - 18:00', 'Неделя: 10:00 - 14:00', 'Понеделник: Затворено'],
      description: 'Всеки ред е отделен ред работно време',
    }),
    defineField({ name: 'privateTitle', title: 'Заглавие на блока за частни поръчки', type: 'string', initialValue: 'Корпоративни и частни поръчки' }),
    defineField({ name: 'privateText', title: 'Текст за частни поръчки', type: 'text', rows: 3, initialValue: 'Организираме частни работилници за рождени дни, моминско парти, корпоративен тийм билдинг и специални поводи. Свържете се с нас за персонализирана оферта.' }),
  ],
  preview: {
    prepare() {
      return { title: 'Страница Контакти' }
    },
  },
})
