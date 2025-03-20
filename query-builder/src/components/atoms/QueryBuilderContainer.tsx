import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface QueryBuilderContainerProps {
  id: string;
  children: React.ReactNode;
}

export function QueryBuilderContainer(props: QueryBuilderContainerProps) {
  const { setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} className='flex p-8 pb-72 flex-wrap bg-white rounded w-full h-full'>
      {props.children}
    </div>
  );
}
