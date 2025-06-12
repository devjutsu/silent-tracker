export default function LandingPreview() {
  return (
    <div className="max-w-md text-secondary/80 text-center my-16">
      <h2 className="text-lg font-semibold mb-2">Что такое Silent Tracker?</h2>
      <p className="text-sm sm:text-base leading-relaxed">
        Это дневник фокус-сессий и состояний, который помогает лучше чувствовать
        себя, повышать концентрацию и замечать свои внутренние ритмы.
      </p>
      <a
        href="/about"
        className="inline-block mt-4 text-md text-info/80 hover:underline hover:text-info"
      >
        Подробнее →
      </a>
    </div>
  );
}
