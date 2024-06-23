using { cuid, managed } from '@sap/cds/common';

namespace demo;

entity Suppliers : cuid, managed {
    name: String(250);
    email: String(250);
    contactNo: String(250);
    adress: String(250);
    ProductCategory: String(250);
}

