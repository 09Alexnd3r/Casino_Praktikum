"use strict";

/*
    TEXAS HOLD'EM
    Übungs-/Spielversion ohne Einsätze, Chips oder Glücksspielmechanik.

    Der Spieler spielt gegen vier Bots.
    Die Bots treffen einfache Entscheidungen anhand ihrer Handstärke.
*/

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const startButton = document.getElementById("startButton");
const foldButton = document.getElementById("foldButton");
const checkButton = document.getElementById("checkButton");
const nextHandButton = document.getElementById("nextHandButton");

const communityCardsElement = document.getElementById("communityCards");
const playerCardsElement = document.getElementById("playerCards");

const phaseLabel = document.getElementById("phaseLabel");
const handNumberElement = document.getElementById("handNumber");
const winCountElement = document.getElementById("winCount");

const tableStatus = document.getElementById("tableStatus");
const handMessage = document.getElementById("handMessage");
const gameMessage = document.getElementById("gameMessage");
const turnText = document.getElementById("turnText");

const resultPanel = document.getElementById("resultPanel");
const resultTitle = document.getElementById("resultTitle");
const winnerText = document.getElementById("winnerText");
const resultHands = document.getElementById("resultHands");

const botElements = [
    {
        id: 1,
        name: "Alex",
        seat: document.getElementById("bot1"),
        cards: document.getElementById("bot1Cards"),
        status: document.getElementById("bot1Status"),
        action: document.getElementById("bot1Action")
    },
    {
        id: 2,
        name: "Max",
        seat: document.getElementById("bot2"),
        cards: document.getElementById("bot2Cards"),
        status: document.getElementById("bot2Status"),
        action: document.getElementById("bot2Action")
    },
    {
        id: 3,
        name: "Liam",
        seat: document.getElementById("bot3"),
        cards: document.getElementById("bot3Cards"),
        status: document.getElementById("bot3Status"),
        action: document.getElementById("bot3Action")
    },
    {
        id: 4,
        name: "Noah",
        seat: document.getElementById("bot4"),
        cards: document.getElementById("bot4Cards"),
        status: document.getElementById("bot4Status"),
        action: document.getElementById("bot4Action")
    }
];

const BOT_STYLES = [
    "aggressive",
    "careful",
    "balanced",
    "unpredictable"
];

let state = {
    deck: [],
    communityCards: [],
    players: [],
    dealerIndex: 0,
    currentPhase: "preflop",
    handNumber: 0,
    wins: 0,
    humanTurn: false,
    handOver: false,
    gameStarted: false,
    timers: []
};

const SUITS = [
    {
        symbol: "♠",
        name: "Spades",
        color: "black"
    },
    {
        symbol: "♥",
        name: "Hearts",
        color: "red"
    },
    {
        symbol: "♦",
        name: "Diamonds",
        color: "red"
    },
    {
        symbol: "♣",
        name: "Clubs",
        color: "black"
    }
];

const RANKS = [
    {
        value: 2,
        label: "2"
    },
    {
        value: 3,
        label: "3"
    },
    {
        value: 4,
        label: "4"
    },
    {
        value: 5,
        label: "5"
    },
    {
        value: 6,
        label: "6"
    },
    {
        value: 7,
        label: "7"
    },
    {
        value: 8,
        label: "8"
    },
    {
        value: 9,
        label: "9"
    },
    {
        value: 10,
        label: "10"
    },
    {
        value: 11,
        label: "J"
    },
    {
        value: 12,
        label: "Q"
    },
    {
        value: 13,
        label: "K"
    },
    {
        value: 14,
        label: "A"
    }
];

function createDeck() {
    const deck = [];

    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({
                rank: rank.value,
                label: rank.label,
                suit: suit.symbol,
                color: suit.color
            });
        }
    }

    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        const temporary = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temporary;
    }

    return deck;
}

function drawCard() {
    if (state.deck.length === 0) {
        return null;
    }

    return state.deck.pop();
}

