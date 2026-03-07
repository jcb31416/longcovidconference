export default function Section({ id, title, children }) {
  return (
    <section id={id} className="max-w-5xl mx-auto py-16">
      <h2 className="text-3xl font-semibold mb-8 text-secondary-500 italic capitalize">
        {title}
      </h2>
      {children}
    </section>
  );
}
