Vue.component('kanban-board', {
    template: `
        <div class="kanban-board">
            <column title="Запланированные задачи" :cards="planned" @move-card="moveCard" @edit-card="editCard" @delete-card="deleteCard" :can-create="true"></column>
            <column title="Задачи в работе" :cards="inProgress" @move-card="moveCard" @edit-card="editCard"></column>
            <column title="Тестирование" :cards="testing" @move-card="moveCard" @edit-card="editCard"></column>
            <column title="Выполненные задачи" :cards="completed" @move-card="moveCard"></column>
        </div>
    `,
    data() {
        return {
            planned: [],
            inProgress: [],
            testing: [],
            completed: []
        };
    },
    methods: {
        moveCard(card, from, to) {
            this[from] = this[from].filter(c => c.id !== card.id);
            this[to].push(card);
        },
        editCard(card, column) {
            const index = this[column].findIndex(c => c.id === card.id);
            if (index !== -1) {
                this[column][index] = card;
            }
        },
        deleteCard(cardId) {
            this.planned = this.planned.filter(c => c.id !== cardId);
        }
    }
});

Vue.component('column', {
    props: ['title', 'cards', 'canCreate'],
    template: `
        <div class="column">
            <h2>{{ title }}</h2>
            <div v-for="card in cards" :key="card.id">
                <card :card="card" @move-card="moveCard" @edit-card="editCard" @delete-card="deleteCard"></card>
            </div>
            <button v-if="canCreate" @click="createCard">Создать карточку</button>
        </div>
    `,
    methods: {
        createCard() {
            const newCard = {
                id: Date.now(),
                title: 'Новая задача',
                description: 'Описание задачи',
                deadline: '2023-12-31',
                createdAt: new Date().toLocaleString(),
                lastEdited: new Date().toLocaleString()
            };
            this.$emit('move-card', newCard, '', 'planned');
        },
        moveCard(card, to) {
            this.$emit('move-card', card, this.title.toLowerCase().replace(/ /g, ''), to);
        },
        editCard(card) {
            this.$emit('edit-card', card, this.title.toLowerCase().replace(/ /g, ''));
        },
        deleteCard(cardId) {
            this.$emit('delete-card', cardId);
        }
    }
});

Vue.component('card', {
    props: ['card'],
    template: `
        <div class="card" :class="{ overdue: isOverdue, completed: isCompleted }">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <div class="deadline">Дэдлайн: {{ card.deadline }}</div>
            <div class="timestamp">Создано: {{ card.createdAt }}</div>
            <div class="timestamp">Последнее редактирование: {{ card.lastEdited }}</div>
            <button @click="editCard">Редактировать</button>
            <button @click="deleteCard">Удалить</button>
            <button v-if="!isCompleted" @click="moveCard('inProgress')">В работу</button>
            <button v-if="isInProgress" @click="moveCard('testing')">В тестирование</button>
            <button v-if="isTesting" @click="moveCard('completed')">Завершить</button>
            <button v-if="isTesting" @click="moveCard('inProgress', 'Возврат: требуется доработка')">Вернуть в работу</button>
        </div>
    `,
    computed: {
        isOverdue() {
            return new Date(this.card.deadline) < new Date() && this.card.status === 'completed';
        },
        isCompleted() {
            return this.card.status === 'completed';
        },
        isInProgress() {
            return this.card.status === 'inProgress';
        },
        isTesting() {
            return this.card.status === 'testing';
        }
    },
    methods: {
        editCard() {
            const newTitle = prompt('Введите новый заголовок', this.card.title);
            const newDescription = prompt('Введите новое описание', this.card.description);
            const newDeadline = prompt('Введите новый дэдлайн', this.card.deadline);
            if (newTitle && newDescription && newDeadline) {
                this.card.title = newTitle;
                this.card.description = newDescription;
                this.card.deadline = newDeadline;
                this.card.lastEdited = new Date().toLocaleString();
                this.$emit('edit-card', this.card);
            }
        },
        deleteCard() {
            this.$emit('delete-card', this.card.id);
        },
        moveCard(to, reason) {
            if (reason) {
                this.card.returnReason = reason;
            }
            this.$emit('move-card', this.card, to);
        }
    }
});

new Vue({
    el: '#app',
    data() {
        
    }

});
