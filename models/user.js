import crypto from 'crypto';
import bcrypt from 'bcrypt';
import randtoken from 'rand-token';
import getConfig from 'next/config';
import { Schema, model, models } from 'mongoose';

const { serverRuntimeConfig } = getConfig();

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
        trim: true,
        lowercase: true
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

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    // const rounds = env === 'test' ? 1 : 9;
    const rounds = serverRuntimeConfig.cryptoRounds;

    bcrypt.hash(this.password, rounds).then((hash) => {
        this.password = hash;
        next();
    }).catch(next);
});

userSchema.methods = {
    view(full) {
        let fields = ['id', 'picture'];

        if (full) {
            fields = [...fields, 'email', 'createdAt'];
        }
        const view = {};

        for (let f of fields) {
            view[f] = this[f];
        }
        
        return view;
    },

    authenticate(pass) {
        return bcrypt.compare(pass, this.password).then((valid) => valid ? this : false);
    }
}

userSchema.statics = {
    createFromService({ service, id, email, picture }) {
        return this.findOne({ $or: [{ [`services.${service}`]: id}, { email }] }).then((user) => {
            if (user) {
                user.services[service] = id;
                user.picture = picture;
                return user.save();
            } else {
                const password = randtoken.generate(16);
                return this.create({ services: { [service]: id }, email, password, picture });
            }
        });
    }
};

const User = models.User || model('User', userSchema);

export const schema = User.schema;
export default User;