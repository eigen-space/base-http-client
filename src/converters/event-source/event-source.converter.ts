import { EventMessage } from '../../entities/event-message/event-message';

// TODO: cover with specs independently from covering inside of provider response specs
export class EventSourceConverter {

    constructor() {
        this.isNotEmpty = this.isNotEmpty.bind(this);
        this.normalizeToDictEntry = this.normalizeToDictEntry.bind(this);
        this.convertToMessage = this.convertToMessage.bind(this);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    convert(chunk: string): EventMessage<any>[] {
        const messages = chunk.split('\n\n')
            .filter(this.isNotEmpty) as string[];

        return messages.map(this.convertToMessage);
    }

    // noinspection JSMethodCanBeStatic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private convertToMessage(chunk: string): EventMessage<any> {
        const entries = chunk.split('\n')
            .filter(this.isNotEmpty)
            .map(this.normalizeToDictEntry)
            .filter(Boolean);

        const stringifiedObject = `{${entries.join(',')}}`;

        return JSON.parse(stringifiedObject);
    }

    // noinspection JSMethodCanBeStatic
    private isNotEmpty(chunk: string): boolean {
        return Boolean(chunk.trim());
    }

    // noinspection JSMethodCanBeStatic
    private normalizeToDictEntry(entry: string): string | undefined {
        const separator = ':';
        const columnPos = entry.indexOf(separator);
        const key = entry.slice(0, columnPos);
        const value = entry.slice(columnPos + 1)
            .trim();

        if (!value) {
            return;
        }

        const isObject = value.startsWith('{') && value.endsWith('}');
        const formattedValue = isObject ? value : `"${value}"`;

        return [`"${key}"`, separator, formattedValue].join('');
    }
}