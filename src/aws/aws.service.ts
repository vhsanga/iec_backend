
import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();


@Injectable()
export class AwsService {
    private readonly s3Client = new  S3({
        region: process.env.AWS_S3_REGION, // Ej: 'us-east-1'
        accessKeyId: process.env.AWS_ACCES_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    });

    async subirArchivoToAWSs3(fileName:string, file: Buffer){
        const params: S3.PutObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: fileName,
            Body: file,
        };
        await this.s3Client.upload(params).promise();
        return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;        
    }

}
