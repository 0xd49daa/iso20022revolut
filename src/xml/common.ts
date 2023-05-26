import moment from 'moment';
import {v4} from "uuid";

export function getCurrentDateTime() {
    return moment().toISOString(true);
}

export function getFormatedDate(date: Date) {
    return moment(date).format('YYYY-MM-DD');
}

export function getStrippedId() {
    return stripDashes(v4());
}

export function stripDashes(str: string) {
    return str.replace("-", "");
}