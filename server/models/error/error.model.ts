/// <reference path="../../references.d.ts" />

class Model implements models.IValidationError {
    constructor(public message: string, public property?: string) { }
}

export = Model;
