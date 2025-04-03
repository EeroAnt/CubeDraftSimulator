import { CardImage } from "./"; // Assuming this is the correct import path

export const CardView = ({ cards }) => {
  // Limit to 20 cards maximum
  const displayCards = cards.slice(0, 20);

  return (
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
            </div>
          </div>
        ))}
      </div>

      {cards.length > 20 && (
        <div className="mt-4 text-center text-gray-600">
          Showing 20 of {cards.length} cards
        </div>
      )}
    </div>
  );
};
