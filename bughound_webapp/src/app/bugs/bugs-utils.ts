

export const REPORT_TYPES =  [
    {value: 0, name: 'Coding Error'},
    {value: 1, name: 'Design Issue'},
    {value: 2, name: 'Suggestion'},
    {value: 3, name: 'Documentation'},
    {value: 4, name: 'Hardware'},
    {value: 5, name: 'Query'}
];

export const SEVERITIES = [
    {value: 0, name: 'Minor'},
    {value: 1, name: 'Serious'},
    {value: 2, name: 'Fatal'}
];

export const STATUS = [
    {value: 0, name: 'Open'},
    {value: 1, name: 'Closed'},
    {value: 2, name: 'Resolved'}
];

export const PRIORITIES = [
    {value: 0, name: 'Fix immediately'},
    {value: 1, name: 'Fix as soon as possible'},
    {value: 2, name: 'Fix before next milestone'},
    {value: 3, name: 'Fix before release'},
    {value: 4, name: 'Fix if possible'},
    {value: 5, name: 'Optional'}
];

export const RESOLUTIONS = [
    {value: 0, name: 'Pending'},
    {value: 1, name: 'Fixed'},
    {value: 2, name: 'Irreproducible'},
    {value: 3, name: 'Deferred'},
    {value: 4, name: 'As designed'},
    {value: 5, name: 'Withdrawn by reporter'},
    {value: 6, name: 'Need more info'},
    {value: 7, name: 'Disagree with suggestion'},
    {value: 8, name: 'Duplicate'}
];

export const AREAS = [
    {value: 0, name: 'Lexer'},
    {value: 1, name: 'Parser'},
    {value: 2, name: 'Compiler'},
    {value: 3, name: 'Source code'}
];




export function getChoiceFromValue(value, name) {
    let array = REPORT_TYPES;

    if (name === 'SEVERITIES') {
        array = SEVERITIES;
    }

    if (name === 'STATUS') {
        array = STATUS;
    }

    return array.find(obj => obj.value === value).name;
}

