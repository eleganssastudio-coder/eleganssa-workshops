import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'eleganssa-studio',
  title: 'Eleganssa Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Съдържание')
          .items([
            S.listItem().title('Продукти').schemaType('product').child(S.documentTypeList('product')),
            S.listItem().title('Работилници').schemaType('workshop').child(S.documentTypeList('workshop')),
            S.listItem().title('Отзиви').schemaType('review').child(S.documentTypeList('review')),
            S.listItem().title('Категории').schemaType('category').child(S.documentTypeList('category')),
            S.listItem().title('Начална страница').schemaType('homepage').child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem().title('За нас').schemaType('about').child(S.document().schemaType('about').documentId('about')),
            S.listItem().title('Страница Работилници').schemaType('workshopsPage').child(S.document().schemaType('workshopsPage').documentId('workshopsPage')),
            S.listItem().title('Ваучери').schemaType('voucher').child(S.documentTypeList('voucher')),
            S.listItem().title('Правни страници').schemaType('legalPage').child(S.documentTypeList('legalPage')),
            S.listItem().title('Страница Контакти').schemaType('contactsPage').child(S.document().schemaType('contactsPage').documentId('contactsPage')),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
