/// <reference path="../references.d.ts" />

import express = require('express');
import BaseProcedures = require('../config/db/procedures/base');
import BaseController = require('./base.controller');
import BaseModel = require('../models/base.model');

type Store = BaseProcedures<any, any, any, any>;

class Controller<P extends Store, M extends BaseModel<any>> extends BaseController {
    procedures: P;
    model: M;

    constructor(procedures: P, model?: M) {
        super();

        this.procedures = procedures;
        this.model = model;
    }

    create(req: express.Request, res: express.Response): Thenable<void> {
        var obj = req.body;
        
        return this.model.validate(obj).then(() => {
            return this.handleResponse(this.procedures.create(obj), res);
        }, (errors) => {
            return this.handleResponse(Promise.reject(errors), res);
        });
    }

    read(req: express.Request, res: express.Response): Thenable<void> {
        return this.handleResponse(this.procedures.read(req.params.id), res);
    }
    
    update(req: express.Request, res: express.Response): Thenable<void> {
        var obj = req.body;
        
        return this.model.validate(obj).then(() => {
            return this.handleResponse(this.procedures.update(obj), res); 
        }, (errors) => {
            return this.handleResponse(Promise.reject(errors), res);
        });
    }
    
    destroy(req: express.Request, res: express.Response): Thenable<void> {
        var id = req.body.id;
        return this.handleResponse(this.procedures.destroy(id), res);
    }

    all(req: express.Request, res: express.Response): Thenable<void> {
        return this.handleResponse(this.procedures.all(), res);
    }
}

export = Controller;
