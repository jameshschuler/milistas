import Joi from 'joi';

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    emailAddress: string;
}

export const registerRequestSchema = Joi.object( {
    firstName: Joi.string().min( 2 ).max( 100 ).required(),
    lastName: Joi.string().min( 2 ).max( 100 ).required(),
    username: Joi.string().min( 3 ).max( 100 ).required(),
    phoneNumber: Joi.string().trim().regex( /^[0-9]{7,10}$/ ).min( 10 ).max( 10 ).required(),
    emailAddress: Joi.string().email()
} );