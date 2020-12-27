import Joi from 'joi';

export interface LoginRequest {
    username: string;
    accessCode: string;
}

export const loginRequestSchema = Joi.object( {
    username: Joi.string().required(),
    accessCode: Joi.string().required()
} );