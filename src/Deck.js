import { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

/** 
 * Deck renders a container a draw button and list of Cards
 * 
 * props: none
 * 
 * state: 
 * - isLoading
 * - deck, object like:
 * {
    "success": true,
    "deck_id": "3p40paa87x90",
    "shuffled": false,
    "remaining": 52
    }
 * - cards, array like:
 *  [{
      "image": "https://deckofcardsapi.com/static/img/KH.png",
      "value": "KING",
      "suit": "HEARTS",
      "code": "KH"
    }, ....]
 * - isDrawing: Boolean
 * - isShuffling: Boolean
 * - error: TODO:
 * 
 * App -> Deck -> Card
 **/

function Deck() {
  // Loading for getting a new deck, drawing a new card, for shuffling
  const [isLoading, setIsLoading] = useState(true);
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [error, setError] = useState(null);
  console.debug("rendering isLoading= ", isLoading);
  console.debug("rendering deck= ", deck);
  console.debug("rendering cards= ", cards);
  console.debug("rendering isDrawing= ", isDrawing);
  console.debug("rendering isShuffling= ", isShuffling);

  /** Fetch a new deck id and meta info about deck 
   * when component renders the first time 
   **/
  useEffect(function fetchNewDeckOnMount() {

    async function fetchNewDeck() {
      console.debug("fetchNewDeck");
      let deckResult;
      try {
      deckResult = await axios.get(`${BASE_URL}/new/`);
      } catch (err){
        setError(err.message);
      } finally {
        setDeck(deckResult.data);
        setIsLoading(false);
      }
    }

    fetchNewDeck();
  }, []);

  /** Fetches a new card when isDrawing is true */
  useEffect(function fetchNewCard() {

    async function _fetchNewCard() {
      console.debug("fetchNewCard: deck=", deck);
      let cardResult;
      try {
        cardResult = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/?count=1`);
      } catch (err){
        setError(err.message);
      } finally {
        // TODO: Fix this 
        if (cardResult.data.remaining === 0) {
          alert("Error: no cards remaining!");
        } else {
          setCards(prevCards => {
            return [
              ...prevCards,
              {...cardResult.data.cards[0]}
            ]
          });
        }
        console.debug("fetchNewCard after axios deck= ", deck);
        // prevent drawing on next re-render
        setIsDrawing(false);
        setIsLoading(false);
      }
    }

    if (isDrawing) _fetchNewCard();
  }, [isDrawing]);

  /** Shuffles deck when shuffle is true */
  useEffect(function shuffleDeck() {
    async function _shuffleDeck() {
      console.debug("shuffleDeck: deck=", deck);
      let deckResult;
      try {
        deckResult = await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle/`);
        setDeck(deckResult.data);
      } catch (err){
        setError(err.message);
      } finally {
        setCards([]);

        console.debug("fetchNewCard after axios deck= ", deck);
        // prevent shuffling on next re-render
        setIsShuffling(false);
        setIsLoading(false);
      }
    }

    if (isShuffling) _shuffleDeck();
  }, [isShuffling]);

  /** Draw a card from cards in state */
  function handleDrawCard(evt) {
    // Fail fast if shuffle is true do not draw card
    setIsLoading(true);
    if (isShuffling) return;
    setIsDrawing(true);
  }

  /** Draw a card from cards in state */
  function handleShuffle(evt) {
    setIsLoading(true);
    setIsShuffling(true);
  }

  let renderCards = cards.map(card => (
      <Card
        key={card.code}
        card={card}
      />
    ));
  
  // TODO: resetting error with successful API path
  let errorMsg = error && <b>Oh no! {error}</b>;

  if (isLoading) return <i>Loading...</i>;
  
  return (
    <div className="Deck">
      <button onClick={handleDrawCard}>Gimme a card!</button>
      <button onClick={handleShuffle}>Shuffle!</button>
      {errorMsg}
      <div>{renderCards}</div>
    </div>
  )
}

export default Deck;