function createPlayers() {
    return [
        {
            id: "human",
            name: "YOU",
            human: true,
            hand: [],
            folded: false,
            active: true,
            style: "player"
        },
        {
            id: "bot1",
            name: "Alex",
            human: false,
            hand: [],
            folded: false,
            active: true,
            style: BOT_STYLES[0]
        },
        {
            id: "bot2",
            name: "Max",
            human: false,
            hand: [],
            folded: false,
            active: true,
            style: BOT_STYLES[1]
        },
        {
            id: "bot3",
            name: "Liam",
            human: false,
            hand: [],
            folded: false,
            active: true,
            style: BOT_STYLES[2]
        },
        {
            id: "bot4",
            name: "Noah",
            human: false,
            hand: [],
            folded: false,
            active: true,
            style: BOT_STYLES[3]
        }
    ];
}

function startGame() {
    state.gameStarted = true;
    state.handNumber = 0;
    state.wins = 0;
    state.dealerIndex = 0;

    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    startNewHand();
}

function startNewHand() {
    clearTimers();

    state.handNumber++;
    state.deck = shuffleDeck(createDeck());
    state.communityCards = [];
    state.players = createPlayers();
    state.currentPhase = "preflop";
    state.humanTurn = false;
    state.handOver = false;

    resultPanel.classList.add("hidden");

    handNumberElement.textContent = state.handNumber;
    winCountElement.textContent = state.wins;

    dealHoleCards();

    updateUI();

    wait(650).then(() => {
        if (!state.handOver) {
            runBotRound();
        }
    });
}

function dealHoleCards() {
    for (let round = 0; round < 2; round++) {
        for (const player of state.players) {
            const card = drawCard();

            if (card) {
                player.hand.push(card);
            }
        }
    }
}

function revealFlop() {
    const burnCard = drawCard();

    if (burnCard) {
        // Burn card is discarded.
    }

    for (let i = 0; i < 3; i++) {
        const card = drawCard();

        if (card) {
            state.communityCards.push(card);
        }
    }

    state.currentPhase = "flop";
}

function revealTurn() {
    const burnCard = drawCard();

    if (burnCard) {
        // Burn card is discarded.
    }

    const card = drawCard();

    if (card) {
        state.communityCards.push(card);
    }

    state.currentPhase = "turn";
}

function revealRiver() {
    const burnCard = drawCard();

    if (burnCard) {
        // Burn card is discarded.
    }

    const card = drawCard();

    if (card) {
        state.communityCards.push(card);
    }

    state.currentPhase = "river";
}

function updateUI() {
    renderCommunityCards();
    renderPlayerCards();
    renderBots();
    updatePhaseUI();
}

function updatePhaseUI() {
    const names = {
        preflop: "PRE-FLOP",
        flop: "FLOP",
        turn: "TURN",
        river: "RIVER"
    };

    const phaseName = names[state.currentPhase] || "SHOWDOWN";

    phaseLabel.textContent = phaseName;
    tableStatus.textContent = phaseName;
}

function renderCommunityCards() {
    communityCardsElement.innerHTML = "";

    state.communityCards.forEach((card, index) => {
        const element = createCardElement(card);

        element.style.animationDelay = `${index * 80}ms`;

        communityCardsElement.appendChild(element);
    });
}

function renderPlayerCards(showCards = true) {
    playerCardsElement.innerHTML = "";

    const player = getHumanPlayer();

    if (!player) {
        return;
    }

    player.hand.forEach((card, index) => {
        const element = showCards
            ? createCardElement(card)
            : createHiddenCard();

        element.style.animationDelay = `${index * 100}ms`;

        playerCardsElement.appendChild(element);
    });
}

function renderBots(showCards = false) {
    botElements.forEach((botElement) => {
        const player = state.players.find(
            playerItem => playerItem.id === botElement.id
        );

        if (!player) {
            return;
        }

        botElement.cards.innerHTML = "";

        player.hand.forEach((card, index) => {
            const element = showCards || state.handOver
                ? createCardElement(card)
                : createHiddenCard();

            element.style.animationDelay = `${index * 100}ms`;

            botElement.cards.appendChild(element);
        });

        botElement.status.textContent =
            player.folded ? "Folded" :
            player.active ? "Playing" :
            "Out";

        botElement.seat.classList.toggle("folded", player.folded);
        botElement.action.textContent = player.action || "";

        botElement.seat.classList.remove("active");

        if (player.currentTurn) {
            botElement.seat.classList.add("active");
        }
    });
}

