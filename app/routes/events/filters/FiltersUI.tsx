import { AvailableFilter, FILTER_NAMES } from "~/routes/events/filters/filters";

export function FiltersUI({ filters, toggleFilter }: {
  filters: AvailableFilter[]
  toggleFilter: (key: AvailableFilter) => void
}) {
  return (
    <div className="flex gap-2">
      <h3>Filter:</h3>
      <ul>
        {FILTER_NAMES.map((filterName) => (
          <li key={filterName}>
            <label className="flex gap-1">
              <input
                id={filterName}
                type="checkbox"
                checked={filters.includes(filterName)}
                onChange={() => toggleFilter(filterName)}
              />
              <span>{filterName}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
