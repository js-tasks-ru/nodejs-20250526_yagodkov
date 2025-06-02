import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Task } from "./task.model";

@Injectable()
export class TasksService {
  private nextId = 1
  private tasks: Task[] = [];

  getTasks(status?: string, page?: number, limit?: number) {
    let result = this.getAllTasks();
    if (status) {
      result = result.filter(task => task.status === status);
    }
    if (page !== undefined && limit !== undefined) {
      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new BadRequestException('Некорректные параметры page или limit');
      }
      const start = (page - 1) * limit;
      const end = start + limit;
      result = result.slice(start, end);
    }
    if (result.length === 0) {
      throw new NotFoundException('Задачи не найдены');
    }
    return result;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    return task;
  }

  createTask(task: Task): Task {
    const newTask = { ...task, id: String(this.nextId++) };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, update: Task): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    const updatedTask = { ...this.tasks[taskIndex], ...update };
    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  deleteTask(id: string): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    const [deletedTask] = this.tasks.splice(taskIndex, 1);
    return deletedTask;
  }
}
