import {ui, register} from 'platypus';

export default class GlobalAlert extends ui.TemplateControl {
    templateString: string = require('./globalalert.tc.html');
    context: {
        alerts: Array<string>;
    } = {
        alerts: null
    };

    setAlerts(alerts: any, type: string): void {
        var alertList = alerts;

        if (!this.utils.isArray(alerts)) {
            if (this.utils.isString(alerts)) {
                alertList = [{ message: alerts }];
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
        }, 5000);
    }

    setAlertType(status: string): void {
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

    dismissAlerts(): void {
        this.dom.removeClass(this.element, 'alert-visible');
        this.context.alerts = null;
    }
}

register.control('global-alert', GlobalAlert, [], true);
