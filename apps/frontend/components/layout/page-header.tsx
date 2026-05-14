type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600">{description}</p>
      </div>
    </section>
  );
}
