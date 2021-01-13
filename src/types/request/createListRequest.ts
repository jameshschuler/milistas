import Joi from 'joi';

export interface CreateListRequest {
    name: string;
    isVisible: boolean;
    listTypeId: number;
}

export const createListRequestSchema = Joi.object( {
    name: Joi.string().min( 1 ).max( 100 ).required(),
    isVisible: Joi.boolean().required(),
    listTypeId: Joi.number().required()
} );