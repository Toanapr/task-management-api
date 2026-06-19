import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { Task } from '../schemas/task.schema';
import { TaskPriority, TaskStatus } from '../common/enums/task-status.enum';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({
    description: 'Task created successfully',
    type: Task,
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiQuery({ name: 'priority', enum: TaskPriority, required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({
    description: 'Task list',
    schema: {
      example: {
        count: 1,
        data: [
          {
            title: 'Prepare weekly report',
            description:
              'Collect task progress and send the report to the team',
            status: TaskStatus.PENDING,
            priority: TaskPriority.MEDIUM,
            dueDate: '2026-06-30T00:00:00.000Z',
            createdAt: '2026-06-19T08:00:00.000Z',
            updatedAt: '2026-06-19T08:00:00.000Z',
          },
        ],
      },
    },
  })
  async findAll(@Query() query: GetTasksQueryDto) {
    const tasks = await this.taskService.findAll(query);

    return {
      count: tasks.length,
      data: tasks,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiParam({ name: 'id', description: 'MongoDB task id' })
  @ApiOkResponse({
    description: 'Task detail',
    type: Task,
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by id' })
  @ApiParam({ name: 'id', description: 'MongoDB task id' })
  @ApiOkResponse({
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by id' })
  @ApiParam({ name: 'id', description: 'MongoDB task id' })
  @ApiOkResponse({
    description: 'Task deleted successfully',
    schema: {
      example: {
        message: 'Task deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  async remove(@Param('id') id: string) {
    await this.taskService.remove(id);
    return {
      message: 'Task deleted successfully',
    };
  }
}
