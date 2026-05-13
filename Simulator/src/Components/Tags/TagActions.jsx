import { sendMessage } from '../../Services';

export const useTagActions = (connection, token, selectedCards, setSelectedCards) => {
  const tagSelectedCards = (tags) => {
    if (selectedCards.length === 0) {
      alert("No cards selected");
      return;
    }
    const message = {
      type: "Tag",
      cards: selectedCards.map(c => c.id),
      tags: tags,
      token: token
    };
    sendMessage(connection, message);
    setSelectedCards([]);
  };

  const removeTagFromCard = (cardId, tag) => {
    const message = {
      type: "Remove Tag",
      card: cardId,
      tag: tag,
      token: token
    };
    sendMessage(connection, message);
  };

  return { tagSelectedCards, removeTagFromCard };
};