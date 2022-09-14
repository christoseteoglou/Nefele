export interface IError {
    name: string;
    message: string;
    code: number;
}

export const UnauthorizedError: IError = {
    name: 'UnauthorizedError',
    message: 'You are not authorized to access this resource',
    code: 401
};

export const InvalidTokenError: IError = {
    name: 'InvalidTokenError',
    message: 'The provided token is invalid.',
    code: 401
};

export const ResourceNotFoundError: IError = {
    name: 'ResourceNotFoundError',
    message: 'The requested resource does not exist.',
    code: 404
};

export const InternalServerError: IError = {
    name: 'InternalServerError',
    message: 'The server has encountered an internal error.',
    code: 500
};