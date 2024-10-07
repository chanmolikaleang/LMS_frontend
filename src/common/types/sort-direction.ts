import { registerEnumType } from '@nestjs/graphql';
export const SortDirection: {
  asc: 'asc';
  desc: 'desc';
} = {
  asc: 'asc',
  desc: 'desc',
};
export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

registerEnumType(SortDirection, {
  name: 'SortDirection',
});
