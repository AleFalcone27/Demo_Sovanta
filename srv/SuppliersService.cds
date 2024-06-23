using { demo } from '../db/data-models';

service SuppliersService @(path:'/SuppliersService') {
    entity supplier as projection on demo.Suppliers;
}


