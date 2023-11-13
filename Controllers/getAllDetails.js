const { User, Family } = require("../DatabaseStuffs/models")
const mongoose = require('mongoose')

const getDetails = async (req, res) => {

    try {
        const allFamilies = await Family.find();
        //res.json(allFamilies);
        res.status(200).json(allFamilies)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getCustomDetails = async (req, res) => {
    try {
        const year = req.query.year;

        if (!year) {
            return res.status(400).json({ message: 'Year parameter is required' });
        }

        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

        const families = await Family.find({
            $or: [
                {
                    weddingAnniversary: {
                        $gte: startDate.toISOString(),
                        $lt: endDate.toISOString(),
                    },
                },
                {
                    husbandDob: {
                        $gte: startDate.toISOString(),
                        $lt: endDate.toISOString(),
                    },
                },
                {
                    wifeDob: {
                        $gte: startDate.toISOString(),
                        $lt: endDate.toISOString(),
                    },
                },
                {
                    'children.dob': {
                        $gte: startDate.toISOString(),
                        $lt: endDate.toISOString(),
                    },
                },
            ],
        }).populate('husband wife');

        const users = await User.find({
            dateOfBirth: {
                $gte: startDate.toISOString(),
                $lt: endDate.toISOString(),
            },
        });

        if (families.length === 0 && users.length === 0) {
            return res.status(404).json({ message: 'No data found for the specified year' });
        }

        const events = [];

        // Families Main loop
        for (const family of families) {
            const weddingAnniversary = new Date(family.weddingAnniversary);

            // Wedding Anniversary Event
            if (weddingAnniversary >= startDate && weddingAnniversary <= endDate) {
                events.push({
                    event: 'Wedding Anniversary',
                    name: `${family.husband.name} & ${family.wife.name}`, 
                    date: weddingAnniversary.toISOString(),
                });
            }

            const husbandDob = new Date(family.husbandDob);

            // Husband's Birthday Event
            if (husbandDob >= startDate && husbandDob <= endDate) {
                events.push({
                    event: 'Birthday',
                    name: family.husband.name,
                    date: husbandDob.toISOString(),
                });
            }

            const wifeDob = new Date(family.wifeDob);

            // Wife's Birthday Event
            if (wifeDob >= startDate && wifeDob <= endDate) {
                events.push({
                    event: 'Birthday',
                    name: family.wife.name,
                    date: wifeDob.toISOString(),
                });
            }

            const parentsNames = [family.husband.name, family.wife.name];

            // Children's Birthday Events
            family.children.forEach((child) => {
                const childDob = new Date(child.dob);
                if (childDob >= startDate && childDob <= endDate) {
                    events.push({
                        event: 'Birthday',
                        parentsNames: parentsNames,
                        childName: child.name,
                        date: childDob.toISOString(),
                    });
                }
            });
        }

        // Users Loop
        users.forEach((user) => {
            const userDob = new Date(user.dateOfBirth);

            // User's Birthday Event
            if (userDob >= startDate && userDob <= endDate) {
                events.push({
                    event: 'Birthday',
                    name: user.name,
                    date: userDob.toISOString(),
                });
            }
        });

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDetails,
    getCustomDetails
};
