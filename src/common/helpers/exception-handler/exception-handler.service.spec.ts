import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionHandlerService } from './exception-handler.service';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Logger } from 'src/logger';

describe('ExceptionHandlerService', () => {
  let service: ExceptionHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionHandlerService],
      imports: [],
    }).compile();

    service = module.get<ExceptionHandlerService>(ExceptionHandlerService);
    Logger.error = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw a InternalServerErrorException', () => {
    const error = new Error();
    expect(() => {
      service.handlePrismaError(error);
    }).toThrowError(InternalServerErrorException);
  });

  it('should throw a BadRequestException', () => {
    const error = new Prisma.PrismaClientValidationError('Bad request', {
      clientVersion: '',
    });
    expect(() => {
      service.handlePrismaError(error);
    }).toThrowError(BadRequestException);
  });

  it('should throw conflict record exception', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Conflict record', {
      code: 'P2002',
      clientVersion: '',
    });
    expect(() => {
      service.handlePrismaError(error);
    }).toThrowError(ConflictException);
  });

  it('should throw conflict record exception with email already exists message', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Conflict record', {
      code: 'P2002',
      clientVersion: '',
      meta: {
        target: ['email'],
      },
    });
    const t = () => {
      service.handlePrismaError(error);
    };
    expect(t).toThrow(ConflictException);
    expect(t).toThrow('email already exists');
  });

  it('should throw NotAcceptableException exception', () => {
    const error = new Prisma.PrismaClientKnownRequestError('', {
      code: 'P2023',
      clientVersion: '',
    });
    expect(() => {
      service.handlePrismaError(error);
    }).toThrowError(NotAcceptableException);
  });

  it('should throw NotFoundException exception', () => {
    const error = new Prisma.PrismaClientKnownRequestError('', {
      code: 'P2025',
      clientVersion: '',
    });
    expect(() => {
      service.handlePrismaError(error);
    }).toThrowError(NotFoundException);
  });

  it('should throw UnprocessableEntityException exception', () => {
    const error = new Prisma.PrismaClientKnownRequestError('', {
      code: 'P2009',
      clientVersion: '',
    });
    expect(() => {
      service.handlePrismaError(error);
    }).toThrowError(UnprocessableEntityException);
  });

  it('should throw InternalServerErrorException exception', () => {
    const error = new Prisma.PrismaClientKnownRequestError('', {
      code: 'UNKNOWN_CODE',
      clientVersion: '',
    });
    expect(() => {
      service.handlePrismaError(error);
    }).toThrowError(InternalServerErrorException);
  });
});
