const state = {

    smallBlind: 10,

    bigBlind: 20,

    deck: [],

    community: [],

    pot: 0,

    phase: "preflop",

    currentBet: 20,

    dealer: 1,

    players: [

        new Player("YOU", true),

        new Player("Alex"),

        new Player("Max"),

        new Player("Liam"),

        new Player("Noah")

    ],

    showdown:false,

};

function start() {

    state.deck = shuffle(createDeck());

    state.community = [];

    state.pot = 0;

    state.phase = "preflop";

    state.showdown = false;

    document.getElementById(
        "phase"
    ).textContent =
    "PRE-FLOP";

    state.players.forEach(player => {

        player.hand = [];

        player.currentBet = 0;
        
        player.action = "Waiting";

        player.folded = false;

        player.allIn = false;

        player.action = "Waiting";

    });

    postBlinds();

    deal();

    render();

}

function deal() {

    state.players.forEach(player => {

        player.hand.push(draw());

        player.hand.push(draw());

    });

}

function nextRound() {

    runBots(() => {

        if (state.community.length === 0) {

            state.phase = "flop";
            document.getElementById("phase").textContent =
            "FLOP";

            state.community.push(draw());
            state.community.push(draw());
            state.community.push(draw());

        }

        else if (state.community.length === 3) {

            state.phase = "turn";
            document.getElementById("phase").textContent =
            "TURN";

            state.community.push(draw());

        }

        else if (state.community.length === 4) {

            state.phase = "river";
            document.getElementById("phase").textContent =
            "RIVER";

            state.community.push(draw());

        }

        else {

            showWinner();

            return;
        }

        render();

    });

}

function showWinner() {

    const players =
        state.players.filter(
            player => !player.folded
        );

    let winner = players[0];

    players.forEach(player => {

        if (
            evaluate(player) >
            evaluate(winner)
        ) {

            winner = player;

        }

    });

    state.showdown = true;

    const wonPot = state.pot;

    winner.chips += wonPot;

    document.getElementById(
        "message"
    ).textContent =
        winner.name +
        " gewinnt " +
        wonPot +
        " Chips!";

    render();

    renderDealer();

    state.currentBet = 20;

    removeBrokePlayers();

    if (
        state.players.length === 1
    ) {

        document.getElementById(
            "message"
        ).textContent =
            state.players[0].name +
            " gewinnt das Turnier!";

        return;

    }

    setTimeout(() => {

        state.pot = 0;

        start();

    }, 3000);

}

document
.getElementById("checkBtn")
.onclick=nextRound;

document
.getElementById("callBtn")
.onclick = playerCall;

document
.getElementById("betBtn")
.onclick=playerBet;

document
.getElementById("raiseBtn")
.onclick=playerRaise;

document
.getElementById("foldBtn")
.onclick = () => {

    getHumanPlayer().folded = true;

    document.getElementById(
        "message"
    ).textContent =
        "Du hast gefoldet.";

    nextRound();

};

document
.getElementById("allInBtn")
.onclick=playerAllIn;

start();
function getHumanPlayer() {

    return state.players.find(
        player => player.isHuman
    );

}
function getBots() {

    return state.players.filter(
        player => !player.isHuman
    );

}
function postBlinds() {

    const sb =
        state.players[
            (state.dealer + 1)
            % state.players.length
        ];

    const bb =
        state.players[
            (state.dealer + 2)
            % state.players.length
        ];

    sb.chips = Math.max(
        0,
        sb.chips - state.smallBlind
    );

    bb.chips = Math.max(
        0,
        bb.chips - state.bigBlind
    );

    sb.currentBet =
        state.smallBlind;

    bb.currentBet =
        state.bigBlind;

    state.currentBet =
        state.bigBlind;

    state.pot +=
        state.smallBlind +
        state.bigBlind;

}
function removeBrokePlayers(){

    state.players =
    state.players.filter(
        player =>
        player.chips > 0
    );

}