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
