export function ColorIdTypeTable({ colorIds, colorIdAggregates }) {
  const totals = {};

  const relevantTypes = [
    "Creature",
    "Enchantment",
    "Instant",
    "Sorcery",
    "Planeswalker",
    "Artifact",
    "Land",
    "Total",
  ];
  relevantTypes.forEach((type) => {
    totals[type] = 0;
  });

  return (
    <div className="overflow-x-auto mt-6">
      <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Color ID</th>
            {relevantTypes.map((type) => (
              <th key={type} className="border px-4 py-2 text-right">
                {type}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {colorIds.map((colorId) => {
            const row = colorIdAggregates[colorId];
            return (
              <tr key={colorId} className="text-right">
                <td className="border px-4 py-2 text-left font-semibold">
                  {colorId}
                </td>
                {relevantTypes.map((type) => {
                  const count = row?.[type] ?? 0;
                  totals[type] += count;
                  return (
                    <td key={type} className="border px-4 py-2">
                      {count}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold text-right">
            <td className="border px-4 py-2 text-left">Total</td>
            {relevantTypes.map((type) => (
              <td key={type} className="border px-4 py-2">
                {totals[type]}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
