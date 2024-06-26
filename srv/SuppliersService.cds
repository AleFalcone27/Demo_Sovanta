using { demo.db as myDemo } from '../db/data-models';

service SuppliersService @(path:'/SuppliersService') {
    entity supplier as projection on myDemo.supplier;

    action GetSuppliersByProductCategory()
    returns array of 
    {
        productCategory: String;
        count: Integer64;
    };
}