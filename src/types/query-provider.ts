import { AnyDictionary } from '@eigenspace/common-types';
import { FormEntry } from './form-data-appender';
import { OutputData } from '../entities';

/**
 * Common properties to request.
 */
export interface CommonQueryProps {
    params?: AnyDictionary;
    options?: AnyDictionary;
    headers?: AnyDictionary;
    data?: AnyDictionary | string | FormEntry[];
}

/**
 * An interface that is an abstraction over the types of queries. Consumers of decorator entities including data layer
 * services. But at its core, decorators are representatives of the application layer. This entails violation of layers
 * and abstractions, if you use decorators in services directly. Therefore, an interface stood out that does not know
 * anything about layers.
 */
export interface QueryProvider<R> {

    /**
     * Requests data via GET method.
     *
     * @param {string} url
     * @param {CommonQueryProps} [props]
     */
    get<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>>;

    /**
     * Requests data via POST method.
     *
     * @param {string} url
     * @param {CommonQueryProps} [props]
     */
    post<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>>;

    /**
     * Requests data via PUT method.
     *
     * @param {string} url
     * @param {CommonQueryProps} [props]
     */
    put<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>>;

    /**
     * Requests data via PATCH method.
     *
     * @param {string} url
     * @param {CommonQueryProps} [props]
     */
    patch<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>>;

    /**
     * Requests data via DELETE method.
     *
     * @param {string} url
     * @param {CommonQueryProps} [props]
     */
    delete<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>>;
}