function createCardElement(card) {
    const element = document.createElement("div");

    element.className = `card ${card.color}`;

    element.textContent = `${card.label}${card.suit}`;

    return element;
}

function createHiddenCard() {
    const element = document.createElement("div");

    element.className = "card hidden-card";

    return element;
}

function getHumanPlayer() {
    return state.players.find(player => player.human);
}

function getActivePlayers() {
    return state.players.filter(
        player => !player.folded && player.active
    );
}

function setHumanTurn() {
    const human = getHumanPlayer();

    if (!human || human.folded) {
        return;
    }

    state.humanTurn = true;
    human.currentTurn = true;

    human.action = "Your turn";

    checkButton.disabled = false;
    foldButton.disabled = false;

    turnText.textContent = "YOUR TURN";
    gameMessage.textContent = "Choose CHECK to continue or FOLD to leave the hand.";
    handMessage.textContent = "Your turn";

    document.getElementById("playerStatus").textContent = "Your Turn";

    updateUI();
}

function disableHumanControls() {
    state.humanTurn = false;

    checkButton.disabled = true;
    foldButton.disabled = true;

    const human = getHumanPlayer();

    if (human) {
        human.currentTurn = false;
    }
}

function playerCheck() {
    if (!state.humanTurn || state.handOver) {
        return;
    }

    const human = getHumanPlayer();

    if (!human) {
        return;
    }

    human.currentTurn = false;
    human.action = "Checked";

    disableHumanControls();

    turnText.textContent = "BOTS ARE PLAYING";
    gameMessage.textContent = "The bots are making their decisions...";

    updateUI();

    wait(500).then(() => {
        continueAfterHumanAction();
    });
}

function playerFold() {
    if (!state.humanTurn || state.handOver) {
        return;
    }

    const human = getHumanPlayer();

    if (!human) {
        return;
    }

    human.folded = true;
    human.currentTurn = false;
    human.action = "Folded";

    disableHumanControls();

    turnText.textContent = "FOLDED";
    gameMessage.textContent = "You folded this hand.";

    updateUI();

    wait(700).then(() => {
        if (!state.handOver) {
            runBotsAfterFold();
        }
    });
}

async function continueAfterHumanAction() {
    await runBotRound();

    if (state.handOver) {
        return;
    }

    advancePhase();
}

async function runBotsAfterFold() {
    await runBotRound();

    if (state.handOver) {
        return;
    }

    advancePhase();
}

async function runBotRound() {
    const bots = state.players.filter(
        player => !player.human && !player.folded && player.active
    );

    for (const bot of bots) {
        if (state.handOver) {
            return;
        }

        bot.currentTurn = true;
        bot.action = "Thinking...";

        updateUI();

        await wait(650 + Math.random() * 600);

        if (state.handOver) {
            return;
        }

        const decision = getBotDecision(bot);

        bot.currentTurn = false;

        if (decision === "fold") {
            bot.folded = true;
            bot.action = "Folded";
        } else {
            bot.action = "Checked";
        }

        updateUI();

        await wait(400);
    }

    const activePlayers = getActivePlayers();

    if (activePlayers.length <= 1) {
        finishHand();
    }
}

function getBotDecision(bot) {
    const cards = [
        ...bot.hand,
        ...state.communityCards
    ];

    const evaluation = evaluateBestHand(cards);

    const score = getBotStrengthScore(evaluation);
    const random = Math.random();

    switch (bot.style) {
        case "aggressive":
            if (score < 30 && random < 0.2) {
                return "fold";
            }

            return "check";

        case "careful":
            if (score < 45 && random < 0.55) {
                return "fold";
            }

            return "check";

        case "unpredictable":
            if (random < 0.22) {
                return "fold";
            }

            return "check";

        default:
            if (score < 25 && random < 0.3) {
                return "fold";
            }

            return "check";
    }
}

