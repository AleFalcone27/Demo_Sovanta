using { managed } from '@sap/cds/common';
// cuid
namespace demo.db;

entity supplier : managed {
    key id: String;
    name: String(250);
    email: String(250);
    contactNo: String(250);
    address: String(250);
    productCategory: String(250);
}

