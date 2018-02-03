(function () {
    'use strict';

    let user1 = createUser('Петр'),
        user2 = createUser('Василий'),
        playingCardsArray = fillPlayingCardsArray(),
        currentTrump;

    getCards();


    function createUser(name) {
        return {
            name,
            currentCardsArray: [],
            currentCard: {},
            score: 0
        };
    }

    function fillPlayingCardsArray() {
        let symbolArray = ['1', '6', '7', '8', '9', 'A', 'B', 'D', 'E'],
            suitArray1 = new Array(9),
            suitArray2 = new Array(9),
            suitArray3 = new Array(9),
            suitArray4 = new Array(9);

        function fillArray(suitArray, suit) {

            function createCard(card, index) {
                let suitWord;
                switch (suit) {
                    case 'A':
                        suitWord = 'Spades';
                        break;
                    case 'B':
                        suitWord = 'Hearts';
                        break;
                    case 'C':
                        suitWord = 'Diamonds';
                        break;
                    case 'D':
                        suitWord = 'Clubs';
                        break;
                }

                return {
                    suitCodeChar: suit,
                    suitCodeWord: suitWord,
                    symbolCode: symbolArray[index],
                    cardName: `0x1F0${suit}${symbolArray[index]}`,
                    isTrump: function () {
                        return this.suitCodeWord === currentTrump ? 1 : 0;
                    },
                    isCost: function () {
                        if (this.isTrump) {
                            if (this.symbolCode === '1') {
                                return parseInt(this.symbolCode, 16) + 20 + 100;
                            }
                            else if (this.symbolCode !== '1') {
                                return parseInt(this.symbolCode, 16) + 100;
                            }
                        } else {
                            if (this.symbolCode === '1') {
                                return parseInt(this.symbolCode, 16) + 20;
                            }
                            else if (this.symbolCode !== '1') {
                                return parseInt(this.symbolCode, 16);
                            }
                        }
                    }
                }
            }

            return suitArray.fill(suit).map(createCard);
        }

        return fillArray(suitArray1, 'A').concat(fillArray(suitArray2, 'B')).concat(fillArray(suitArray3, 'C')).concat(fillArray(suitArray4, 'D'));
    }

    function getTrump(result) {
        let trump;
        switch (result) {
            case 1:
                trump = 'Spades';
                break;
            case 2:
                trump = 'Hearts';
                break;
            case 3:
                trump = 'Diamonds';
                break;
            case 4:
                trump = 'Clubs';
                break;
        }
        return trump;
    }


    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    function getWinnerCard(card1, card2) {
        if ((card1.isTrump() && card2.isTrump()) || (!card1.isTrump() && !card2.isTrump())) {
            if (card1.isCost() === card2.isCost()) {
                return 0;
            } else {
                return card1.isCost() > card2.isCost() ? 1 : 2;
            }
        } else {
            return card1.isTrump() ? 1 : 2;
        }
    }

    function compareRandom(a, b) {
        return Math.random() - 0.5;
    }

    function getCards() {
        playingCardsArray.sort(compareRandom);
        user1.currentCardsArray = playingCardsArray.splice(0, 18);
        user2.currentCardsArray = playingCardsArray;
    }

    document.body.addEventListener('click', function (event) {
        let fragment = document.createDocumentFragment(),
            winnerTrumpDiv = document.createElement('div'),
            winnerSpan = document.createElement('span'),
            trumpSpan = document.createElement('span'),
            scoreDiv = document.createElement('div'),
            table = document.createElement('table'),
            continueDiv = document.createElement('div'),
            playButton = document.getElementById('play');
        winnerTrumpDiv.id = 'winnerTrumpDiv';
        winnerSpan.id = 'winnerSpan';
        trumpSpan.id = 'trumpSpan';
        scoreDiv.id = 'scoreDiv';
        table.id = 'table';

        if (event.target === playButton) {
            let userNamesTr = document.createElement('tr'),
                userName1Td = document.createElement('td'),
                userName2Td = document.createElement('td'),
                randomResult = getRandomInteger(1, 4);
            currentTrump = getTrump(randomResult, playingCardsArray);

            let chosenSuit = document.getElementById(currentTrump.toLowerCase());
            chosenSuit.classList.add('chosenSuit');
            playButton.remove();

            fragment.appendChild(winnerTrumpDiv);
            winnerTrumpDiv.appendChild(winnerSpan);
            winnerTrumpDiv.appendChild(trumpSpan);
            fragment.appendChild(scoreDiv);
            fragment.appendChild(table);
            table.appendChild(userNamesTr);
            userNamesTr.appendChild(userName1Td);
            userNamesTr.appendChild(userName2Td);
            fragment.appendChild(continueDiv);
            trumpSpan.textContent = "Trump: " + currentTrump;
            userNamesTr.classList.add('rows');
            userName1Td.classList.add('td-name');
            userName2Td.classList.add('td-name');
            userName1Td.textContent = `${user1.name}`;
            userName2Td.textContent = `${user2.name}`;
            continueDiv.id = 'continueDiv';
            continueDiv.textContent = 'Click to continue!';

            document.body.appendChild(fragment);
        }

        if (event.target !== playButton && document.getElementById('table'))
        {if (user1.currentCardsArray.length >= 1) {
            let table = document.getElementById('table'),
                row = document.createElement('tr'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td');
            table.appendChild(row);
            row.classList.add('row');
            row.appendChild(td1);
            row.appendChild(td2);
            td1.classList.add('td');
            td2.classList.add('td');
            user1.currentCard = user1.currentCardsArray.pop();
            user2.currentCard = user2.currentCardsArray.pop();
            td1.textContent = String.fromCodePoint(user1.currentCard.cardName);
            td2.textContent = String.fromCodePoint(user2.currentCard.cardName);

            if (user1.currentCard.suitCodeChar === 'B' || user1.currentCard.suitCodeChar === 'C') {
                td1.classList.add('red');
            }

            if (user2.currentCard.suitCodeChar === 'B' || user2.currentCard.suitCodeChar === 'C') {
                td2.classList.add('red');
            }

            if (getWinnerCard(user1.currentCard, user2.currentCard) === 1) {
                user1.score = user1.score + 1;
            } else if (getWinnerCard(user1.currentCard, user2.currentCard) === 2) {
                user2.score = user2.score + 1;
            }

        } else {

            let winnerSpan = document.getElementById('winnerSpan'),
                scoreDiv = document.getElementById('scoreDiv'),
                continueDiv = document.getElementById('continueDiv');
            if (continueDiv) {
                continueDiv.remove();
            }

            if (user1.score > user2.score) {
                winnerSpan.textContent = `Winner: ${user1.name}`;
            }
            else {
                winnerSpan.textContent = `Winner: ${user2.name}`;
            }
            scoreDiv.textContent = `${user1.score} : ${user2.score}`;
        }
    }})
}());