function getBotStrengthScore(evaluation) {
    if (!evaluation) {
        return 0;
    }

    const categoryScore = evaluation.rank * 12;
    const highCardScore = evaluation.tiebreakers.reduce(
        (total, value, index) => total + value / Math.pow(15, index + 1),
        0
    );

    return categoryScore + highCardScore;
}

async function advancePhase() {
    if (state.handOver) {
        return;
    }

    const activePlayers = getActivePlayers();

    if (activePlayers.length <= 1) {
        finishHand();
        return;
    }

    switch (state.currentPhase) {
        case "preflop":
            revealFlop();
            break;

        case "flop":
            revealTurn();
            break;

        case "turn":
            revealRiver();
            break;

        case "river":
            finishHand();
            return;

        default:
            finishHand();
            return;
    }

    updateUI();

    handMessage.textContent =
        state.currentPhase === "flop"
            ? "The flop is on the table."
            : state.currentPhase === "turn"
                ? "The turn card has been revealed."
                : "The river has been revealed.";

    await wait(700);

    if (!state.handOver) {
        prepareHumanTurn();
    }
}

function prepareHumanTurn() {
    const human = getHumanPlayer();

    if (!human || human.folded) {
        runBotRound().then(() => {
            if (!state.handOver) {
                advancePhase();
            }
        });

        return;
    }

    setHumanTurn();
}

function finishHand() {
    if (state.handOver) {
        return;
    }

    state.handOver = true;
    state.humanTurn = false;

    disableHumanControls();

    const activePlayers = getActivePlayers();

    if (activePlayers.length === 0) {
        showResult([]);
        return;
    }

    const evaluations = activePlayers.map(player => ({
        player,
        evaluation: evaluateBestHand([
            ...player.hand,
            ...state.communityCards
        ])
    }));

    const winners = determineWinners(evaluations);

    if (winners.length === 1 && winners[0].player.human) {
        state.wins++;
    }

    renderShowdown(evaluations, winners);

    updateUI();

    showResult(winners);
}

function determineWinners(evaluations) {
    if (evaluations.length === 0) {
        return [];
    }

    let winners = [evaluations[0]];

    for (let i = 1; i < evaluations.length; i++) {
        const comparison = compareEvaluations(
            evaluations[i].evaluation,
            winners[0].evaluation
        );

        if (comparison > 0) {
            winners = [evaluations[i]];
        } else if (comparison === 0) {
            winners.push(evaluations[i]);
        }
    }

    return winners;
}

function compareEvaluations(a, b) {
    if (a.rank !== b.rank) {
        return a.rank - b.rank;
    }

    const maxLength = Math.max(
        a.tiebreakers.length,
        b.tiebreakers.length
    );

    for (let i = 0; i < maxLength; i++) {
        const av = a.tiebreakers[i] || 0;
        const bv = b.tiebreakers[i] || 0;

        if (av !== bv) {
            return av - bv;
        }
    }

    return 0;
}

/*
    HAND RANKS

    10 = Royal Flush
    9  = Straight Flush
    8  = Four of a Kind
    7  = Full House
    6  = Flush
    5  = Straight
    4  = Three of a Kind
    3  = Two Pair
    2  = Pair
    1  = High Card
*/

function evaluateBestHand(cards) {
    if (!cards || cards.length < 5) {
        return null;
    }

    const combinations = getFiveCardCombinations(cards);
    let best = null;

    for (const combination of combinations) {
        const evaluation = evaluateFiveCards(combination);

        if (!best || compareEvaluations(evaluation, best) > 0) {
            best = evaluation;
        }
    }

    return best;
}

