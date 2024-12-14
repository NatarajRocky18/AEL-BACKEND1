import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseProvider } from 'src/database/database.providers';

@Injectable()

export class DashboardService {

  constructor(private databseProvider: DatabaseProvider) { }

  async getCollection(collection: any) {
    const db = this.databseProvider.getDatabase();
    return db.collection(collection);
  }

  //API FOR DASHBOARD DROPDOWN VALUES GET 
  async getDropDownData(collection_name: any) {
    const collection = await this.getCollection(collection_name);
    const pipeline = [
      {
        '$group': {
          '_id': '$type',
          'type': {
            '$first': '$type'
          },
          'options': {
            '$push': {
              'value': '$value',
              'label': '$label',
              'type': '$type'
            }
          }
        }
      }
    ]

    return collection.aggregate(pipeline).toArray();
  }

  //API FOR STUDENT PROFILE OVERL ALL STUDENT LIST IN TABLE
  async getAllFormData(filters: {
    disability?: string[],
    schoolStatus?: string[],
    employmentStatus?: string[]
  }, collection_name: any): Promise<any[]> {
    const collection = await this.getCollection(collection_name);

    const pipeline = [
      // MATCH STAGE
      {
        $match: {
          $and: [
            filters.disability ? { "disability_section.disabled": { $in: filters.disability } } : {},
            filters.schoolStatus ? { "education_section.school_status": { $in: filters.schoolStatus } } : {},
            filters.employmentStatus ? { "employment_section.employment_status": { $in: filters.employmentStatus } } : {}
          ]
        }
      },

      //PROJECT STAGE
      {
        $project: {
          id: "$Personal_Details.id",
          first_name: "$Personal_Details.first_name",
          last_name: "$Personal_Details.last_name",
          gender: "$personal_characteristics.gender",
          email: "$contact_information.email",
          mobile: "$contact_information.mobile"
        }
      }
    ]
    return collection.aggregate(pipeline).toArray();
  }

  //API FOR GET DASHBOARD CARD VALUE   
  async dashboardCardValue(collectionName: any) {
    const collection = await this.getCollection(collectionName);

    const pipeline = 
    [
      {
        $group: {
          _id: null,
          maleCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$personal_characteristics.gender",
                    "male",
                  ],
                },
                1,
                0,
              ],
            },
          },
          femaleCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$personal_characteristics.gender",
                    "female",
                  ],
                },
                1,
                0,
              ],
            },
          },
          disabilityCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$disability_section.disabled",
                    "Yes",
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalCount: { $sum: 1 },
        },
      },
    ]
    return collection.aggregate(pipeline).toArray()
  }


  //API FOR GET THE DASHBOARD BAR CHART VALUE
  async dashboardChartValue(collectionName: any) {
    const collection = await this.getCollection(collectionName);

    const pipeline =  [
      {
        $group: {
          _id: {
            month: {
              $dateToString: {
                format: "%B", // Month name
                date: "$created_on",
              },
            },
            monthNumber: {
              $dateToString: {
                format: "%m", // Numeric month (01-12)
                date: "$created_on",
              },
            },
          },
          maleCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$personal_characteristics.gender",
                    "male",
                  ],
                },
                1,
                0,
              ],
            },
          },
          femaleCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$personal_characteristics.gender",
                    "female",
                  ],
                },
                1,
                0,
              ],
            },
          },
          disabilityCount: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$disability_section.disabled",
                    "Yes",
                  ],
                },
                1,
                0,
              ],
            },
          },
          maleWithDisabilityCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$personal_characteristics.gender",
                        "male",
                      ],
                    },
                    {
                      $eq: [
                        "$disability_section.disabled",
                        "Yes",
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          maleNormalCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$personal_characteristics.gender",
                        "male",
                      ],
                    },
                    {
                      $ne: [
                        "$disability_section.disabled",
                        "Yes",
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
    
          FemaleWithDisabilityCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$personal_characteristics.gender",
                        "female",
                      ],
                    },
                    {
                      $eq: [
                        "$disability_section.disabled",
                        "Yes",
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          feMaleNormalCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        "$personal_characteristics.gender",
                        "female",
                      ],
                    },
                    {
                      $ne: [
                        "$disability_section.disabled",
                        "Yes",
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$month", // Month name
          month: "$_id.month",
          monthNumber: { $toInt: "$_id.monthNumber" }, // Convert monthNumber to integer for sorting
          male: "$maleCount",
          female: "$femaleCount",
          disability: "$disabilityCount",
          FemaleWithDisabilityCount:
            "$FemaleWithDisabilityCount",
          feMaleNormalCount: "$feMaleNormalCount",
          maleNormalCount: "$maleNormalCount",
          maleWithDisabilityCount:
            "$maleWithDisabilityCount",
        },
      },
      {
        $sort: {
          monthNumber: 1, // Sort by the numeric month value
        },
      },
    
      {
        $project: {
          category: "$month", // Month name
          male: 1,
          female: 1,
          disability: 1,
           FemaleWithDisabilityCount:
            "$FemaleWithDisabilityCount",
          feMaleNormalCount: "$feMaleNormalCount",
          maleNormalCount: "$maleNormalCount",
          maleWithDisabilityCount:
            "$maleWithDisabilityCount",
        },
      },
    ]
    return collection.aggregate(pipeline).toArray()
  }


}