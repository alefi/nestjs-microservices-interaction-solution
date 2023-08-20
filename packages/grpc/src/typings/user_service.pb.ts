/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { GetEntityByIdParamsDto } from "./shared/struct.pb";

export const protobufPackage = "user_service.v1";

export interface UserDto {
  id: string;
  name: string;
  displayName?: string | undefined;
  email?: string | undefined;
  isEmailConfirmed: boolean;
  diallingCode?: string | undefined;
  phoneNumber?: string | undefined;
  isPhoneConfirmed?: boolean | undefined;
  authMethod: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const USER_SERVICE_V1_PACKAGE_NAME = "user_service.v1";

export interface UserServiceClient {
  getUserById(request: GetEntityByIdParamsDto, metadata?: Metadata): Observable<UserDto>;
}

export interface UserServiceController {
  getUserById(request: GetEntityByIdParamsDto, metadata?: Metadata): Promise<UserDto> | Observable<UserDto> | UserDto;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getUserById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