function getFiveCardCombinations(cards) {
    const result = [];

    for (let a = 0; a < cards.length - 4; a++) {
        for (let b = a + 1; b < cards.length - 3; b++) {
            for (let c = b + 1; c < cards.length - 2; c++) {
                for (let d = c + 1; d < cards.length - 1; d++) {
                    for (let e = d + 1; e < cards.length; e++) {
                        result.push([
                            cards[a],
                            cards[b],
                            cards[c],
                            cards[d],
                            cards[e]
                        ]);
                    }
                }
            }
        }
    }

    return result;
}

function evaluateFiveCards(cards) {
    const ranks = cards
        .map(card => card.rank)
        .sort((a, b) => b - a);

    const flush = cards.every(
        card => card.suit === cards[0].suit
    );

    const straightHigh = getStraightHigh(ranks);

    const counts = {};

    for (const rank of ranks) {
        counts[rank] = (counts[rank] || 0) + 1;
    }

    const groups = Object.entries(counts)
        .map(([rank, count]) => ({
            rank: Number(rank),
            count
        }))
        .sort((a, b) => {
            if (a.count !== b.count) {
                return b.count - a.count;
            }

            return b.rank - a.rank;
        });

    if (flush && straightHigh === 14) {
        return {
            rank: 10,
            name: "Royal Flush",
            tiebreakers: [14],
            cards
        };
    }

    if (flush && straightHigh) {
        return {
            rank: 9,
            name: "Straight Flush",
            tiebreakers: [straightHigh],
            cards
        };
    }

    const four = groups.find(group => group.count === 4);

    if (four) {
        const kicker = groups
            .filter(group => group.count !== 4)
            .map(group => group.rank)[0];

        return {
            rank: 8,
            name: "Four of a Kind",
            tiebreakers: [four.rank, kicker],
            cards
        };
    }

    const triple = groups.find(group => group.count === 3);
    const pairs = groups
        .filter(group => group.count === 2)
        .map(group => group.rank)
        .sort((a, b) => b - a);

    if (triple && pairs.length >= 1) {
        return {
            rank: 7,
            name: "Full House",
            tiebreakers: [triple.rank, pairs[0]],
            cards
        };
    }

    if (flush) {
        return {
            rank: 6,
            name: "Flush",
            tiebreakers: ranks,
            cards
        };
    }

    if (straightHigh) {
        return {
            rank: 5,
            name: "Straight",
            tiebreakers: [straightHigh],
            cards
        };
    }

    if (triple) {
        const kickers = ranks
            .filter(rank => rank !== triple.rank)
            .slice(0, 2);

        return {
            rank: 4,
            name: "Three of a Kind",
            tiebreakers: [
                triple.rank,
                ...kickers
            ],
            cards
        };
    }

    if (pairs.length >= 2) {
        const highPair = pairs[0];
        const lowPair = pairs[1];

        const kicker = ranks.find(
            rank => rank !== highPair && rank !== lowPair
        );

        return {
            rank: 3,
            name: "Two Pair",
            tiebreakers: [
                highPair,
                lowPair,
                kicker
            ],
            cards
        };
    }

    if (pairs.length === 1) {
        const pair = pairs[0];

        const kickers = ranks
            .filter(rank => rank !== pair)
            .slice(0, 3);

        return {
            rank: 2,
            name: "One Pair",
            tiebreakers: [
                pair,
                ...kickers
            ],
            cards
        };
    }

    return {
        rank: 1,
        name: "High Card",
        tiebreakers: ranks,
        cards
    };
}

function getStraightHigh(ranks) {
    const uniqueRanks = [...new Set(ranks)];

    if (uniqueRanks.includes(14)) {
        uniqueRanks.push(1);
    }

    uniqueRanks.sort((a, b) => b - a);

    for (let i = 0; i <= uniqueRanks.length - 5; i++) {
        const first = uniqueRanks[i];

        let isStraight = true;

        for (let j = 1; j < 5; j++) {
            if (uniqueRanks[i + j] !== first - j) {
                isStraight = false;
                break;
            }
        }

        if (isStraight) {
            return first === 1 ? 5 : first;
        }
    }

    return null;
}

