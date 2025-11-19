import { ValidationStrategy } from "../validation-strategy";


export class CompositeValidation implements ValidationStrategy {
    constructor(private strategies: ValidationStrategy[]) {}

    validate(value: string): string | null {
        for (const strategy of this.strategies) {
            const error = strategy.validate(value);
            if (error) return error;
        }
        return null;
    }
}
