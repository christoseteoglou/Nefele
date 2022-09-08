import crypto from 'crypto';
import bcrypt from 'bcrypt';
import randtoken from 'rand-token';
import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
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
}, {
    timestamps: true
});

userSchema.path('email').set(function (email) {
    if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
        const hash = crypto.createHash('md5').update(email).digest('hex');
        this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`;
    }

    return email;
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return next();

    // const rounds = env === 'test' ? 1 : 9;
    // const rounds = serverRuntimeConfig.cryptoRounds;
    const rounds = +process.env['CRYPTO_ROUNDS'];

    // bcrypt.hash(this.password, rounds).then((hash) => {
    //     this.password = hash;
    //     console.log('HASHING COMPLETE');
    //     next();
    // }).catch(next);

    let hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    console.log('HASHING COMPLETE');
    return;
});

userSchema.methods = {
    view(full) {
        let fields = ['username', 'picture', 'createdAt', 'updatedAt'];

        if (full) {
            let protectedFields = ['_id', '__v', 'password'];

            fields = Object.keys(JSON.parse(JSON.stringify(this))).filter(k => !protectedFields.includes(k));
        }
        const view = {};

        for (let f of fields) {
            view[f] = this[f];
        }

        view.id = this._id;
        
        return view;
    },

    async authenticate(pass) {
        // return bcrypt.compare(pass, this.password).then((valid) => valid ? this : false);
        return bcrypt.compare(pass, this.password);
    }
}

// userSchema.statics = {
//     createFromService({ service, id, email, picture }) {
//         return this.findOne({ $or: [{ [`services.${service}`]: id}, { email }] }).then((user) => {
//             if (user) {
//                 user.services[service] = id;
//                 user.picture = picture;
//                 return user.save();
//             } else {
//                 const password = randtoken.generate(16);
//                 return this.create({ services: { [service]: id }, email, password, picture });
//             }
//         });
//     }
// };

const User = models.User || model('User', userSchema);

export const schema = User.schema;
export default User;