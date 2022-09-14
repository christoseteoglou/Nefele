import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Schema, model, models, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IUserSchema {
    email?: string;
    username?: string;
    password?: string;
    services?: string[];
    picture?: string;
    createdAt?: string;
    updatedAt?: string;
}


/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuid
 *        email:
 *          type: string
 *        services:
 *          type: array
 *          items:
 *            type: string
 *        picture:
 *          type: string
 *          format: url
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *             
 */
export interface UserSchema extends IUserSchema {
    id: string;
}

export interface IUser extends IUserSchema {
    _id: string;
    email: string;
    username: string;
    password: string;
    view(full: boolean): { [key: string]: any };
    authenticate(pass: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    services: {
        bungie: String
    },
    picture: {
        type: String,
        trim: true
    }
});

userSchema.path('email').set(function (email: string): string {
    if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
        const hash = crypto.createHash('md5').update(email).digest('hex');
        this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`;
    }

    return email;
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;

    const rounds = +process.env['CRYPTO_ROUNDS'];

    let hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    console.log('HASHING COMPLETE');
    return;
});

userSchema.methods = {
    // view(full: boolean): { [key: string]: any } {
    view(full: boolean): UserSchema {
        let fields = ['username', 'picture', 'createdAt'];

        if (full) {
            let protectedFields = ['_id', '__v', 'password'];

            fields = Object.keys(JSON.parse(JSON.stringify(this))).filter(k => !protectedFields.includes(k));
        }
        const view: UserSchema = { id: this._id.toString() };

        for (let f of fields) {
            view[f] = this[f];
        }

        return view;
    },

    async authenticate(pass: string): Promise<boolean> {
        return bcrypt.compare(pass, this.password);
    }
}

let _User: Model<IUser, {}, {}, {}, any>
if (models['User']) {
    _User = models['User'];
} else {
    _User = model<IUser>('User', userSchema);
}

export const User = _User;