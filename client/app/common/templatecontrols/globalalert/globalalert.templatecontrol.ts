/// <reference path="../../../../references.d.ts" />

import plat = require('platypus');

class GlobalAlert extends plat.ui.TemplateControl {
    templateString = require('./globalalert.templatecontrol.html');
    context = {
        alerts: null
    };
    
    setAlerts(alerts: any, type: string) {
        var alertList = alerts;
        
        if (!this.utils.isArray(alerts)) {
            if (this.utils.isString(alerts)) {
                alertList = [{ message: alerts }]
            }
            
            if (this.utils.isObject(alerts)) {
                alertList = [alerts];
            }
        }
        
        this.setAlertType(type);
        this.dom.addClass(this.element, 'alert-visible');
        this.context.alerts = alertList;
        
        setTimeout(() => {
            this.dismissAlerts();
        }, 5000)
    }
    
    setAlertType(status: string) {
        var cssClass: string;
        
        switch (status) {
            case 'success':
                cssClass = 'alert-success';
                break;
            case 'fail':
                cssClass = 'alert-danger';
                break;
            default:
                cssClass = 'alert-neutral';
                break;
        }
        
        this.dom.addClass(this.element.firstElementChild, cssClass);
    }
    
    dismissAlerts() {
        this.dom.removeClass(this.element, 'alert-visible');
        this.context.alerts = null;
    }
}

plat.register.control('global-alert', GlobalAlert, [], true);

export = GlobalAlert;
