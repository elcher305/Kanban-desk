const KanbanBoard = {
    template: `
    <div class="kanban-board">
      <column title="Запланированные задачи" :tasks="plannedTasks" @add-task="addTask" @move-task="moveTask"></column>
      <column title="Задачи в работе" :tasks="inProgressTasks" @move-task="moveTask"></column>
      <column title="Тестирование" :tasks="testingTasks" @move-task="moveTask"></column>
      <column title="Выполненные задачи" :tasks="completedTasks" @move-task="moveTask"></column>
    </div>
  `,
    data() {
        return {
            plannedTasks: [],
            inProgressTasks: [],
            testingTasks: [],
            completedTasks: [],
        };
    },
    methods: {
        addTask(task) {
            this.plannedTasks.push(task);
        },
        moveTask(task, fromColumn, toColumn) {
            this[fromColumn] = this[fromColumn].filter(t => t.id !== task.id);
            this[toColumn].push(task);
        },
    },
};

const Column = {
    template: `
    <div class="column">
      <h2>{{ title }}</h2>
      <div v-for="task in tasks" :key="task.id">
        <task-card :task="task" @edit-task="editTask" @delete-task="deleteTask" @move-task="moveTask"></task-card>
      </div>
      <button v-if="title === 'Запланированные задачи'" @click="addTask">Добавить задачу</button>
    </div>
  `,
    props: {
        title: String,
        tasks: Array,
    },
    methods: {
        addTask() {
            const newTask = {
                id: Date.now(),
                title: 'Новая задача',
                description: 'Описание задачи',
                deadline: '2023-12-31',
                createdAt: new Date().toISOString(),
                lastEdited: new Date().toISOString(),
            };
            this.$emit('add-task', newTask);
        },
        editTask(task) {
            task.lastEdited = new Date().toISOString();
            this.$emit('move-task', task, this.title.toLowerCase().replace(/ /g, ''), this.title.toLowerCase().replace(/ /g, ''));
        },
        deleteTask(task) {
            this.$emit('move-task', task, this.title.toLowerCase().replace(/ /g, ''), 'deleted');
        },
        moveTask(task, toColumn) {
            this.$emit('move-task', task, this.title.toLowerCase().replace(/ /g, ''), toColumn);
        },
    },
};

