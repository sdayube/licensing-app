import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export function isValidCPF(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  if (!/^\d{3}\.\d{3}\.\d{3}\-\d{2}$|^\d{11}$/.test(value)) {
    return false;
  }

  return cpf.isValid(value, true);
}

export function isValidCNPJ(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/.test(value)) {
    return false;
  }

  return cnpj.isValid(value, true);
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return isValidCPF(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid cpf`;
        },
      },
    });
  };
}

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return isValidCNPJ(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid cnpj`;
        },
      },
    });
  };
}
