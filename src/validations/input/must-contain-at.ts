import { ValidationStrategy } from "../validation-strategy";


export class MustContainAt implements ValidationStrategy {
    validate(value: string): string | null {
        return value.includes("@") ? null : "El valor debe contener '@'.";
    }
}

export class RegexValidation implements ValidationStrategy {
    constructor(private pattern: RegExp, private errorMessage: string) {}

    validate(value: string): string | null {
        return this.pattern.test(value) ? null : this.errorMessage;
    }
}
