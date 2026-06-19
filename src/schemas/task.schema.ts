import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { TaskPriority, TaskStatus } from '../common/enums/task-status.enum';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
})
export class Task {
  @ApiProperty({
    example: 'Prepare weekly report',
  })
  @Prop({
    required: true,
    trim: true,
  })
  title!: string;

  @ApiPropertyOptional({
    example: 'Collect task progress and send the report to the team',
  })
  @Prop({
    trim: true,
  })
  description?: string;

  @ApiProperty({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    example: TaskStatus.PENDING,
  })
  @Prop({
    type: String,
    required: true,
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @ApiProperty({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    example: TaskPriority.MEDIUM,
  })
  @Prop({
    type: String,
    enum: TaskPriority,
    required: true,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @ApiPropertyOptional({
    example: '2026-06-30T00:00:00.000Z',
  })
  @Prop()
  dueDate?: Date;

  @ApiPropertyOptional({
    example: '2026-06-19T08:00:00.000Z',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    example: '2026-06-19T08:00:00.000Z',
  })
  updatedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
