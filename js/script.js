"use strict";

//funkcja nasluchiwania

document.addEventListener('DOMContentLoaded', function () {

    // generowanie id, ktore sklada sie z ciagu znakow, aby nie bylo duplikatow podczas tworzenia

    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        for (var i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
    // seperacja kodu js od index.html Funkcja ta pobiera templatkę HTML z pliku index.html,
    // parsowała, renderowała z użyciem naszej biblioteki szablonów, a następnie zwracała gotowy rezultat
    //parametry funkcji name, data.... pozwala na dodanie nazwy templatki ktora jest w html

    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        // basicElement dla opakowania, dla Mustache, w zaleznosci od tego w jaki element zostanie opakokwany szablon
        var element = document.createElement(basicElement || 'div');

        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);

        return element;
    }

    // tworzenie klasy KOLUMN za pomoca funkcji :

    function Column(name) {
        var self = this;

        this.id = randomString();
        this.name = name;
        // przy tworzeniu obiektu tworzymy element Node, generale-template wywoluje funkcje ktora pobiera element z html :
        // szablony kolumn sa w html !!!!
        this.element = generateTemplate('column-template', {
            name: this.name,
            id: this.id
        });
        // nasluchiwanie dla usuwania kolumn oraz dodawania nowych kart do kolumny :
        this.element.querySelector('.column').addEventListener('click', function (event) {
            if (event.target.classList.contains('btn-delete')) {
                self.removeColumn();
            }

            if (event.target.classList.contains('add-card')) {
                //pobieramy od uzytkownika nazwe kolumny ktora tworzymy :
                self.addCard(new Card(prompt("Enter the name of the card")));
            }
        });
    }

    // dodanie metody dla klasy Column, prototyp :
    Column.prototype = {
        addCard: function (card) {
            this.element.querySelector('ul').appendChild(card.element);
        },
        removeColumn: function () {
            this.element.parentNode.removeChild(this.element);
        }
    };
    // tworzenie klasy z kartami funkcja konstruujaca :
    function Card(description) {
        var self = this;

        this.id = randomString();
        this.description = description;
        this.element = generateTemplate('card-template', {
            description: this.description
        }, 'li');

        // nasluchiwanie  na usuniecie karty :
        this.element.querySelector('.card').addEventListener('click', function (event) {
            event.stopPropagation();

            if (event.target.classList.contains('btn-delete')) {
                self.removeCard();
            }
        });
    }
    // metoda do zaimplementowania usuniecia karty , prototyp :
    Card.prototype = {
        removeCard: function () {
            this.element.parentNode.removeChild(this.element);
        }
    }
    // tworzymy obiekt dla tablicy ktora jest w index.html, nasluchiwanie :
    var board = {
        name: 'Kanban Board',
        // element board - kontener tablicy !!!!
        addColumn: function (column) {
            this.element.appendChild(column.element);
            initSortable(column.id); //About this feature we will tell later
        },
        element: document.querySelector('#board .column-container')
    };

    // Implementacja dla funkcji : sortowanie elementow z listy metoda przeciagnij i upusc,
    // drag'n'drop - w index.html biblioteka podpieta :

    function initSortable(id) {
        var el = document.getElementById(id);
        var sortable = Sortable.create(el, {
            group: 'kanban',
            sort: true
        });
    }
    // zdarzenie kliknięcia, aby obsługiwało wrzucanie nowej kolumny do tablicy :

    document.querySelector('#board .create-column').addEventListener('click', function () {
        var name = prompt('Enter a column name');
        var column = new Column(name);
        board.addColumn(column);
    });

    //tworzenie nowych obiektow :

    // CREATING COLUMNS
    var todoColumn = new Column('To do');
    var doingColumn = new Column('Doing');
    var doneColumn = new Column('Done');

    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    // CREATING CARDS
    var card1 = new Card('New task');
    var card2 = new Card('Create kanban boards');

    // ADDING CARDS TO COLUMNS
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);
});