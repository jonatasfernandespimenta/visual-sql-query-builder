import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { QueryStep } from '../atoms/QueryStep';
import { QueryBuilderContainer } from '../atoms/QueryBuilderContainer';
import { QueryStepSection } from '../molecules/QueryStepSection';
import { fetchColumnsFromTable, fetchQuery, fetchTables } from '../../services/ms-sql';
import { CustomQueryStep } from '../atoms/CustomQueryStep';

export interface Item {
  id: string;
  parent: string | null;
  stepName: string;
  type: 'query' | 'table' | 'column' | 'number' | 'condition' | 'custom';
  modifiedAt?: Date;
  isVisible?: boolean;
}

const queries: Item[] = [
  { id: 'select', parent: null, stepName: 'Select', type: 'query', modifiedAt: new Date() },
  { id: 'where', parent: null, stepName: 'Where', type: 'query', modifiedAt: new Date() },
  { id: 'update', parent: null, stepName: 'Update', type: 'query', modifiedAt: new Date() },
  { id: 'delete', parent: null, stepName: 'Delete', type: 'query', modifiedAt: new Date() },
  { id: 'from', parent: null, stepName: 'From', type: 'query', modifiedAt: new Date() },
  { id: 'insert into', parent: null, stepName: 'Insert into', type: 'query', modifiedAt: new Date() },
  { id: 'limit', parent: null, stepName: 'Limit', type: 'query', modifiedAt: new Date() },
  { id: 'count(*)', parent: null, stepName: 'Count', type: 'query', modifiedAt: new Date() },

  { id: 'five', parent: null, stepName: '5', type: 'number', modifiedAt: new Date() },
  { id: 'ten', parent: null, stepName: '10', type: 'number', modifiedAt: new Date() },
  { id: 'twenty', parent: null, stepName: '20', type: 'number', modifiedAt: new Date() },
  { id: 'fifty', parent: null, stepName: '50', type: 'number', modifiedAt: new Date() },
  { id: 'hundred', parent: null, stepName: '100', type: 'number', modifiedAt: new Date() },
  { id: 'thousand', parent: null, stepName: '1000', type: 'number', modifiedAt: new Date() },

  { id: 'and', parent: null, stepName: 'And', type: 'condition', modifiedAt: new Date() },
  { id: '=', parent: null, stepName: 'Equal to', type: 'condition', modifiedAt: new Date() },
  { id: '>', parent: null, stepName: 'Greater than', type: 'condition', modifiedAt: new Date() },
  { id: '<', parent: null, stepName: 'Lesser than', type: 'condition', modifiedAt: new Date() },
  { id: 'not', parent: null, stepName: 'Not', type: 'condition', modifiedAt: new Date() },

  { id: 'custom', parent: null, stepName: 'Insert value', type: 'custom', modifiedAt: new Date() },
];

