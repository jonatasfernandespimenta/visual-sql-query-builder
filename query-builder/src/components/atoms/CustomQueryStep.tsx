import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { tv } from 'tailwind-variants';

interface CustomQueryStepProps {
  id: string;
  stepName: string;
  onCustomValueChange?: (value: string) => void;
}

const step = tv({
  base: 'flex flex-wrap items-center justify-center rounded p-2 w-42 h-14 shadow-xl cursor-pointer select-none bg-[#56C0FB] hover:bg-[#3A8EBA]',
})

export function CustomQueryStep({ id, stepName, onCustomValueChange }: CustomQueryStepProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const [customValue, setCustomValue] = useState<string>('');

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
        className={step()}
        {...listeners}
        {...attributes}
      >
        <input
          type="text"
          className='w-24 font-bold bg-transparent'
          placeholder={stepName}
          value={customValue}
          onChange={e => setCustomValue(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => { if (e.key === 'Enter') { onCustomValueChange?.(customValue); } }}
          onBlur={() => onCustomValueChange?.(customValue)}
        />
      </div>
    </div>
  );
}
