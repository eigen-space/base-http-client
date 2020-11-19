import { CommonQueryProps, QueryProvider } from '../..';

export abstract class BaseHttpClientDecorator implements QueryProvider {

    constructor(protected wrappedService: QueryProvider) {
    }

    get<T>(url: string, props?: CommonQueryProps): Promise<T> {
        return this.decorateMethod<T>(this.wrappedService.get.bind(this.wrappedService), url, props);
    }

    post<T>(url: string, props?: CommonQueryProps): Promise<T> {
        return this.decorateMethod<T>(this.wrappedService.post.bind(this.wrappedService), url, props);
    }

    put<T>(url: string, props?: CommonQueryProps): Promise<T> {
        return this.decorateMethod<T>(this.wrappedService.post.bind(this.wrappedService), url, props);
    }

    patch<T>(url: string, props?: CommonQueryProps): Promise<T> {
        return this.decorateMethod<T>(this.wrappedService.post.bind(this.wrappedService), url, props);
    }

    delete<T>(url: string, props?: CommonQueryProps): Promise<T> {
        return this.decorateMethod<T>(this.wrappedService.post.bind(this.wrappedService), url, props);
    }

    protected abstract decorateMethod<T>(
        method: (url: string, props: CommonQueryProps) => Promise<T>,
        url: string,
        props?: CommonQueryProps
    ): Promise<T>;
}
