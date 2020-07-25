
const User = require('./models/user');

class FakeDb {

    constructor() {

        this.users = [
            {
                username: "michel",
                email: "michel.dio33@gmail.com",
                password: "dioiod"
            }
        ];
    }

    cleanDb() {
        User.remove({});
    }

    pushDatasToDb() {

        const user = new User(this.users[0]);
        return user.save();
    }

    seedDb() {
        this.pushDatasToDb();
    }
}

module.exports = FakeDb;