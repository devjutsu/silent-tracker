import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">
          О проекте Silent Tracker
        </h1>

        <section className="flex justify-center items-center p-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={384}
            height={384}
            className="w-48 sm:w-96 h-auto"
            priority
          />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Зачем он нужен?</h2>
          <p>
            Silent Tracker создан для тех, кто хочет лучше понимать своё
            состояние, работать внимательнее и отдыхать осознанно. Без соцсетей,
            без наград, без отвлекающих фич — только ты и твоё внимание.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Как это работает?</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>⏱️ Отмечаешь фокус-сессии: когда начал, чем занимаешься</li>
            <li>📍 Фиксируешь пульсы: фокус, настроение, энергия</li>
            <li>📊 Смотришь ретроспективу: что работает, где выгораешь</li>
            <li>🌿 Вставки для восстановления: дыхание, отдых для глаз</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Почему "тихий"?</h2>
          <p>
            Потому что он не шумит. Не давит уведомлениями. Не геймифицирует
            твой день. Он просто ждёт, когда ты сам захочешь замедлиться и
            посмотреть внутрь себя.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Что дальше?</h2>
          <p>
            Мы постепенно добавим визуализацию паттернов, экспорт данных, и
            анонимный обмен инсайтами. Но всё будет по-прежнему тихо.
          </p>
        </section>

        <div className="text-center pt-6">
          <a href="/" className="btn btn-primary">
            Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
