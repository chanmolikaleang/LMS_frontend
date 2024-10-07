import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsCode(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(code: string): boolean {
          if (!code) return false;
          if (typeof code !== 'string') return false;
          if (code.length > 10) return false;
          if (code == '') return false;
          return code.match(/^[a-zA-Z0-9#-]+$/) !== null;
        },
        defaultMessage(validationArguments) {
          if (
            validationArguments.value == null ||
            validationArguments.value == undefined
          ) {
            return `code should not be empty`;
          }
          if (typeof validationArguments.value !== 'string') {
            return `code must be a string`;
          }
          if (validationArguments.value.length > 10) {
            return `code cannot be longer than 10 characters`;
          }
          if (validationArguments.value == '') {
            return `code should not be empty`;
          }
          return 'code must contain only alphanumeric characters, #, and -';
        },
      },
    });
  };
}
