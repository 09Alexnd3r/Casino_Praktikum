function botDecision(bot) {

    if (bot.folded) {
        return "Fold";
    }

    if (bot.chips <= 0) {
        return "Fold";
    }

    const strength = evaluate(bot);

    // Straight Flush, Vierling
    if (strength >= 800) {
        return "Raise";
    }

    // Full House, Flush
    if (strength >= 600) {

        if (Math.random() < 0.7) {
            return "Raise";
        }

        return "Call";
    }

    // Straight, Trips, Two Pair
    if (strength >= 300) {

        if (Math.random() < 0.5) {
            return "Call";
        }

        return "Raise";
    }

    // One Pair
    if (strength >= 200) {
        return "Call";
    }

    // Schlechte Hand
    const random = Math.random();

    if (random < 0.30) {
        return "Fold";
    }

    if (random < 0.80) {
        return "Call";
    }

    return "Check";
}

function runBots(callback) {

    const bots = getBots();

    let delay = 1000;

    bots.forEach((bot, index) => {

        setTimeout(() => {

            if (bot.folded) {

                render();

                if (
                    index === bots.length - 1 &&
                    callback
                ) {
                    callback();
                }

                return;
            }

            const action =
                botDecision(bot);

            bot.action = action;

            document.getElementById(
                "message"
            ).textContent =
                bot.name +
                " " +
                action;

            if (action === "Fold") {

                bot.folded = true;

            }

            if (action === "Call") {

                const needed =
                    state.currentBet -
                    bot.currentBet;

                const call =
                    Math.min(
                        needed,
                        bot.chips
                    );

                bot.chips -= call;

                bot.currentBet += call;

                state.pot += call;

            }

            if (action === "Raise") {

                const targetBet =
                    state.currentBet + 20;

                const needed =
                    targetBet -
                    bot.currentBet;

                const amount =
                    Math.min(
                        needed,
                        bot.chips
                    );

                bot.chips -= amount;

                bot.currentBet += amount;

                state.currentBet =
                    targetBet;

                state.pot += amount;

            }

            render();

            if (
                index === bots.length - 1 &&
                callback
            ) {
                callback();
            }

        }, delay);

        delay += 1200;

    });

}