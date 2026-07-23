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
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
