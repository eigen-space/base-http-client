import { CommonQueryProps, OutputData, QueryProvider } from '../..';

/* istanbul ignore next */
export abstract class BaseHttpClientDecorator<R> implements QueryProvider<R> {

    constructor(protected wrappedService: QueryProvider<R>) {
    }

    get<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>> {
        return this.decorateMethod<T>(this.wrappedService.get.bind(this.wrappedService), url, props);
    }

    post<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>> {
        return this.decorateMethod<T>(this.wrappedService.post.bind(this.wrappedService), url, props);
    }

    put<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>> {
        return this.decorateMethod<T>(this.wrappedService.put.bind(this.wrappedService), url, props);
    }

    patch<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>> {
        return this.decorateMethod<T>(this.wrappedService.patch.bind(this.wrappedService), url, props);
    }

    delete<T>(url: string, props?: CommonQueryProps): Promise<OutputData<T, R>> {
        return this.decorateMethod<T>(this.wrappedService.delete.bind(this.wrappedService), url, props);
    }

    protected abstract decorateMethod<T>(
        method: (url: string, props: CommonQueryProps) => Promise<OutputData<T, R>>,
        url: string,
        props?: CommonQueryProps
    ): Promise<OutputData<T, R>>;
}
