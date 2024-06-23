const cds = require('@sap/cds');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://AleFalcone:eO2Op4nwXyZLHPqQ@cluster0.guiv1nd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const db_name = 'demo_sovanta'; 
const client = new MongoClient(uri);

async function CreateSupplier(req){
    try {
        await client.connect();
        const db = await client.db(db_name);
        const suppliers = await db.collection('suppliers');
        const result = await suppliers.insertOne(req.data);

        if(result.insertedId){
            req.data.id = result.insertedId;
        }

        return req.data;
        
    } catch (error) {
        console.error('Error al insertar el proveedor:', error);
        req.error(500, 'Failed to insert supplier');
    } finally {
        await client.close();
    }
}


async function GetSupplier(req) {
    try {
        await client.connect();  
        const db = await client.db(db_name);  
        const collectionSuppliers = db.collection('suppliers'); 

        const results = await collectionSuppliers
            .find()
            .toArray();
        return results;  

    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        throw new Error('Failed to fetch suppliers');
    } finally {
        await client.close(); 
    }
}

async function GetSuppliersByProductCategory() {
    try {
        await client.connect();  
        const db = client.db(db_name);  
        const collection = db.collection('suppliers'); 

        const results = await collection.aggregate([
            { $group: { _id: "$productCategory", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        return results.map(result => ({
            productCategory: result._id,
            count: result.count
        }));

    } catch (error) {
        console.error('Error al obtener proveedores por categoría de producto:', error);
        throw new Error('Failed to fetch suppliers by product category');
    } finally {
        await client.close();
    }
}

module.exports = cds.service.impl(function() {
    const { supplier } = this.entities;
    this.on('CREATE', supplier, CreateSupplier);
    this.on('READ', supplier, GetSupplier)
    this.on('GetSuppliersByProductCategory', async () => {
        return GetSuppliersByProductCategory();
    });
});


