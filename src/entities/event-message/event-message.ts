export interface EventMessage<T> {
    type: string;
    lastEventId?: string;
    data: T;
}