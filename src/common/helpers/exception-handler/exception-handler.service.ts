import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Logger } from 'src/logger';

@Injectable()
export class ExceptionHandlerService {
  defaultNotFoundMessage = 'Resource not found';
  handlePrismaError(error: Error) {
    Logger.error(error.message, error.stack, 'ExceptionHandlerService');
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          if (error.meta && error.meta.target) {
            const target = error.meta.target;
            if (target[0]) {
              this.throwConflictRecord(`${target[0]} already exists`);
            }
          } else {
            this.throwConflictRecord();
          }
          break;
        case 'P2023':
          this.throwNotAcceptable();
          break;
        case 'P2025':
          this.throwNotFound();
          break;
        case 'P2009':
          this.throwUnprocessableInput();
          break;
        default:
          throw new InternalServerErrorException();
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      this.throwBadRequest();
    } else if (error instanceof NotFoundException) {
      this.throwNotFound(
        error.message === 'Not Found'
          ? this.defaultNotFoundMessage
          : error.message,
      );
    } else {
      throw new InternalServerErrorException();
    }
  }

  /**
   * @deprecated use @handlePrismaError instead
   */
  handleCreateError(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        if (error.meta && error.meta.target) {
          const target = error.meta.target;
          if (target[0]) {
            this.throwConflictRecord(`${target[0]} already exists`);
          }
        } else {
          this.throwConflictRecord();
        }
      } else {
        throw new InternalServerErrorException();
      }
    } else {
      throw new InternalServerErrorException();
    }
  }

  /**
   * @deprecated use @handlePrismaError instead
   */
  handleFindUniqueError(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2023') {
        this.throwNotAcceptable();
      } else {
        this.throwNotFound();
      }
    } else {
      throw new InternalServerErrorException();
    }
  }

  /**
   * @deprecated use @handlePrismaError instead
   */
  handleUpdateUniqueError(error: Error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      this.throwBadRequest();
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          this.throwNotFound('Record to update not found');
          break;
        case 'P2023':
          this.throwNotAcceptable();
          break;
        case 'P2002':
          if (error.meta && error.meta.target) {
            const target = error.meta.target;
            if (target[0]) {
              this.throwConflictRecord(`${target[0]} already exists`);
            }
          } else {
            this.throwConflictRecord();
          }
          break;
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  handleNullObjectError(resource) {
    if (resource === null || resource === undefined) {
      this.throwNotFound();
    } else {
      return resource;
    }
  }

  private throwNotFound(message = this.defaultNotFoundMessage) {
    throw new NotFoundException(message);
  }

  private throwConflictRecord(message = 'Conflict record') {
    throw new ConflictException(message);
  }

  private throwNotAcceptable(message = 'Not acceptable input') {
    throw new NotAcceptableException(message);
  }

  private throwBadRequest(message = 'Invalid input') {
    throw new BadRequestException(message);
  }

  private throwUnprocessableInput(message = 'Unprocessable input') {
    throw new UnprocessableEntityException(message);
  }
}
