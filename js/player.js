class Player {

    constructor(name, isHuman = false) {

        this.name = name;
        this.isHuman = isHuman;

        this.chips = 1000;

        this.hand = [];

        this.currentBet = 0;

        this.folded = false;

        this.allIn = false;

        this.action = "Waiting";
    }

}