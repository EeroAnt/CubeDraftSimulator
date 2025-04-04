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
    });
  }

  function renderCard(card) {
    return (
      <div
        key={card.id}
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
              <span>{card.avg_pick?.toFixed(1) ?? "-"}</span>
              <span>{card.avg_commander_pick?.toFixed(1) ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span># {card.amount_of_picks || "-"}</span>
              <span># {card.amount_of_commander_picks || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return cards.length <= 20 ? (
    <div className="w-full max-w-6xl mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayCards.map((card, index) => renderCard(card, index))}
      </div>
    </div>
  ) : (
    <div className="w-full max-w-6xl mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <h2 className="text-2xl font-semibold mb-4 col-span-full">
          Bottom 20 Cards
        </h2>
        {bottomCards.map((card, index) => renderCard(card, index))}
        <h2 className="text-2xl font-semibold mb-4 col-span-full">
          Top 20 Cards
        </h2>
        {topCards.map((card, index) => renderCard(card, index))}
      </div>
    </div>
  );
};

export const NotDraftedCardView = ({ cards }) => {
  const displayCards = [...cards].slice(0, 200);
  function renderCard(card) {
    return (
      <div
        key={card.id}
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
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mt-8">
      {cards.length > 200 && (
        <div className="text-center mt-4 text-gray-500 text-sm">
          Only showing the first 200 out of {cards.length} cards.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayCards.map((card, index) => renderCard(card, index))}
      </div>
    </div>
  );
}