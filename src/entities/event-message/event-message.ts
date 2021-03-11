export interface EventMessage<T> {
    event: string;
    id?: string;
    data: T;
}