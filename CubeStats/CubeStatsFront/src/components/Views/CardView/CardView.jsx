import { CardImage } from "./";

export const DraftedCardView = ({ cards, sortKey }) => {
  let displayCards = [];
  let bottomCards = [];
  let topCards = [];
  if (cards.length > 20) {
    bottomCards = [...cards]
      .sort((a, b) => {
        const aValue = a[sortKey] ?? -Infinity;
        const bValue = b[sortKey] ?? -Infinity;
        return bValue - aValue;
      })
      .slice(0, 20);
    topCards = [...cards]
      .sort((a, b) => {
        const aValue = a[sortKey] ?? Infinity;
        const bValue = b[sortKey] ?? Infinity;

        return aValue - bValue;
      })
      .slice(0, 20);
  } else {
    displayCards = [...cards].sort((a, b) => {
      const aValue = a[sortKey] ?? -Infinity;
      const bValue = b[sortKey] ?? -Infinity;
      return bValue - aValue;
    })
  }

  return cards.length <= 20 ? (
    <div className="w-full max-w-6xl mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayCards.map((card, index) => (
          <div
            key={card.id || index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-2">
              <CardImage
                imageUrl={card.image_url}
                backsideUrl={card.backside_image_url}
              />
              <div className="mt-2 text-center">
                <h3 className="text-sm font-medium truncate">{card.name}</h3>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                <div className="flex justify-between">
                  <span>Pick</span>
                  <span>Commander</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>{card.avg_pick?.toFixed(1) ?? '-'}</span>
                  <span>{card.avg_commander_pick?.toFixed(1) ?? '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="w-full max-w-6xl mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <h2 className="text-2xl font-semibold mb-4 col-span-full">
          Bottom 20 Cards
        </h2>
        {bottomCards.map((card, index) => (
          <div
            key={card.id || index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-2">
              <CardImage
                imageUrl={card.image_url}
                backsideUrl={card.backside_image_url}
              />
              <div className="mt-2 text-center">
                <h3 className="text-sm font-medium truncate">{card.name}</h3>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                <div className="flex justify-between">
                  <span>Pick</span>
                  <span>Commander</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>{card.avg_pick?.toFixed(1) ?? '-'}</span>
                  <span>{card.avg_commander_pick?.toFixed(1) ?? '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <h2 className="text-2xl font-semibold mb-4 col-span-full">
          Top 20 Cards
        </h2>
        {topCards.map((card, index) => (
          <div
            key={card.id || index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-2">
              <CardImage
                imageUrl={card.image_url}
                backsideUrl={card.backside_image_url}
              />
              <div className="mt-2 text-center">
                <h3 className="text-sm font-medium truncate">{card.name}</h3>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                <div className="flex justify-between">
                  <span>Pick</span>
                  <span>Commander</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>{card.avg_pick?.toFixed(1) ?? '-'}</span>
                  <span>{card.avg_commander_pick?.toFixed(1) ?? '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
