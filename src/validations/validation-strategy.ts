export interface ValidationStrategy {
    validate(value: string): string | null;
}
