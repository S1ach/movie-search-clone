import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Произошла ошибка',
  description = 'Не удалось загрузить данные. Попробуйте ещё раз.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-6">
        <AlertTriangle className="h-10 w-10 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
        {description}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </div>
  );
}
