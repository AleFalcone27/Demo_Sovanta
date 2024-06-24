const cds = require('@sap/cds');
const { MongoClient, ObjectId } = require('mongodb');
const { name } = require('./server');

const uri = "mongodb+srv://AleFalcone:eO2Op4nwXyZLHPqQ@cluster0.guiv1nd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const db_name = 'demo_sovanta';
const client = new MongoClient(uri);

async function CreateSupplier(req) {
    try {
        await client.connect();
        const db = client.db(db_name);
        const suppliers = db.collection('suppliers');
        const result = suppliers.insertOne(req.data);

        if (result.insertedId) {
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
        const db = client.db(db_name);
        const collectionSuppliers = db.collection('suppliers');

        var filter;

        if(req.query.SELECT.one){
            var id = req.query.SELECT.from.ref[0].where[2].val;
            filter = { _id: ObjectId.createFromHexString(id) };
        }

        const results = await collectionSuppliers
            .find()
            .filter(filter)
            .toArray();

        for (let i = 0; i < results.length; i++) {
            results[i].id = results[i]._id.toString();
        }
        
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


async function UpdateSupplier(req) {
    try {
        await client.connect();
        const db = client.db(db_name);
        const collection = db.collection('suppliers');
        var data = req.data
        var id = ObjectId.createFromHexString(data.id)
        console.log(id);
        delete data.id;

        const results = await collection.updateOne(
            { _id: id}, 
            { $set: data }
        );

        if(results.modifiedCount == 1){
            delete data._id;
            data.id = id;
            return data;
        }else{
            console.log(results.result);
            return results.result;
        }

    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        throw new Error('Failed to update supplier');
    } finally {
        await client.close();
    }
}

async function DeleteSupplier(req){
    await client.connect();
    const db = client.db(db_name);
    const collection = db.collection('suppliers');
    var data = req.data
    var id = ObjectId.createFromHexString(data.id)
    const result = await collection.deleteOne({_id:id})
    return result;
}

module.exports = cds.service.impl(function () {
    const { supplier } = this.entities;
    this.on('CREATE', supplier, CreateSupplier);
    this.on('READ', supplier, GetSupplier);
    this.on("UPDATE", supplier, UpdateSupplier);
    this.on("DELETE", supplier , DeleteSupplier)
    this.on('GetSuppliersByProductCategory', async () => {
        return GetSuppliersByProductCategory();
    });
});


