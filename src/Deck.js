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
 * TODO:
 * state: isLoading, deck, cards, array like:
 *  [{
      "image": "https://deckofcardsapi.com/static/img/KH.png",
      "value": "KING",
      "suit": "HEARTS",
      "code": "KH"
    }, ....]
 * 
 * 
 * App -> Deck -> Card
 **/

function Deck() {
  // TODO: Be more specific with loading - what are you loading
  const [isLoading, setIsLoading] = useState(true);
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  // TODO: from should to is/has/etc
  const [shouldDraw, setShouldDraw] = useState(false);
  console.debug("rendering deck= ", deck);
  console.debug("rendering cards= ", cards);
  console.debug("rendering shouldDraw= ", shouldDraw);

  /** Fetch a new deck id and meta info about deck 
   * when component renders the first time 
   **/
  useEffect(function fetchNewDeckOnMount() {

    async function fetchNewDeck() {
      // TODO: add error alert with try/catch
      console.debug("fetchNewDeck");
      const deckResult = await axios.get(`${BASE_URL}/new/`);
      setDeck(deckResult.data);
      setIsLoading(false);
    }

    fetchNewDeck();
    // Can include setDeck and isLoading as dependencies
  }, []);

  // TODO: Change function name, not actually on click
  /** Fetches a new card when shouldDraw is true */
  useEffect(function fetchNewCardOnClick() {
    // TODO: include isLoading as API scales
    async function fetchNewCard() {
      console.debug("fetchNewCard: deck=", deck);
      const cardResult = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/?count=1`);
      // TODO: can use a try/catch and handle this error and/or API error
      // TODO: use explicit piece of data from API
      if (cardResult.data.error) {
        alert("Error: no cards remaining!");
      } else {
        setCards(prevCards => {
          return [
            ...prevCards,
            {
              ...cardResult.data.cards[0],
              id: uuid() // TODO: use code from card data
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

  let renderCards = cards.map(card => (
      <Card
        key={card.code}
        card={card}
      />
    ));

  if (isLoading) return <i>Loading...</i>;
  
  return (
    <div className="Deck">
      <button onClick={handleDrawCard}>Gimme a card!</button>
      <div>{renderCards}</div>
    </div>
  )
}

export default Deck;
