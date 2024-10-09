/* eslint-disable prettier/prettier */
// src/database/mongodb.provider.ts
import { MongoClient, Db } from 'mongodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseProvider {
    private client: MongoClient;
    private db: Db;
    constructor() { 
        this.client = new MongoClient(process.env.MONGO_URL);
        this.connect();
    }

    private async connect() {
        try {
            await this.client.connect();
            console.log('Successfully connected to MongoDB');
            const dbName = "ael";
            this.db = this.client.db(dbName);
        } catch (error) {
            console.error('MongoDB connection failed:', error);
        }
    }

    private getDbNameFromUri(uri: string): string {
        const match = uri.match(/\/([^/?]+)(\?|$)/);
        return match ? match[1] : '';
    }

    getClient(): MongoClient {
        return this.client;
    }

    public getDatabase(): Db {
        return this.db;
    }

    async closeConnection() {
        await this.client.close();
        console.log('MongoDB connection closed');
    }
}
