import { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from 'uuid';

// const NEW_DECK_URL = "https://deckofcardsapi.com/api/deck/new";
// /<<deck_id>>/draw/?count=2";
const BASE_URL = "https://deckofcardsapi.com/api/deck";

/** 
 * Deck renders a container a draw button and list of Cards
 * 
 * props: deckCount: int, number of decks, default 1
 * 
 * state: cards, array like:
 *  [{
      "image": "https://deckofcardsapi.com/static/img/KH.png",
      "value": "KING",
      "suit": "HEARTS",
      "code": "KH"
    }, ....]
 * 
 * evt: listens for click on draw button
 * 
 * App -> Deck -> Card
 **/

function Deck() {
  const [isLoading, setIsLoading] = useState(true);
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [shouldDraw, setShouldDraw] = useState(false);
  console.debug("rendering deck= ", deck);
  console.debug("rendering cards= ", cards);
  console.debug("rendering shouldDraw= ", shouldDraw);

  /** Fetch a new deck id and meta info about deck 
   * when component renders the first time 
   **/
  useEffect(function fetchNewDeckOnMount() {

    async function fetchNewDeck() {
      console.debug("fetchNewDeck");
      const deckResult = await axios.get(`${BASE_URL}/new/`);
      setDeck(deckResult.data);
      setIsLoading(false);
    }

    fetchNewDeck();
  }, []);

  /** Fetches a new card when shouldDraw is true */
  useEffect(function fetchNewCardOnClick() {

    async function fetchNewCard() {
      console.debug("fetchNewCard: deck=", deck);
      const cardResult = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/?count=1`);

      if (cardResult.data.error) {
        alert("Error: no cards remaining!");
      } else {
        setCards(prevCards => {
          return [
            ...prevCards,
            {
              ...cardResult.data.cards[0],
              id: uuid()
            }
          ]
        });
      }
      console.debug("fetchNewCard after axios deck= ", deck);
      // prevent drawing on next re-render
      setShouldDraw(false);
    }

    if (shouldDraw) fetchNewCard();
  }, [shouldDraw]);

  /** Draw a card from cards in state */
  function handleDrawCard(evt) {
    setShouldDraw(true);
  }

  let renderCards = (
    cards.map(card => (
      <Card
        key={card.id}
        card={card}
      />
    ))
  );

  if (isLoading) return <i>Loading...</i>;
  
  return (
    <div className="Deck">
      <button onClick={handleDrawCard}>Gimme a card!</button>
      <div>{renderCards}</div>
    </div>
  )
}

export default Deck;
