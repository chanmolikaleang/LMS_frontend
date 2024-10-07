import { Test, TestingModule } from '@nestjs/testing';
import { HelperService } from './helper.service';

describe('HelperService', () => {
  let service: HelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperService],
    }).compile();

    service = module.get<HelperService>(HelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a prisma model simple filter', () => {
    expect(
      service.generatePrismaModelSimpleFilter({ take: 10, search: 'test' }, [
        'name',
        'address',
        'phone',
        'email',
      ]),
    ).toEqual({
      take: 10,
      where: {
        OR: [
          {
            name: {
              contains: 'test',
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: 'test',
              mode: 'insensitive',
            },
          },
          {
            phone: {
              contains: 'test',
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: 'test',
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  });

  it('generate alpha numeric of length of 4', () => {
    expect(service.generateRandomAlphaNumericString(4)).toHaveLength(4);
  });

  it('should generate correct pagination offsets without passing any values', () => {
    expect(service.generatePaginationOffset()).toEqual({
      skip: 0,
      take: 20,
    });
  });

  it('should generate correct pagination offsets passing take as 100', () => {
    expect(service.generatePaginationOffset(0, 100)).toEqual({
      skip: 0,
      take: 100,
    });
  });

  it('should generate correct pagination offsets passing take as 100 and page 1', () => {
    expect(service.generatePaginationOffset(1, 100)).toEqual({
      skip: 100,
      take: 100,
    });
  });

  it('should generate correct pagination offsets passing take as 100 and page 2', () => {
    expect(service.generatePaginationOffset(2, 100)).toEqual({
      skip: 200,
      take: 100,
    });
  });

  it('should return correct filter by when sort is passed', () => {
    expect(service.getFilterOrderBy('name', 'asc')).toEqual({
      name: 'asc',
    });
  });

  it('should return correct filter by when sort is passed', () => {
    expect(service.getFilterOrderBy('description', 'desc')).toEqual({
      description: 'desc',
    });
  });

  it('should return null if any of the parameters not passed', () => {
    expect(service.getFilterOrderBy('description')).toEqual(null);
  });

  it('should generate search columns correctly', () => {
    expect(
      service.generateSearchColumns('test', ['name', 'description']),
    ).toEqual([
      {
        name: {
          contains: 'test',
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: 'test',
          mode: 'insensitive',
        },
      },
    ]);
  });

  it('should return empty array if no search text not provided or empty', () => {
    expect(service.generateSearchColumns('', ['name', 'description'])).toEqual(
      [],
    );
  });
  it('should return empty array if no search text not provided', () => {
    expect(
      service.generateSearchColumns(undefined, ['name', 'description']),
    ).toEqual([]);
  });

  it('should return empty array if no search fields not provided or empty', () => {
    expect(service.generateSearchColumns('', [])).toEqual([]);
  });

  it('should shorten the given uid', () => {
    expect(
      service.shortenedUid('9d04ae86-bf0d-4189-b9fb-39906c662756'),
    ).toEqual('2c984d453caae5f8');
  });

  it('should correctly output the number of decimals in a given number', () => {
    expect(service.countDecimals(1.2345)).toEqual(4);
    expect(service.countDecimals(134.34)).toEqual(2);
    expect(service.countDecimals(134.4)).toEqual(1);
    expect(service.countDecimals(2323)).toEqual(0);
  });

  it('should correctly output the rounded number', () => {
    expect(service.round(1.2345, 2)).toEqual(1.23);
    expect(service.round(134.34, 2)).toEqual(134.34);
    expect(service.round(134.4, 1)).toEqual(134.4);
    expect(service.round(2323, 0)).toEqual(2323);
    expect(service.round(1.005, 2)).toEqual(1.01);
  });
});
