const SUITS = ["♠","♥","♦","♣"];

const RANKS = [
"2","3","4","5","6","7","8",
"9","10","J","Q","K","A"
];

function createDeck(){

let deck=[];

for(let suit of SUITS){

for(let rank of RANKS){

deck.push({
rank,
suit
});

}

}

return deck;

}

function shuffle(deck){

for(let i=deck.length-1;i>0;i--){

const j=Math.floor(
Math.random()*(i+1)
);

[deck[i],deck[j]]=
[deck[j],deck[i]];

}

return deck;

}

function draw(){

return state.deck.pop();

}