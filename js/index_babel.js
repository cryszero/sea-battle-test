"use strict";

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Board =
  /*#__PURE__*/
  (function() {
    function Board() {
      _classCallCheck(this, Board);

      this.fields = [];

      for (var i = 0; i < 10; i++) {
        this.fields[i] = [];

        for (var j = 0; j < 10; j++) {
          this.fields[i][j] = 0;
        }
      }
    }

    _createClass(Board, [
      {
        key: "placeShip",
        value: function placeShip() {
          var length =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : 1;
          var orientation =
            Math.floor(Math.random() * 10) % 2 === 0
              ? "vertical"
              : "horizontal";
          var position = this.getStartingPosition();
          var isEnoughSpace = this.checkForFreeSpace({
            orientation: orientation,
            position: position,
            length: length
          });

          if (isEnoughSpace) {
            this.fillShipFields({
              position: position,
              orientation: orientation,
              length: length
            });
            this.fillReservedFields({
              position: position,
              orientation: orientation,
              length: length
            });
            return this.getTotalShipPosition({
              position: position,
              orientation: orientation,
              length: length
            });
          } else {
            return this.placeShip(length);
          }
        }
      },
      {
        key: "getTotalShipPosition",
        value: function getTotalShipPosition(_ref) {
          var position = _ref.position,
            orientation = _ref.orientation,
            length = _ref.length;
          var endX = position.x,
            endY = position.y;

          if (orientation === "vertical") {
            endY = position.y + length;
          } else {
            endX = position.x + length;
          }

          return {
            startX: position.x,
            startY: position.y,
            endX: endX,
            endY: endY
          };
        }
      },
      {
        key: "getStartingPosition",
        value: function getStartingPosition() {
          var x = Math.floor(Math.random() * 10);
          var y = Math.floor(Math.random() * 10);
          return {
            x: x,
            y: y
          };
        }
      },
      {
        key: "checkForFreeSpace",
        value: function checkForFreeSpace(_ref2) {
          var position = _ref2.position,
            orientation = _ref2.orientation,
            length = _ref2.length;

          if (orientation === "vertical") {
            if (position.y + length > 9) {
              return false;
            }

            var x = position.x;

            for (var y = position.y; y < position.y + length; y++) {
              if (this.fields[x][y] !== 0) {
                return false;
              }
            }
          } else {
            if (position.x + length > 10) {
              return false;
            }

            var _y = position.y;

            for (var _x = position.x; _x < position.x + length; _x++) {
              if (this.fields[_x][_y] !== 0) {
                return false;
              }
            }
          }

          return true;
        }
      },
      {
        key: "fillShipFields",
        value: function fillShipFields(_ref3) {
          var position = _ref3.position,
            orientation = _ref3.orientation,
            length = _ref3.length;

          if (orientation === "vertical") {
            var x = position.x;

            for (var y = position.y; y < position.y + length; y++) {
              this.fields[x][y] = "s";
            }
          } else {
            var _y2 = position.y;

            for (var _x2 = position.x; _x2 < position.x + length; _x2++) {
              this.fields[_x2][_y2] = "s";
            }
          }
        }
      },
      {
        key: "fillReservedFields",
        value: function fillReservedFields(_ref4) {
          var position = _ref4.position,
            orientation = _ref4.orientation,
            length = _ref4.length;
          var startX = position.x - 1 > -1 ? position.x - 1 : 0;
          var startY = position.y - 1 > -1 ? position.y - 1 : 0;
          var endX, endY;

          if (orientation === "vertical") {
            endX = position.x + 1 < 10 ? position.x + 1 : 9;
            endY = position.y + length < 10 ? position.y + length : 9;
          } else {
            endX = position.x + length < 10 ? position.x + length : 9;
            endY = position.y + 1 < 10 ? position.y + 1 : 9;
          }

          for (var x = startX; x <= endX; x++) {
            for (var y = startY; y <= endY; y++) {
              if (this.fields[x][y] === 0) {
                this.fields[x][y] = "r";
              }
            }
          }
        }
      }
    ]);

    return Board;
  })();

var Game =
  /*#__PURE__*/
  (function() {
    function Game() {
      var _this = this;

      _classCallCheck(this, Game);

      var app = $("#app");
      var shipTypes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
      this.board = new Board();
      this.ships = shipTypes.map(function(type) {
        return _this.board.placeShip(type);
      });
      this.misses = 0;
      this.hits = 0;
      this.totalShipFields = shipTypes.reduce(function(type, acc) {
        return type + acc;
      }, 0);
      this.board.fields.forEach(function(row, rowId) {
        var fields = row
          .map(function(field, fieldId) {
            return '<button class="cell" data-x="'
              .concat(rowId, '" data-y="')
              .concat(fieldId, '" data-value="')
              .concat(field, '"></button>');
          })
          .join("");
        app.append('<div class="row">'.concat(fields, "</div>"));
      });
    }

    _createClass(Game, [
      {
        key: "hitShip",
        value: function hitShip(field) {
          var fieldX = field.data("x"),
            fieldY = field.data("y");
          field.addClass("cell--hit");
          field.attr("disabled", true);
          this.hits += 1;

          if (
            this.checkForShipDeath({
              fieldX: fieldX,
              fieldY: fieldY
            })
          ) {
          }
        }
      },
      {
        key: "checkForShipDeath",
        value: function checkForShipDeath(_ref5) {
          var fieldX = _ref5.fieldX,
            fieldY = _ref5.fieldY;
          var ship = this.ships.filter(function(ship) {
            return (
              fieldX >= ship.startX &&
              fieldX <= ship.endX &&
              fieldY >= ship.startY &&
              fieldY <= ship.endY
            );
          })[0];
          var shipFields = this.getShipFields(ship);
          var isShipDead = shipFields.not(".cell--hit").length <= 0;

          if (isShipDead) {
            this.paintDeathSymbols(shipFields);
          }

          this.checkForVictory();
        }
      },
      {
        key: "paintDeathSymbols",
        value: function paintDeathSymbols(fields) {
          fields.addClass("cell--dead");
        }
      },
      {
        key: "getShipFields",
        value: function getShipFields(ship) {
          var fields = [];

          if (ship.startX === ship.endX) {
            fields = $(".cell").filter(function() {
              var self = $(this);
              var x = parseInt(self.data("x"));
              var y = parseInt(self.data("y"));
              return x === ship.startX && y >= ship.startY && y < ship.endY;
            });
          } else {
            fields = $(".cell").filter(function() {
              var self = $(this);
              var x = parseInt(self.data("x"));
              var y = parseInt(self.data("y"));
              return y === ship.startY && x >= ship.startX && x < ship.endX;
            });
          }

          return fields;
        }
      },
      {
        key: "missShip",
        value: function missShip(field) {
          field.addClass("cell--miss");
          field.attr("disabled", true);
          this.misses += 1;
        }
      },
      {
        key: "checkForVictory",
        value: function checkForVictory() {
          if (this.hits === this.totalShipFields) {
            this.endGame();
          }
        }
      },
      {
        key: "endGame",
        value: function endGame() {
          alert(
            "You have won! \n Misses: "
              .concat(this.misses, " \n Total hits: ")
              .concat(this.hits + this.misses)
          );
          window.location.reload();
        }
      }
    ]);

    return Game;
  })();

var game = new Game();
$(".cell").click(function(e) {
  var button = $(this);

  if (button.data("value") === "s") {
    game.hitShip(button);
  } else {
    game.missShip(button);
  }
});
