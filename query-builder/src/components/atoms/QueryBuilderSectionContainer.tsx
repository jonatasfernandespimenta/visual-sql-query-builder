interface QueriesSectionProps {
  sectionName: string;
  children: React.ReactNode;
  options?: { name: string, value: string }[];
  onOptionChange?: (value: string) => void;
}

export function QueryBuilderSectionContainer({ children, sectionName, options, onOptionChange }: QueriesSectionProps) {
  return (
    <div className="flex flex-col p-2 items-start w-full flex-wrap bg-white rounded mb-2">
      <div className="flex flex-row w-full">
        <h2 className="font-bold text-[#242424] text-xl">{sectionName}</h2>

        {options && (
          <select className="text-[#242424] text-xl" onChange={(e) => onOptionChange && onOptionChange(e.target.value)}>
            {
              options.map(({ name, value }) => (
                <option key={value} value={value}>{name}</option>
              ))
            }
          </select>
        )}
      </div>

      <div className="flex flex-wrap flex-row">
        {children}
      </div>
    </div>
  )
}
