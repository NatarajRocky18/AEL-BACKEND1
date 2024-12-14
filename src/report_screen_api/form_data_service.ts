import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseProvider } from 'src/database/database.providers';


@Injectable()
export class FormDataService {

  constructor(private readonly databaseProvider: DatabaseProvider) { }

  async getCollection(collection:any) {
    const db = this.databaseProvider.getDatabase();
    return db.collection(collection);
  }


  // API FOR INDIVIDUAL STUDENT QUESTION AND ANSWER LIST IN TABLES
  async getAllFormDataByAggregation(id: any, collectionName: any): Promise<any> {
    const collection = await this.getCollection(collectionName);
    const dataModelCollection = await this.getCollection("data_model");

  // PIPELINE FOR GROUPING AND SORTING DATA FROM DATA MODEL COLLECTION
    const pipeline = [
      {
        $group: {
          _id: "$section",
          section: { $first: "$section_label" },
          section_id: { $first: "$section_id" },
          fields: {
            $push: {
              label: "$label",
              key: "$field_name"
            }
          }
        }
      },
      { $sort: { section_id: 1 } }
    ];
  
    try {
      // Fetch structured data from dataModelCollection
      const dataModel = await dataModelCollection.aggregate(pipeline).toArray();
      const formData = await collection.findOne({ _id: id });
  
      // Initialize the final result object
      const result = { _id: formData._id, created_on: formData.created_on };
  
      // Transform the data according to the dataModel structure
      for (const record of dataModel) {
        const sectionLabel = record.section;
        const fields = record.fields;
        const sectionData = formData[record._id] || {}; // Fallback if section data is missing
  
        // Transform section data using field labels
        const transformedData = {};
        for (const field of fields) {
          const value = sectionData[field.key];
          transformedData[field.label] = value;
        }
  
        // Add transformed section data to the result
        result[sectionLabel] = transformedData;
      }
  
      return result;
    } catch (error) {
      console.error(error);
      throw new NotFoundException("Error processing the data model.");
    }
  }
  
  
}

