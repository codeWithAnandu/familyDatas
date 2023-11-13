// const mongoose = require('mongoose');

// const Family = mongoose.model('Family', {
//     husband: String,
//     husbandDob: Date, 
//     wife: String,
//     wifeDob: Date, 
//     weddingAnniversary: Date, 
//     children: [
//         {
//             name: String,
//             dob: Date, 
//         },
//     ],
// });

// module.exports = {
//     Family
// };


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    dateOfBirth: Date,
});

const User = mongoose.model('User', userSchema);

const familySchema = new mongoose.Schema({
    husband: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    wife: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    weddingAnniversary: Date,
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

const Family = mongoose.model('Family', familySchema);

module.exports = {
    User,
    Family,
};


