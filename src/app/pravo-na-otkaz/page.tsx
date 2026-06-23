import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Право на отказ',
}

export default function PravoNaOtkazPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <p className="section-subtitle">Правна информация</p>
        <h1 className="font-serif text-5xl text-navy">Право на отказ и връщане</h1>
        <div className="w-16 h-px bg-sage mt-4" />
      </div>

      <div className="font-sans text-navy/70 space-y-8 leading-relaxed">
        <div className="bg-cream p-6 border-l-4 border-sage">
          <p className="font-serif text-lg text-navy">
            Като потребител имате право да се откажете от поръчката в рамките на 14 дни от получаването й, без да посочвате причина.
          </p>
        </div>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">Условия за връщане</h2>
          <ul className="list-disc list-inside space-y-3">
            <li>Продуктът трябва да е в оригиналното си състояние и опаковка</li>
            <li>Продуктът не трябва да е бил използван</li>
            <li>Срокът за връщане е 14 дни от получаването</li>
            <li>Не приемаме връщане на персонализирани изделия</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">Как да върнете продукт</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Свържете се с нас на eleganssastudio@gmail.com</li>
            <li>Посочете номера на поръчката и причината за връщане</li>
            <li>Ние ще ви изпратим инструкции за връщане</li>
            <li>Изпратете продукта на нашия адрес (Варна, ул. Бреза 2)</li>
            <li>Ще възстановим сумата в рамките на 14 дни от получаване на пратката</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">Разходи за връщане</h2>
          <p>
            Разходите за връщане на продукта са за сметка на клиента. При дефектен продукт или грешна поръчка от наша страна - разходите са за наша сметка.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">Работилници</h2>
          <p>
            При отказ от работилница:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Повече от 48 часа преди събитието: пълно възстановяване</li>
            <li>24-48 часа преди събитието: 50% от сумата</li>
            <li>По-малко от 24 часа: без възстановяване</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">Контакт</h2>
          <p>
            За въпроси относно връщане на продукт: <a href="mailto:eleganssastudio@gmail.com" className="text-sage hover:text-navy transition-colors">eleganssastudio@gmail.com</a>
          </p>
        </section>

        <p className="text-sm text-navy/40">Последна актуализация: Декември 2024</p>
      </div>
    </div>
  )
}
