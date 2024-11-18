import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
});

UserSchema.pre('save', async function (next) {
    let user = this as unknown as User;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.checkPassword = function (attempt: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(attempt, this.password, (err: NativeError, isMatch: boolean) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};

export interface User extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    checkPassword(attempt: string): Promise<boolean>;
}