export function QueryBuilder() {
  const [allItems, setAllItems] = useState<Item[]>(queries);
  const [droppedItems, setDroppedItems] = useState<Item[]>([]);
  const [columnItems, setColumnItems] = useState<Item[]>([]);
  const [options, setOptions] = useState<{ name: string, value: string }[]>([]);

  const tablesFetched = useRef(false);

  const handleFetchTables = useCallback(async () => {
    if (tablesFetched.current) return;
    const tables = await fetchTables();
    tablesFetched.current = true;

    setOptions(tables.map(table => {
      return {
        name: table,
        value: table
      }
    }));

    setAllItems(prev => [...prev, ...tables.map(table => {
      return {
        stepName: table,
        id: table + '-' + Date.now(),
        parent: null,
        modifiedAt: new Date(),
        type: 'table' as 'table'
      }
    }
    )]);
  }, [])

  useEffect(() => {
    handleFetchTables();
  }, [])

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    const isDroppedItem = droppedItems.some(item => item.id === active.id);
    if (over && over.id === 'droppable') {
      if (!isDroppedItem) {
        const item = allItems.find(item => item.id === active.id);
        if (item) {
          const newItem = {
            ...item,
            id: item.id + '-' + Date.now(),
            modifiedAt: new Date(),
            parent: 'droppable'
          };
          setDroppedItems(prev => [...prev, newItem]);
        }
      }
    } else {
      if (isDroppedItem) {
        setDroppedItems(prev => prev.filter(item => item.id !== active.id));
      }
    }
  }, [droppedItems, allItems]);

  const queryItems = useMemo(() => allItems.filter(item => item.type === 'query' && !item.parent), [allItems]);
  const tableItems = useMemo(() => allItems.filter(item => item.type === 'table' && !item.parent), [allItems]);
  const numberItems = useMemo(() => allItems.filter(item => item.type === 'number' && !item.parent), [allItems]);
  const conditionItems = useMemo(() => allItems.filter(item => item.type === 'condition' && !item.parent), [allItems]);
  const customItems = useMemo(() => allItems.filter(item => item.type === 'custom' && !item.parent), [allItems]);

  useEffect(() => {
    handleChangeTable('User')
  }, [])

  const handleChangeTable = useCallback(async (e: string) => {
    const columns = await fetchColumnsFromTable(e);

    const columnItems = columns.map(column => {
      return {
        stepName: column,
        id: column + '-' + Date.now(),
        parent: null,
        modifiedAt: new Date(),
        type: 'column' as 'column'
      }
    });

    columnItems.push({ id: 'all', parent: null, stepName: 'all', type: 'column', modifiedAt: new Date() })

    setColumnItems(columnItems);
    setAllItems(prev => [...prev, ...columnItems]);
  }, [])

  const handleFetchQuery = async () => {
    const query = await fetchQuery(droppedItems);
  }

  const handleCustomValueChange = useCallback((id: string, value: string) => {
    setDroppedItems(prev => prev.map(i => i.id === id ? { ...i, stepName: value } : i));
  }, []);

  useEffect(() => {
    const lastItem = droppedItems[droppedItems.length - 1];
    const containsTable = droppedItems.some(item => item.type === 'table');

    if (!containsTable) {
      console.log('no last item')
      setColumnItems([{ id: 'all', parent: null, stepName: 'all', type: 'column', modifiedAt: new Date() }])
    }

    if (lastItem && lastItem.type === 'table') {
      handleChangeTable(lastItem.stepName);
    }

    if (lastItem && lastItem.type !== 'table') {
      const tableItem = droppedItems.find(item => item.type === 'table');
      if (tableItem) {
        handleChangeTable(tableItem.stepName);
      }
    }
  }, [droppedItems])

  return (
    <div className='w-[85vh] h-[40vh]'>
      <DndContext onDragEnd={handleDragEnd}>
        <QueryStepSection section='Query' items={queryItems} type='query' />
        <QueryStepSection section='Custom' items={customItems} type='custom' />
        <QueryStepSection section='Numbers' items={numberItems} type='number' />
        <QueryStepSection section='Conditions' items={conditionItems} type='condition' />
        <QueryStepSection section='Table' items={tableItems} type='table' />
        <QueryStepSection section='Columns' items={columnItems} type='column' options={options} onOptionChange={(value) => handleChangeTable(value)} />
        <QueryBuilderContainer id="droppable">
          {droppedItems.length === 0
            ? ''
            : droppedItems.map(item => (
              <div className='-ml-5' key={item.id}>
                {item.type === 'custom' ? (
                  <CustomQueryStep
                    id={item.id}
                    stepName={item.stepName}
                    onCustomValueChange={(value) => handleCustomValueChange(item.id, value)}
                  />
                ) : (
                  <QueryStep id={item.id} stepName={item.stepName} type={item.type} />
                )}
              </div>
            ))
          }
        </QueryBuilderContainer>
      </DndContext>

      <button onClick={handleFetchQuery}>Run</button>
    </div>
  );
}
