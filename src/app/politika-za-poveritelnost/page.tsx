import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика за поверителност',
}

export default function PolitikaZaPoveritelnostPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <p className="section-subtitle">Правна информация</p>
        <h1 className="font-serif text-5xl text-navy">Политика за поверителност</h1>
        <div className="w-16 h-px bg-sage mt-4" />
      </div>

      <div className="prose max-w-none font-sans text-navy/70 space-y-8 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">1. Информация за администратора</h2>
          <p>
            Eleganssa Studio е администратор на лични данни по смисъла на Регламент (ЕС) 2016/679 (GDPR). Седалище: Варна, ул. Бреза 2, България. Имейл: eleganssastudio@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">2. Какви данни събираме</h2>
          <p>При използване на нашия уебсайт и услуги, можем да събираме следните лични данни:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Имена и фамилия</li>
            <li>Имейл адрес</li>
            <li>Телефонен номер</li>
            <li>Адрес за доставка</li>
            <li>Информация за плащане (обработва се от Stripe)</li>
            <li>История на поръчките</li>
            <li>Данни за използване на сайта (бисквитки, IP адрес)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">3. Как използваме данните</h2>
          <p>Събраните данни се използват за:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Обработка и доставка на поръчките</li>
            <li>Потвърждение на резервации за работилници</li>
            <li>Комуникация с клиентите</li>
            <li>Изпращане на бюлетин (само с изрично съгласие)</li>
            <li>Подобряване на услугите ни</li>
            <li>Спазване на законови задължения</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">4. Правно основание</h2>
          <p>
            Обработваме данните ви на основание: изпълнение на договор (за поръчки), законово задължение и ваше съгласие (за маркетинг съобщения).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">5. Съхранение на данни</h2>
          <p>
            Данните за поръчки се съхраняват 5 години по данъчни причини. Данни за бюлетин - до отписване. Бисквитки - вижте нашата Политика за бисквитки.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">6. Вашите права</h2>
          <p>Имате право на:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Достъп до личните ви данни</li>
            <li>Коригиране на неточни данни</li>
            <li>Изтриване ("право да бъдете забравени")</li>
            <li>Ограничаване на обработката</li>
            <li>Преносимост на данните</li>
            <li>Право на жалба пред КЗЛД</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-navy mb-4">7. Контакт</h2>
          <p>
            За въпроси относно обработката на вашите данни, моля свържете се с нас на: eleganssastudio@gmail.com
          </p>
        </section>

        <p className="text-sm text-navy/40">Последна актуализация: Декември 2024</p>
      </div>
    </div>
  )
}
