import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Categories
  const candlesCat = await prisma.category.upsert({
    where: { slug: 'soevi-sveshti' },
    update: {},
    create: {
      name: 'Соеви свещи',
      slug: 'soevi-sveshti',
      description: 'Ръчно изработени соеви свещи с натурални аромати',
      image: 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
    },
  })

  const jesmoniteCat = await prisma.category.upsert({
    where: { slug: 'jesmonite-izdeliya' },
    update: {},
    create: {
      name: 'Jesmonite изделия',
      slug: 'jesmonite-izdeliya',
      description: 'Уникални декоративни изделия от Jesmonite',
      image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
    },
  })

  const giftsCat = await prisma.category.upsert({
    where: { slug: 'komplekti' },
    update: {},
    create: {
      name: 'Комплекти',
      slug: 'komplekti',
      description: 'Подаръчни комплекти за всеки повод',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
    },
  })

  // Products
  const products = [
    {
      name: 'Соева свещ "Лавандула и ванилия"',
      slug: 'soeva-sveshta-lavandula-vaniliya',
      description: 'Ръчно изработена соева свещ с естествен аромат на лавандула и топла ванилия. Изработена от 100% натурален соев восък, без парафин. Времето на горене е приблизително 40 часа. Идеална за релакс и медитация.',
      price: 28,
      comparePrice: 35,
      images: [
        'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
        'https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800',
      ],
      ingredients: '100% соев восък, парфюмно масло от лавандула и ванилия, памучен фитил',
      inStock: true,
      featured: true,
      categoryId: candlesCat.id,
    },
    {
      name: 'Соева свещ "Морски бриз"',
      slug: 'soeva-sveshta-morski-briz',
      description: 'Освежаваща соева свещ с морски аромат, идеална за летни вечери. Изработена от натурален соев восък с добавка на ракита и морска сол за декорация. Времето на горене е 35 часа.',
      price: 25,
      comparePrice: null,
      images: [
        'https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
      ],
      ingredients: '100% соев восък, парфюмно масло с морски аромат, памучен фитил, декоративна морска сол',
      inStock: true,
      featured: true,
      categoryId: candlesCat.id,
    },
    {
      name: 'Соева свещ "Санdalwood & Роза"',
      slug: 'soeva-sveshta-sandalwood-roza',
      description: 'Луксозна соева свещ с аромат на сандалово дърво и рози. Елегантна комбинация от топли и цветни нотки за уютна атмосфера. Времето на горене е 45 часа.',
      price: 32,
      comparePrice: 40,
      images: [
        'https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800',
        'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
      ],
      ingredients: '100% соев восък, парфюмно масло от сандалово дърво и роза, памучен фитил, сушени розови листа',
      inStock: true,
      featured: false,
      categoryId: candlesCat.id,
    },
    {
      name: 'Jesmonite купа "Мрамор"',
      slug: 'jesmonite-kupa-mramor',
      description: 'Декоративна купа от Jesmonite с мраморен ефект. Всяко изделие е уникално и се различава по шарката. Подходяща за бижута, ключове или като декорация. Размери: 15 x 15 cm.',
      price: 45,
      comparePrice: null,
      images: [
        'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      ],
      ingredients: 'Jesmonite AC100, пигменти, защитно покритие',
      inStock: true,
      featured: true,
      categoryId: jesmoniteCat.id,
    },
    {
      name: 'Jesmonite поднос "Терацо"',
      slug: 'jesmonite-podnos-teratso',
      description: 'Модерен поднос от Jesmonite с ефект на терацо. Идеален за сервиране или като декоративен елемент. Всеки поднос е уникален. Размери: 25 x 18 cm.',
      price: 65,
      comparePrice: 80,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
      ],
      ingredients: 'Jesmonite AC100, цветни мозаечни фрагменти, лак за финиш',
      inStock: true,
      featured: true,
      categoryId: jesmoniteCat.id,
    },
    {
      name: 'Jesmonite свещник "Минимал"',
      slug: 'jesmonite-sveshnik-minimal',
      description: 'Елегантен свещник от Jesmonite в минималистичен стил. Подходящ за чаени свещи. Наличен в три цвята: бяло, сиво и теракота.',
      price: 35,
      comparePrice: null,
      images: [
        'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800',
        'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
      ],
      ingredients: 'Jesmonite AC100, минерални пигменти',
      inStock: true,
      featured: false,
      categoryId: jesmoniteCat.id,
    },
    {
      name: 'Подаръчен комплект "Уют"',
      slug: 'podarachen-komplekt-uyut',
      description: 'Луксозен подаръчен комплект включващ соева свещ "Лавандула и ванилия", Jesmonite купа "Мрамор" и малка свещ подарък. Опакован в красива кутия с персонализирана картичка.',
      price: 85,
      comparePrice: 108,
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
        'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
      ],
      ingredients: 'Вижте отделните продукти за пълен списък на съставките',
      inStock: true,
      featured: true,
      categoryId: giftsCat.id,
    },
    {
      name: 'Подаръчен комплект "Релакс"',
      slug: 'podarachen-komplekt-relaks',
      description: 'Перфектният подарък за любителите на релакс и самогрижа. Включва 2 соеви свещи по избор, Jesmonite свещник и пакетче с лавандула. Опакован ръчно с естествени материали.',
      price: 75,
      comparePrice: 93,
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
        'https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800',
      ],
      ingredients: 'Вижте отделните продукти за пълен списък на съставките',
      inStock: true,
      featured: false,
      categoryId: giftsCat.id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  // Workshops
  const candleWorkshop = await prisma.workshop.upsert({
    where: { slug: 'rabotilnitsa-soevi-sveshti' },
    update: {},
    create: {
      title: 'Работилница за соеви свещи',
      slug: 'rabotilnitsa-soevi-sveshti',
      description: 'Научете изкуството на правенето на соеви свещи в нашата уютна студио среда. Ще научите всичко за различните видове восъци, аромати и техники за изработка. Ще си тръгнете с две ръчно изработени свещи и знанията да правите свои собствени у дома.',
      shortDesc: 'Научете изкуството на правенето на соеви свещи. Ще си тръгнете с две ръчно изработени свещи.',
      image: 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
      price: 39,
      duration: '2.5 часа',
      maxSpots: 8,
      includes: [
        'Всички материали и инструменти',
        'Две ръчно изработени соеви свещи',
        'Рецепта и инструкции за вкъщи',
        'Чай и лека закуска',
        'Сертификат за участие',
      ],
      steps: [
        'Запознаване с материалите и техниките',
        'Избор на аромати и пигменти',
        'Топене и смесване на восъка',
        'Заливане и украса',
        'Охлаждане и финален резултат',
      ],
    },
  })

  const jesmoniteWorkshop = await prisma.workshop.upsert({
    where: { slug: 'rabotilnitsa-jesmonite' },
    update: {},
    create: {
      title: 'Работилница за Jesmonite изделия',
      slug: 'rabotilnitsa-jesmonite',
      description: 'Открийте магията на Jesmonite - модерния материал, с който можете да правите красиви декоративни изделия. В тази работилница ще научите основните техники за работа с Jesmonite и ще изработите свои собствени уникални изделия.',
      shortDesc: 'Открийте магията на Jesmonite. Ще изработите декоративна купа или поднос.',
      image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
      price: 45,
      duration: '3 часа',
      maxSpots: 6,
      includes: [
        'Всички материали (Jesmonite, пигменти, форми)',
        'Едно декоративно изделие по избор',
        'Инструкции и рецепти за вкъщи',
        'Чай и лека закуска',
        'Сертификат за участие',
      ],
      steps: [
        'Запознаване с Jesmonite и неговите свойства',
        'Подготовка на формите',
        'Смесване и оцветяване',
        'Заливане с техники (мрамор, терацо)',
        'Демолдиране и финишна обработка',
      ],
    },
  })

  // Sessions for candle workshop
  const futureDates = [
    new Date('2025-02-15'),
    new Date('2025-03-01'),
    new Date('2025-03-15'),
    new Date('2025-04-05'),
  ]

  for (const date of futureDates) {
    await prisma.workshopSession.create({
      data: {
        workshopId: candleWorkshop.id,
        date,
        startTime: '10:00',
        endTime: '12:30',
        spotsLeft: Math.floor(Math.random() * 6) + 2,
      },
    })

    await prisma.workshopSession.create({
      data: {
        workshopId: candleWorkshop.id,
        date,
        startTime: '14:00',
        endTime: '16:30',
        spotsLeft: Math.floor(Math.random() * 6) + 2,
      },
    })
  }

  // Sessions for jesmonite workshop
  const jesmoniteDates = [
    new Date('2025-02-22'),
    new Date('2025-03-08'),
    new Date('2025-03-22'),
  ]

  for (const date of jesmoniteDates) {
    await prisma.workshopSession.create({
      data: {
        workshopId: jesmoniteWorkshop.id,
        date,
        startTime: '10:00',
        endTime: '13:00',
        spotsLeft: Math.floor(Math.random() * 4) + 2,
      },
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
