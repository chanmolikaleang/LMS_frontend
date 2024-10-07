import { Injectable } from '@nestjs/common';
import { SimpleFilter } from 'src/common/interfaces/simple-filter.dto';
import { SortDirection } from 'src/common/types/sort-direction';
import * as uuid from 'uuid';
import * as crypto from 'crypto';
import BigNumber from 'bignumber.js';

@Injectable()
export class HelperService {
  generatePrismaModelSimpleFilter(
    simpleFilter: SimpleFilter,
    fields: string[],
  ) {
    return {
      take: simpleFilter.take,
      where: {
        OR: [
          ...fields.map((field) => {
            return {
              [field]: {
                contains: simpleFilter.search,
                mode: 'insensitive',
              },
            };
          }),
        ],
      },
    } as {
      take: number;
      where: {
        OR: {
          [x: string]: {
            contains: string;
            mode: string;
          };
        }[];
      };
    };
  }

  generateSearchColumns(
    search = '',
    fields: string[],
  ): {
    [x: string]: {
      contains: string;
      mode: string;
    };
  }[] {
    if (!search || search === '' || !fields || fields.length === 0) {
      return [];
    }
    return [
      ...fields.map((field) => {
        return {
          [field]: {
            contains: search,
            mode: 'insensitive',
          },
        };
      }),
    ];
  }

  generateUid(): string {
    return uuid.v4();
  }

  generateRandomAlphaNumericString(length: number): string {
    const characters =
      // eslint-disable-next-line spellcheck/spell-checker
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  generatePaginationOffset(
    page = 0,
    take = 20,
  ): { skip: number; take: number } {
    if (page < 0) {
      page = 0;
    }
    if (take < 1) {
      take = 1;
    }
    return {
      skip: page * take,
      take,
    };
  }

  getFilterOrderBy(
    column?: string,
    direction?: SortDirection,
  ): {
    [x: string]: SortDirection;
  } | null {
    if (!column || !direction) {
      return null;
    }
    return {
      [column]: direction,
    };
  }

  shortenedUid(uid: string): string {
    return crypto
      .createHash('shake256', { outputLength: 8 })
      .update(uid)
      .digest('hex');
  }

  countDecimals(input: number): number {
    const decimalPart = String(input).split('.')[1];
    return decimalPart ? decimalPart.length : 0;
  }

  /**
   * @deprecated The method should not be used, because we use BigNumber now
   */
  round(value: number, decimals: number): number {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }

  roundHalfUpBigNumber(number: BigNumber, dp = 0): BigNumber {
    return number.dp(dp, BigNumber.ROUND_HALF_UP);
  }
}
