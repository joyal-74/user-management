import mongoose, { Schema, Document } from 'mongoose';
import { Student, Status } from '../types/student.interface';
import { IStudentModel } from '../interfaces/IStudentModel';

interface StudentDoc extends Document {
  name: string;
  age: number;
  email: string;
  phone: string;
  status: Status;
  profile: string;
  password: string;
  role: string;
}

const StudentSchema = new Schema<StudentDoc>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  status: { type: String, enum: Object.values(Status), default: Status.Active },
  profile: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true });

const StudentModelMongo = mongoose.model<StudentDoc>('Student', StudentSchema);

export class MongoStudentModel implements IStudentModel {
  private mapDocToStudent(doc: any): Student {
    return {
      ...doc,
      id: doc._id.toString(),
    };
  }

  async findAll(): Promise<Student[]> {
    const docs = await StudentModelMongo.find({ role: 'student' }).sort({ _id: -1 }).lean().exec();
    return docs.map(this.mapDocToStudent);
  }

  async findById(id: string): Promise<Student | null> {
    const doc = await StudentModelMongo.findById(id).lean().exec();
    return doc ? this.mapDocToStudent(doc) : null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const doc = await StudentModelMongo.findOne({ email }).lean().exec();
    return doc ? this.mapDocToStudent(doc) : null;
  }

  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const created = new StudentModelMongo(student);
    const saved = await created.save();
    return this.mapDocToStudent(saved.toObject());
  }

  async updateStatus(id: string, data: Partial<Student>): Promise<Student | null> {
    const doc = await StudentModelMongo.findByIdAndUpdate(id, { status: data.status }, { new: true }).lean().exec();
    return doc ? this.mapDocToStudent(doc) : null;
  }

  async update(id: string, data: Partial<Student>): Promise<Student | null> {
    const doc = await StudentModelMongo.findByIdAndUpdate(id, data, { new: true }).lean().exec();
    return doc ? this.mapDocToStudent(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await StudentModelMongo.findByIdAndDelete(id).exec();
    return !!res;
  }

  async findPaginated(limit: number, offset: number): Promise<Student[]> {
    const docs = await StudentModelMongo.find({ role: 'student' })
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
    return docs.map(this.mapDocToStudent);
  }

  async countAll(): Promise<number> {
    return StudentModelMongo.countDocuments({}).exec();
  }
}
