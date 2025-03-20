import { CustomQueryStep } from "../atoms/CustomQueryStep";
import { QueryBuilderSectionContainer } from "../atoms/QueryBuilderSectionContainer";
import { QueryStep } from "../atoms/QueryStep";

interface Item {
  id: string;
  parent: string | null;
  stepName: string;
  type: 'query' | 'table' | 'column' | 'number' | 'condition' | 'custom';
}


interface QueriesSectionProps {
  items: Item[];
  section: string;
  type: 'query' | 'table' | 'column' | 'number' | 'condition' | 'custom';
  options?: { name: string, value: string }[];
  onOptionChange?: (value: string) => void;
}

export function QueryStepSection({ items, section, type, options, onOptionChange }: QueriesSectionProps) {
  return (
    <QueryBuilderSectionContainer onOptionChange={onOptionChange} sectionName={section} options={options}>
      {items.filter(item => item.parent === null).map(item => (
        <div className="m-1">
          {item.type === 'custom' ? (
            <CustomQueryStep key={item.id} id={item.id} stepName={item.stepName} />
          ) : (
            <QueryStep key={item.id} id={item.id} stepName={item.stepName} type={type} />
          )}
        </div>
      ))}
    </QueryBuilderSectionContainer>
  )
}
