import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usersSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        validate: (e) => {
            if(e.length == 4) return true;
            return false;
        }
    },
})

usersSchema.pre("save", async function(next){
    if (!this.isModified('password')) return next();
    try {
        const data = this.password.toString();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(data, salt)
        return next();
    } catch (err) {
        return next(err);
    }
})

export const UsersModel = mongoose.model('users', usersSchema);