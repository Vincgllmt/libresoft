enum SoftwareUserTypes {
    ADMINISTRATION = 'Administration',
    ASSOCIATION = 'Association',
    COMPANY = 'Company',
    PERSON = 'Person',
}
interface SoftwareUsers {
    name: string;
    id: number;
    url: string;
    type: SoftwareUserTypes;
}