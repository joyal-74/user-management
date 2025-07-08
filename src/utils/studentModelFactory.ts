import { IStudentModel } from '../interfaces/IStudentModel';
import { SQLStudentModel } from '../models/student.model';
import { MongoStudentModel } from '../models/student.model-mongo';

export function getStudentModel() : IStudentModel {
    const dbType = process.env.DB_TYPE;
    return dbType === 'mongodb' ? new MongoStudentModel() : new SQLStudentModel();
}
 