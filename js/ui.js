function renderCard(card) {

    return `
    <div class="card">
        ${card.rank}${card.suit}
    </div>
    `;

}

function hiddenCard() {

    return `
    <div class="card back"></div>
    `;

}

function updatePot() {

    document.getElementById("pot").textContent =
        "Pot: " + state.pot;

    const centerPot =
        document.getElementById("potCenter");

    if (centerPot) {

        centerPot.textContent =
            "Pot: " + state.pot;

    }

}

function renderPlayer() {

    const player = getHumanPlayer();

    document.getElementById(
        "playerCards"
    ).innerHTML =
    player.hand
        .map(renderCard)
        .join("");

    document.getElementById(
        "playerChips"
    ).textContent =
    getHumanPlayer().chips;

}

function renderCommunity() {

    document.getElementById(
        "community"
    ).innerHTML =
    state.community
        .map(renderCard)
        .join("");

}

function renderBots() {

    const bots =
        document.getElementById("bots");

    bots.innerHTML = "";

    const positions = [
        "top",
        "left",
        "right",
        "bottomLeft"
    ];

    getBots().forEach((bot, index) => {

        bots.innerHTML += `
        <div class="bot ${positions[index]} ${
            bot.folded ? "folded" : ""
        }">

        ${
        state.showdown

        ?

        bot.hand
        .map(renderCard)
        .join("")

        :

        `
        <div class="card back"></div>
        <div class="card back"></div>
        `
        }

            <h3>${bot.name}
            ${state.dealer === index + 1 ? " (D)" : ""}
            </h3>

            <div>
                Chips: ${bot.currentBet}
            </div>

            <div>
                ${bot.action || "Waiting"}
            </div>

        </div>
        `;

    });

}
function renderDealer() {

    const dealer =
        document.getElementById(
            "dealerButton"
        );

    const positions = [
        {
            left: "50%",
            top: "80%"
        },
        {
            left: "50%",
            top: "10%"
        },
        {
            left: "10%",
            top: "40%"
        },
        {
            left: "90%",
            top: "40%"
        },
        {
            left: "20%",
            top: "75%"
        }
    ];

    const pos =
        positions[
            state.dealer %
            positions.length
        ];

    dealer.style.left = pos.left;
    dealer.style.top = pos.top;

}

function render() {

    renderPlayer();

    renderCommunity();

    renderBots();

    renderDealer();

    updatePot();

    updateCurrentBet();

}
function updateCurrentBet(){

    const bet =
    document.getElementById(
        "currentBet"
    );

    if(bet){

        bet.textContent =
        "Bet: " +
        state.currentBet;

    }

}