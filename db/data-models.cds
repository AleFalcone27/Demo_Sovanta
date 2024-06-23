using { cuid, managed } from '@sap/cds/common';

namespace demo.db;

entity supplier : cuid, managed {
    name: String(250);
    email: String(250);
    contactNo: String(250);
    address: String(250);
    productCategory: String(250);
}

