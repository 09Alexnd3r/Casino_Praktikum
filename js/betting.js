function addToPot(player, amount) {

    amount = Number(amount);

    if (isNaN(amount) || amount <= 0) {
        return;
    }

    if (amount > player.chips) {
        amount = player.chips;
    }

    player.chips -= amount;

    player.currentBet += amount;

    state.pot += amount;

    render();
}

function playerCall() {

    addToPot(
        getHumanPlayer(),
        state.currentBet
    );

    document.getElementById(
        "message"
    ).textContent =
    "Du hast gecallt.";

    nextRound();
}

function playerBet() {

    const amount =
    Number(
        document.getElementById(
            "betAmount"
        ).value
    );

    state.currentBet = amount;

    addToPot(
        getHumanPlayer(),
        amount
    );

    document.getElementById(
        "message"
    ).textContent =
    "Du setzt " + amount;

    nextRound();
}

function playerRaise() {

    const amount = Number(
        document.getElementById(
            "betAmount"
        ).value
    );

    state.currentBet = amount;

    addToPot(
        getHumanPlayer(),
        amount
    );

    nextRound();
}


function playerAllIn() {

    const player =
    getHumanPlayer();

    addToPot(
        player,
        player.chips
    );

    player.allIn = true;

    document.getElementById(
        "message"
    ).textContent =
    "ALL IN!";

    nextRound();
}