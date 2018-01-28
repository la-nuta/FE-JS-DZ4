(function () {
    'use strict';

    let user1 = createUser('Петр'),
        user2 = createUser('Василий'),
        playingCardsArray = fillPlayingCardsArray(),
        currentTrump;

    createHTMLElements();

    function createUser(name) {
        return {
            name,
            currentCardsArray: [],
            currentCard: {},
            score: 0
        };
    }

    function createHTMLElements() {
        let fragment = document.createDocumentFragment(),
            winnerTrumpDiv = document.createElement('div'),
            winnerSpan = document.createElement('span'),
            trumpSpan = document.createElement('span'),
            scoreDiv = document.createElement('div'),
            table = document.createElement('table'),
            userNamesTr = document.createElement('tr'),
            userName1Td = document.createElement('td'),
            userName2Td = document.createElement('td');

        fragment.appendChild(winnerTrumpDiv);
        winnerTrumpDiv.appendChild(winnerSpan);
        winnerTrumpDiv.appendChild(trumpSpan);
        fragment.appendChild(scoreDiv);
        fragment.appendChild(table);
        table.appendChild(userNamesTr);
        userNamesTr.appendChild(userName1Td);
        userNamesTr.appendChild(userName2Td);
        winnerTrumpDiv.id = 'winnerTrumpDiv';
        winnerSpan.id = 'winnerSpan';
        trumpSpan.id = 'trumpSpan';
        scoreDiv.id = 'scoreDiv';
        table.id = 'table';
        userNamesTr.className = 'rows';
        userName1Td.className = 'td-name';
        userName2Td.className = 'td-name';
        userName1Td.textContent = `${user1.name}`;
        userName2Td.textContent = `${user2.name}`;

        document.body.appendChild(fragment);
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
                    isTrump
                };
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

    function isTrump(card) {
        return card.suitCodeWord === currentTrump ? 1 : 0;
    }

    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function isWinner(card1, card2) {
        if (isTrump(card1) && !isTrump(card2)) {

            return true;
        } else if (!isTrump(card1) && !isTrump(card2) || isTrump(card1) && isTrump(card2)) {
            return parseInt(card1.symbolCode, 16) > parseInt(card2.symbolCode, 16);
        }
    }



    getCards();


    function getCards() {

        let trumpSpan = document.getElementById('trumpSpan');
        playingCardsArray.sort(compareRandom);

        function compareRandom(a, b) {
            return Math.random() - 0.5;
        }

        let randomResult = getRandomInteger(1, 4);
        currentTrump = getTrump(randomResult, playingCardsArray);
        trumpSpan.textContent = "Trump: " + currentTrump;

        user1.currentCardsArray = playingCardsArray.splice(0, 18);
        user2.currentCardsArray = playingCardsArray;

        let table = document.getElementById('table'),
            row = document.createElement('tr'),
            td1 = document.createElement('td'),
            td2 = document.createElement('td');
        table.appendChild(row);
        row.appendChild(td1);
        row.appendChild(td2);
        td1.classList.add('td');
        td2.classList.add('td');
        user1.currentCard = user1.currentCardsArray.pop();
        user2.currentCard = user2.currentCardsArray.pop();

        td1.textContent = String.fromCodePoint(user1.currentCard.cardName);
        td2.textContent = String.fromCodePoint(user2.currentCard.cardName);


        if (isWinner(user1.currentCard, user2.currentCard)) {
            user1.score = user1.score + 1;
        }
        else {
            user2.score = user2.score + 1;
        }
    }

    document.body.addEventListener('click', function (event) {
        if (user1.currentCardsArray.length >= 1) {
            let table = document.getElementById('table'),
                row = document.createElement('tr'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td');
            table.appendChild(row);
            row.appendChild(td1);
            row.appendChild(td2);
            td1.classList.add('td');
            td2.classList.add('td');
            user1.currentCard = user1.currentCardsArray.pop();
            user2.currentCard = user2.currentCardsArray.pop();
            td1.textContent = String.fromCodePoint(user1.currentCard.cardName);
            td2.textContent = String.fromCodePoint(user2.currentCard.cardName);


            if (isWinner(user1.currentCard, user2.currentCard)) {
                user1.score = user1.score + 1;
            }
            else {
                user2.score = user2.score + 1;
            }

        } else {
            let winnerSpan = document.getElementById('winnerSpan'),
                scoreDiv = document.getElementById('scoreDiv');
            if (user1.score > user2.score) {
                winnerSpan.textContent = user1.name;
            }
            else {
                winnerSpan.textContent = user2.name;
            }
            scoreDiv.textContent = `${user1.score} : ${user2.score}`;
        }
    })




}());