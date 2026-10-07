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
        "seat1",
        "seat2",
        "seat3",
        "seat4"
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
        <div class="cards">
            <div class="card back"></div>
            <div class="card back"></div>
        </div>
        `
        }

            <h3>${bot.name}
            ${state.dealer === index + 1 ? " (D)" : ""}
            </h3>

            <div>
                Chips: ${bot.chips}
            </div>
            <div>
                Bet: ${bot.currentBet}
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
            left:"55%",
            top:"12%"
        },

        {
            left:"18%",
            top:"32%"
        },

        {
            left:"82%",
            top:"32%"
        },

        {
            left:"30%",
            top:"70%"
        },

        {
            left:"56%",
            top:"78%"
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