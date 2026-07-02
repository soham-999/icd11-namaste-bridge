// src/components/ui/EmptyState.tsx
export function EmptyState({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <span className="text-3xl mb-2">{emoji}</span>
      <p className="text-sm font-semibold text-brand">{title}</p>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>
    </div>
  );
}