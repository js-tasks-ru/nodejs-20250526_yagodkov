import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateTaskDto, Task, TaskStatus, UpdateTaskDto } from "./task.model";
import { NotificationsService } from "../notifications/notifications.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo } = createTaskDto;
    const task: Task = {
      id: (this.tasks.length + 1).toString(),
      title,
      description,
      status: TaskStatus.Pending,
      assignedTo,
    };
    this.tasks.push(task);

    // Получаем пользователя и отправляем email
    if (assignedTo) {
      const user = this.usersService.getUserById(assignedTo);
      if (!user) throw new NotFoundException(`user with id ${assignedTo} is not found`);
      this.notificationsService.sendEmail(
        user.email,
        'Новая задача',
        `Вы назначены ответственным за задачу: "${title}"`
      );
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Задача с ID ${id} не найдена`);
    }
    Object.assign(task, updateTaskDto);

    // Отправка SMS при обновлении статуса задачи
    if (task.assignedTo) {
      const user = this.usersService.getUserById(task.assignedTo);
      if (!user) throw new NotFoundException(`user with id ${task.assignedTo} is not found`);
      if (updateTaskDto.status) {
        this.notificationsService.sendSMS(
          user.phone,
          `Статус задачи "${task.title}" обновлён на "${updateTaskDto.status}"`
        );
      }
    }
    return task;
  }
}
