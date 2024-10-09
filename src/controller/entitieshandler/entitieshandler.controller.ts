/* eslint-disable prettier/prettier */
import { Controller, Body, Put, Param, Get } from '@nestjs/common';
import { DatabaseProvider } from 'src/database/database.providers';
import { ObjectId } from 'mongodb';
import { Collection } from 'mongoose';


@Controller('entities')
export class EntitiesHandlerController {
    constructor(private readonly mongoDBService: DatabaseProvider
    ) {

    }

    @Put('student_entrollment/')
    async UpdatedStudentRegistration(
        @Body() body: any
    ) {
        try {

            const collection = this.mongoDBService.getDatabase().collection("entrollment");
            const filter = {
                first_name: body.first_name,
                lastName: body.lastName,
                date_of_birth: body.date_of_birth,

            };

            const result = await collection.findOneAndUpdate(
                filter,
                { $set: body },
                { upsert: true, returnDocument: 'after' }

            );
            return {
                message: 'Updated successfully',
                inserted_id: result._id,
                data: [result],
            };


        } catch (error) {
            console.error(error);
            return {
                message: 'An error occurred while updating the entity',
                error: error.message
            };
        }
    }


    @Put(':collectionName/:id')
    async UpdatedStudentRegistrationById(
        @Param('collectionName') CollectionName: string,
        @Param('id') Id: string,
        @Body() body: any   
    ) {
        try {

            const collection = this.mongoDBService.getDatabase().collection(CollectionName);
            const filter = {
                 _id:new ObjectId(Id)
            };

            const result = await collection.findOneAndUpdate(
                filter,
                { $set: body },
                { upsert: true, returnDocument: 'after' }

            );
            return {
                message: 'Updated successfully',
                data: [result],
            };


        } catch (error) {
            console.error(error);
            return {
                message: 'An error occurred while updating the entity',
                error: error.message
            };
        }
    }

    // get method for student enrollmwnt details

    @Get(':collectionName/:id') async getStudentRegistrationById(@Param('collectionName') collectionName: string , @Param('id') id: string) {

        try {
            const collection = this.mongoDBService.getDatabase().collection(collectionName);
            const objectId = new ObjectId(id)
            const result = await collection.findOne({ _id: objectId })

            if (!result) {
                return {
                    message: 'No record found for the given ID',
                }
            };

            return {
                message: 'Data retrived successfully',
                data: result,
            };
        }
        catch (error) {
            console.error(error);
            return {
                message: 'An error occurred while fetching the data',
                error: error.message,
            }
        }
    }

}
