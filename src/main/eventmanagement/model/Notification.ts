// Handling notifications sending to the user

export class Notification {
    private message: string;
    private timestamp: Date;

    constructor(message: string, timestamp: Date) {
        this.message = message;
        this.timestamp = timestamp;
    }

    public getMessage(): string {
        return this.message;
    }

    public getTimestamp(): Date {
        return this.timestamp;
    }

    public setMessage(message: string): void {
        this.message = message;
    }

    public setTimestamp(timestamp: Date): void {
        this.timestamp = timestamp;
    }

    public toString(): string {
        return `Notification(message: ${this.message}, timestamp: ${this.timestamp})`;
    }

    

}
