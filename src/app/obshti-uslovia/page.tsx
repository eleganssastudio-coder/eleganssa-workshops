import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Общи условия',
}

export default function ObshtiUsloviaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <p className="section-subtitle">Правна информация</p>
        <h1 className="font-serif text-5xl text-navy">Общи условия</h1>
        <div className="w-16 h-px bg-sage mt-4" />
      </div>

      <div className="font-sans text-navy/70 space-y-8 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">1. Общи разпоредби</h2>
          <p>
            Настоящите общи условия уреждат отношенията между Eleganssa Studio (Продавач) и потребителите на онлайн магазина eleganssastudio.com (Купувач).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">2. Продукти и услуги</h2>
          <p>
            Eleganssa Studio предлага ръчно изработени соеви свещи, Jesmonite изделия и подаръчни комплекти, както и творчески работилници. Всички продукти са изработени ръчно и могат да се различават леко от снимките.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">3. Поръчки</h2>
          <p>
            Поръчките се обработват в рамките на 1-2 работни дни. Приемаме поръчки онлайн чрез нашия сайт. Потвърждение за поръчката се изпраща на посочения имейл адрес.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">4. Цени и плащане</h2>
          <p>
            Всички цени са в евро и включват ДДС. Приемаме плащания с банкови карти чрез Stripe. При технически проблем с плащането, не се задържат средства от вашата сметка.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">5. Доставка</h2>
          <p>
            Доставките се извършват в рамките на България. Срок на доставка: 3-5 работни дни. Безплатна доставка при поръчки над 100 €. При поръчки под 100 € - 7 € за доставка.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">6. Работилници</h2>
          <p>
            Резервациите за работилници са обвързващи. При отказ до 48 часа преди събитието - пълно възстановяване. При по-кратък срок - 50% такса. При отмяна от наша страна - пълно възстановяване.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">7. Приложимо право</h2>
          <p>
            Настоящите условия се уреждат от законодателството на Република България. За неуредени въпроси се прилага Законът за защита на потребителите.
          </p>
        </section>

        <p className="text-sm text-navy/40">Последна актуализация: Декември 2024</p>
      </div>
    </div>
  )
}
