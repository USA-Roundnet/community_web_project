const request = require("supertest");
const { app } = require("../index");
const knex = require("../knex-config.js");

describe("User Controller API Tests", () => {
    const baseUser = {
        first_name: "oldfirstname",
        last_name:"oldlastname",
        username:"oldusername",
        gender:"male",
        email:"oldemail@test.com",
        city:"oldcity",
        state_province:"oldstate",
        zip_code:"00000",
        country:"oldcountry",
        phone_number:"9999999999",
        date_of_birth:"2000-01-01",
        profile_picture_url:"https://old.com/test.jpg",
        password:"oldpassword",
        auth_provider:"local",
        google_id:"oldgoogleid",
        created_at:"2000-02-02 00:00:00",
        elo: 1000,
        rank: 10,
        status: "pro",
      };
    let createdbaseUserId;

    const newUser = {
        first_name: "testfirstname",
        last_name:"testlastname",
        username:"testusername",
        gender:"male",
        email:"testemail@test.com",
        city:"testcity",
        state_province:"teststate",
        zip_code:"00000",
        country:"testcountry",
        phone_number:"9999999999",
        date_of_birth:"2000-01-01",
        profile_picture_url:"https://test.com/test.jpg",
        password:"testpassword",
        auth_provider:"local",
        google_id:"testgoogleid",
        created_at:"2000-02-02 00:00:00",
        elo: 1000,
        rank: 10,
        status: "pro",
    };
    const minimalUser = {
        first_name: "minimal",
        last_name: "user",
        username: "minimaluser",
        gender: "male",
        email: "minimal@test.com",
        city:"testcity",
        state_province:"teststate",
        zip_code:"00000",
        country:"testcountry",
        phone_number:"9999999999",
        date_of_birth: "2000-01-01",
      };
    let creatednewUserId
    beforeAll(async () => {
        const [id] = await knex("User").insert(baseUser)
        createdbaseUserId = id;
      });
    // Clean up database after tests
    afterAll(async () => {
        if (createdbaseUserId) {
            await knex("User").where({ id: createdbaseUserId }).del();
        }
        if (creatednewUserId) {
            await knex("User").where({ id: creatednewUserId }).del();
        }
        await knex.destroy();
    });
    describe("Tests creation of new user", () => {
        test('Create a new user with all proper input', async () => {
            const response = (await request(app)
            .post('/api/users')
            .send(newUser));
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
        test('Create a new user with minimul proper input', async () => {
            const response = (await request(app)
            .post('/api/users')
            .send(minimalUser));
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        });
    });
    describe("tests update of user", () => {
        test('Update a user property by id', async () => {
            const response = (await request(app)
            .put(`/api/users/${createdbaseUserId}`)
            .send({first_name: "newfirst_name"}));
            expect(response.status).toBe(200)
            expect(response.body.first_name).toBe("newfirst_name");
        });
    });
});