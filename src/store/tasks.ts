import { defineStore } from 'pinia';
import { Task } from '@/types/task';
import { isObject } from "@/utils/typeof";

type TasksState = {
  tasks: Task[];
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
  }),
  getters: {
    apiUrl: () => 'https://6582c33c02f747c8367a2493.mockapi.io',
  },
  actions: {
    getEmptyTask(): Task {
      return {
        id: "",
        title: "",
        description: "",
        completed: false,
        deadline: null,
      }
    },
    parseTask(data: unknown): Task {
      const task = this.getEmptyTask();
      if (!isObject(data)) return task;
      Object.assign(task, data);
      return task;
    },
    async getTasks(): Promise<void> {
      const response = await fetch(`${this.apiUrl}/task`);
      const data = await response.json();
      this.tasks = data;
    },
    async getTask(id: string): Promise<Task> {
      const response = await fetch(`${this.apiUrl}/task/${id}`);
      const data = await response.json();
      return this.parseTask(data);
    },
    async addTask(task: Task): Promise<void> {
      const response = await fetch(`${this.apiUrl}/task`, {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const newTask = this.parseTask(data);
      this.tasks = [newTask, ...this.tasks];
    },
    async updateTask(task: Task): Promise<void> {
      const response = await fetch(`${this.apiUrl}/task/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      const updatedTask = this.parseTask(data);
      this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    },
    async removeTask(id: string): Promise<void> {
      await fetch(`${this.apiUrl}/task/${id}`, {
        method: 'DELETE',
      });
      this.tasks = this.tasks.filter(t => t.id !== id);
    },
  }
})
