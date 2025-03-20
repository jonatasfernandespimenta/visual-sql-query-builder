import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { tv } from 'tailwind-variants';

interface QueryStepProps {
  id: string;
  stepName: string;
  type: 'query' | 'table' | 'column' | 'number' | 'condition' | 'custom';
}

const step = tv({
  base: 'flex flex-wrap items-center justify-center rounded p-2 w-42 h-14 shadow cursor-pointer select-none',
  variants: {
    type: {
      query: 'bg-[#a568f3] hover:bg-[#8e4ad6]',
      table: 'bg-[#eeaa6a] hover:bg-[#d48d55] text-white',
      column: 'bg-[#73dda2] hover:bg-[#5cb883] text-white',
      number: 'bg-[#ffad0d] hover:bg-[#d78f0b] text-white',
      condition: 'bg-[#10c9b2] hover:bg-[#0ba890] text-white',
      custom: 'bg-[#56c0fb] hover:bg-[#3ea1d8] text-white',
    }
  }
})

export function QueryStep({ id, stepName, type }: QueryStepProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div style={{ filter: 'drop-shadow(0px 4px 2px rgba(0, 0, 0, 0.25))' }}>
      <div
        ref={setNodeRef}
        style={{
          clipPath: 'polygon(85% 0%, 100% 50%, 85% 100%, 0% 100%, 14% 50%, 0 0)',
          WebkitClipPath: 'polygon(85% 0%, 100% 50%, 85% 100%, 0% 100%, 14% 50%, 0 0)',
          ...style
        }}
        className={step({ type })}
        {...listeners}
        {...attributes}
      >
        <p className='font-bold'>{stepName}</p>
      </div>
    </div>
  );
}