function getHandCardsForDisplay(evaluation) {
    if (!evaluation) {
        return [];
    }

    return evaluation.cards || [];
}

function renderShowdown(evaluations, winners) {
    renderPlayerCards(true);

    botElements.forEach(botElement => {
        const player = state.players.find(
            playerItem => playerItem.id === botElement.id
        );

        if (!player) {
            return;
        }

        botElement.cards.innerHTML = "";

        player.hand.forEach(card => {
            botElement.cards.appendChild(
                createCardElement(card)
            );
        });
    });

    const winnerIds = new Set(
        winners.map(item => item.player.id)
    );

    evaluations.forEach(item => {
        const player = item.player;
        const evaluation = item.evaluation;

        const row = document.createElement("div");

        row.className =
            "result-hand" +
            (winnerIds.has(player.id) ? " winner" : "");

        const playerName = document.createElement("div");
        playerName.className = "result-player";
        playerName.textContent = player.name;

        const ranking = document.createElement("div");
        ranking.className = "result-ranking";
        ranking.textContent = evaluation.name;

        row.appendChild(playerName);
        row.appendChild(ranking);

        resultHands.appendChild(row);
    });

    const winnerNames = winners
        .map(item => item.player.name)
        .join(" & ");

    if (winners.length === 1) {
        winnerText.textContent =
            `${winnerNames} wins with ${winners[0].evaluation.name}`;
    } else {
        winnerText.textContent =
            `${winnerNames} tie with ${winners[0].evaluation.name}`;
    }

    turnText.textContent = "SHOWDOWN";
    gameMessage.textContent = "The hand is complete.";
}

function showResult(winners) {
    resultHands.innerHTML = "";

    const activePlayers = state.players.filter(
        player => !player.folded
    );

    if (activePlayers.length === 1 && activePlayers[0].human) {
        resultTitle.textContent = "YOU WIN";
    } else if (winners.some(item => item.player.human)) {
        resultTitle.textContent = "YOU WIN";
    } else {
        resultTitle.textContent = "SHOWDOWN";
    }

    const evaluations = activePlayers.map(player => ({
        player,
        evaluation: evaluateBestHand([
            ...player.hand,
            ...state.communityCards
        ])
    }));

    const winnerIds = new Set(
        winners.map(item => item.player.id)
    );

    evaluations.forEach(item => {
        const row = document.createElement("div");

        row.className =
            "result-hand" +
            (winnerIds.has(item.player.id) ? " winner" : "");

        const playerName = document.createElement("div");
        playerName.className = "result-player";
        playerName.textContent = item.player.name;

        const ranking = document.createElement("div");
        ranking.className = "result-ranking";
        ranking.textContent = item.evaluation
            ? item.evaluation.name
            : "No hand";

        row.appendChild(playerName);
        row.appendChild(ranking);

        resultHands.appendChild(row);
    });

    if (winners.length > 0) {
        const names = winners
            .map(item => item.player.name)
            .join(" & ");

        winnerText.textContent =
            winners.length === 1
                ? `${names} wins with ${winners[0].evaluation.name}`
                : `${names} tie with ${winners[0].evaluation.name}`;
    } else {
        winnerText.textContent = "No winner.";
    }

    resultPanel.classList.remove("hidden");

    handNumberElement.textContent = state.handNumber;
    winCountElement.textContent = state.wins;
}

function clearTimers() {
    state.timers.forEach(timer => {
        clearTimeout(timer);
    });

    state.timers = [];
}

function wait(milliseconds) {
    return new Promise(resolve => {
        const timer = setTimeout(resolve, milliseconds);

        state.timers.push(timer);
    });
}

startButton.addEventListener("click", startGame);

checkButton.addEventListener("click", playerCheck);

foldButton.addEventListener("click", playerFold);

nextHandButton.addEventListener("click", () => {
    resultPanel.classList.add("hidden");
    startNewHand();
});

/*
    Initialer Zustand.
*/
checkButton.disabled = true;
foldButton.disabled = true;

gameMessage.textContent = "Start the game to begin.";
handMessage.textContent = "Waiting for game...";