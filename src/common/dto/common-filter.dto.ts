import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SortDirection } from '../types/sort-direction';

@InputType()
export class CommonFilter {
  @Field({ nullable: true })
  search?: string = '';

  @IsInt()
  page!: number;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  take?: number;

  @Field(() => SortDirection, { nullable: true })
  @IsOptional()
  @IsEnum(SortDirection)
  sort?: SortDirection;
}
