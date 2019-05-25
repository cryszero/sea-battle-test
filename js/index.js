class Board {
    constructor() {
        this.fields = [];

        for (var i = 0; i < 10; i++) {
            this.fields[i] = [];
            for (var j = 0; j < 10; j++) {
                this.fields[i][j] = 0;
            }
        }
    }

    placeShip(length = 1) {
        const orientation = Math.floor((Math.random() * 10)) % 2 === 0 ? 'vertical' : 'horizontal';
        const position = this.getStartingPosition();
        const isEnoughSpace = this.checkForFreeSpace({ orientation, position, length });

        if (isEnoughSpace) {
            this.fillShipFields({ position, orientation, length });
            this.fillReservedFields({ position, orientation, length });
            return this.getTotalShipPosition({ position, orientation, length });
        }

        else {
            return this.placeShip(length);
        }
    }

    getTotalShipPosition({ position, orientation, length }) {
        let endX = position.x,
            endY = position.y;
        if (orientation === 'vertical') {
            endY = position.y + length;
        }

        else {
            endX = position.x + length;
        }

        return { startX: position.x, startY: position.y, endX, endY }
    }

    getStartingPosition() {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);

        return { x, y };
    }

    checkForFreeSpace({ position, orientation, length }) {
        if (orientation === 'vertical') {
            if (position.y + length > 9) {
                return false;
            }

            const x = position.x;

            for (let y = position.y; y < position.y + length; y++) {
                if (this.fields[x][y] !== 0) {
                    return false;
                }
            }
        }

        else {
            if (position.x + length > 10) {
                return false;
            }

            const y = position.y;

            for (let x = position.x; x < position.x + length; x++) {
                if (this.fields[x][y] !== 0) {
                    return false;
                }
            }
        }

        return true;
    }

    fillShipFields({ position, orientation, length }) {
        if (orientation === 'vertical') {
            const x = position.x;

            for (let y = position.y; y < position.y + length; y++) {
                this.fields[x][y] = 's';
            }
        }

        else {
            const y = position.y;

            for (let x = position.x; x < position.x + length; x++) {
                this.fields[x][y] = 's';
            }
        }
    }

    fillReservedFields({ position, orientation, length }) {
        const startX = position.x - 1 > -1
            ? position.x - 1
            : 0;
        const startY = position.y - 1 > -1
            ? position.y - 1
            : 0;

        let endX, endY;

        if (orientation === 'vertical') {
            endX = position.x + 1 < 10
                ? position.x + 1
                : 9;
            endY = position.y + length < 10
                ? position.y + length
                : 9;
        }

        else {
            endX = position.x + length < 10
                ? position.x + length
                : 9;
            endY = position.y + 1 < 10
                ? position.y + 1
                : 9;
        }

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (this.fields[x][y] === 0) {
                    this.fields[x][y] = 'r';
                }
            }
        }

    }

}

class Game {
    constructor() {
        const app = $('#app');
        const shipTypes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

        this.board = new Board();
        this.ships = shipTypes.map(type => this.board.placeShip(type));
        this.misses = 0;
        this.hits = 0;
        this.totalShipFields = shipTypes.reduce((type, acc) => type + acc, 0);

        this.board.fields.forEach((row, rowId) => {
            const fields = row.map((field, fieldId) =>
                `<button class="cell" data-x="${rowId}" data-y="${fieldId}" data-value="${field}"></button>`)
                .join('');
            app.append(`<div class="row">${fields}</div>`);
        });
    }

    hitShip(field) {
        const fieldX = field.data('x'),
            fieldY = field.data('y');
        field.addClass('cell--hit');
        field.attr('disabled', true);
        this.hits += 1;

        if (this.checkForShipDeath({ fieldX, fieldY })) {}
    }

    checkForShipDeath({ fieldX, fieldY }) {
        const ship = this.ships.filter(ship => {
            return (
                fieldX >= ship.startX
                    && fieldX <= ship.endX
                    && fieldY >= ship.startY
                    && fieldY <= ship.endY
            );
        })[0];

        const shipFields = this.getShipFields(ship);
        const isShipDead = shipFields.not('.cell--hit').length <= 0;

        if (isShipDead) {
            this.paintDeathSymbols(shipFields);
        }

        this.checkForVictory();
    }

    paintDeathSymbols(fields) {
        fields.addClass('cell--dead');
    }

    getShipFields(ship) {
        let fields = [];

        if (ship.startX === ship.endX) {
            fields = $('.cell').filter(function() {
                const self = $(this);
                const x = parseInt(self.data('x'));
                const y = parseInt(self.data('y'));

                return (
                    x === ship.startX
                        && y >= ship.startY
                        && y < ship.endY
                );
            });
        }

        else {
            fields = $('.cell').filter(function() {
                const self = $(this);
                const x = parseInt(self.data('x'));
                const y = parseInt(self.data('y'));

                return (
                    y === ship.startY
                        && x >= ship.startX
                        && x < ship.endX
                );
            });
        }

        return fields;
    }

    missShip(field) {
        field.addClass('cell--miss');
        field.attr('disabled', true);
        this.misses += 1;
    }

    checkForVictory() {
        if (this.hits === this.totalShipFields) {
            this.endGame();
        }
    }

    endGame() {
        alert(`You have won! \n Misses: ${this.misses} \n Total hits: ${this.hits + this.misses}`);
        window.location.reload();
    }
}

const game = new Game();

$('.cell').click(function(e) {
    const button = $(this);

    if (button.data('value') === 's') {
        game.hitShip(button);
    }
    else {
        game.missShip(button);
    }
});