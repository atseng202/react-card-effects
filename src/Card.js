/** 
 * Card renders presentational data about a card object
 * 
 * props: card object like:
 *  { 
 *      id,
        "image": "https://deckofcardsapi.com/static/img/KH.png",
        "value": "KING",
        "suit": "HEARTS",
        "code": "KH"
      }
 * 
 * state: none
 * 
 * Deck -> Card
 **/

function Card({ card }){
  return (
    <div className="Card">
      <img src={card.image} alt={card.value+" of "+card.code}></img>
    </div>
);
}

export default Card;