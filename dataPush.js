const csvtojson = require('csvtojson');

const { db } = require('./DatabaseStuffs/connection');
const { User, Family } = require('./DatabaseStuffs/models');


const fileName = 'FamilyDatas.csv';

// csvtojson()
//     .fromFile(fileName)
//     .then(async (source) => {
//         for (let i = 0; i < source.length; i++) {
//             const familyData = {
//                 husband: source[i]['Husband Name'],
//                 husbandDob: new Date(source[i]['Husband DOB']),
//                 wife: source[i]['Wife Name'],
//                 wifeDob: new Date(source[i]['Wife DOB']),
//                 weddingAnniversary: new Date(source[i]['Wedding Anniversary']),
//                 children: [],
//             };

//             for (let j = 1; j <= 3; j++) {
//                 const childName = source[i][`Child ${j} Name`];
//                 const childDOB = source[i][`Child ${j} DOB`];

//                 // Check if either childName or childDOB is present
//                 if (childName || childDOB) {
//                     const childData = {
//                         name: childName || "nil",
//                         dob: childDOB ? new Date(childDOB) : null,
//                     };
//                     familyData.children.push(childData);
//                 }
//             }

//             const family = new Family(familyData);

//             try {
//                 await family.save();
//                 console.log('Family saved successfully.');
//             } catch (error) {
//                 console.error('Error saving family:', error);
//             }
//         }
//     });



csvtojson()
    .fromFile(fileName)
    .then(async (source) => {
        for (let i = 0; i < source.length; i++) {
            // Create users
            const husband = await createUser(source[i]['Husband Name'], new Date(source[i]['Husband DOB']));
            const wife = await createUser(source[i]['Wife Name'], new Date(source[i]['Wife DOB']));

            const children = [];
            for (let j = 1; j <= 3; j++) {
                const childName = source[i][`Child ${j} Name`];
                const childDOB = source[i][`Child ${j} DOB`];

                if (childName || childDOB) {
                    const child = await createUser(childName || "nil", childDOB ? new Date(childDOB) : null);
                    children.push(child._id);
                }
            }

            console.log(children);

            // Create family
            const familyData = {
                husband: husband._id,
                wife: wife._id,
                weddingAnniversary: new Date(source[i]['Wedding Anniversary']),
                children: children,
            };

            const family = new Family(familyData);

            try {
                await family.save();
                console.log('Family saved successfully.');
            } catch (error) {
                console.error('Error saving family:', error);
            }
        }
    });

async function createUser(name, dateOfBirth) {
    const user = new User({
        name: name,
        dateOfBirth: dateOfBirth,
    });

    try {
        const savedUser = await user.save();
        console.log('User saved successfully.');
        return savedUser._id; // Return only the _id
    } catch (error) {
        console.error('Error saving user:', error);
    }
}




