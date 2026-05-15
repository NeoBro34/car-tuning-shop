import type { ReactNode } from "react";

type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  icon?: ReactNode;
  title: string;
};

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  return (
    <div className="auto-card rounded-lg p-8 text-center">
      {icon ? (
        <div className="mx-auto mb-5 grid size-12 place-items-center rounded-md bg-red-500/15 text-red-200">
          {icon}
        </div>
      ) : null}
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
