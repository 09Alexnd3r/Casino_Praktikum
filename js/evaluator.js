const values = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
};

function evaluate(player) {

    const cards = [
        ...player.hand,
        ...state.community
    ];

    const ranks =
        cards.map(
            card => values[card.rank]
        );

    const suits =
        cards.map(
            card => card.suit
        );

    const counts = {};

    ranks.forEach(rank => {

        counts[rank] =
            (counts[rank] || 0) + 1;

    });

    const occurrences =
        Object.values(counts);

    const isFlush =
        suits.some(
            suit =>
                suits.filter(
                    s => s === suit
                ).length >= 5
        );

    const sorted =
        [...new Set(ranks)]
        .sort((a, b) => a - b);

    let isStraight = false;

    for (
        let i = 0;
        i < sorted.length - 4;
        i++
    ) {

        if (

            sorted[i + 4] -
            sorted[i] === 4

        ) {

            isStraight = true;

        }

    }

    if (isStraight && isFlush)
        return 900;

    if (occurrences.includes(4))
        return 800;

    if (
        occurrences.includes(3) &&
        occurrences.includes(2)
    )
        return 700;

    if (isFlush)
        return 600;

    if (isStraight)
        return 500;

    if (occurrences.includes(3))
        return 400;

    const pairCount =
        occurrences.filter(
            v => v === 2
        ).length;

    if (pairCount >= 2)
        return 300;

    if (pairCount === 1)
        return 200;

    return 100 + Math.max(...ranks);

}
function getHandName(score){

    if(score >= 900)
        return "Straight Flush";

    if(score >= 800)
        return "Four of a Kind";

    if(score >= 700)
        return "Full House";

    if(score >= 600)
        return "Flush";

    if(score >= 500)
        return "Straight";

    if(score >= 400)
        return "Three of a Kind";

    if(score >= 300)
        return "Two Pair";

    if(score >= 200)
        return "One Pair";

    return "High Card";

}