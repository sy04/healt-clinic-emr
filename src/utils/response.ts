import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

@ObjectType()
export class MetaData {
  @Field(() => Int)
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;
}

export function ResponseFormat<T>(classRef: Type<T>): Type<any> {
  @ObjectType({ isAbstract: true })
  class ResponseClass {
    @Field(() => MetaData)
    meta: MetaData;

    @Field(() => classRef, { nullable: true })
    data: T | null;

    constructor(meta: MetaData, data: T | null) {
      this.meta = meta;
      this.data = data;
    }
  }
  return ResponseClass;
}

export const ErrorResponseFormat = ResponseFormat(Object);

/**
 * @param {number} code
 * @param {string} message
 * @param {*} data
 * @returns {}
 */

const getClassRef = <T>(data: T | null): Type<T> => {
  if (data === null) {
    return Object as unknown as Type<T>;
  }
  return data.constructor as Type<T>;
};

export const responseSuccess = <T>(
  code: number,
  message: string,
  data: T | null,
): typeof ResponseFormat<T> => {
  const meta: MetaData = {
    code,
    success: true,
    message,
  };

  const classRef = getClassRef(data);
  const ResponseClass = ResponseFormat(classRef);
  return new ResponseClass(meta, data);
};

export const responseError = (
  code: number,
  message: string,
): typeof ResponseFormat<null> => {
  const meta: MetaData = {
    code,
    success: false,
    message,
  };

  const ResponseClass = ResponseFormat(Object);
  return new ResponseClass(meta, null);
};
