//test module
import request from "supertest";
import app from "../src/app"
const { StatusCodes } = require('http-status-codes')
const userFunc = require('../src/controllers/users');

const user = {
	name: "Create todo7",
    email: "user7@example.com",
    password: "password",
};
const successCreate = {
    success: true,
    msg: "Created successfully"
};
describe("users regristration route", () => {
    test("Should handle exception when name, email and password have not provided", async () => {

        const res = await request(app).post("/api/users/register").send({});
    
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            success: false,
            msg: "Provide name, email and password"
        });
    });

    test("Should have keys success and msg when created", async () => {
        const res = await request(app).post("/api/users/register").send(user);
    
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            success: true,
            msg: "Created successfully"
        });
    });
    
    test("Handle exception when an existing email is provided", async () => {
    
        const res = await request(app).post("/api/users/register").send(user);
    
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success: false,
            msg: "email already exists"
        });
    });
    
});


describe('user login route', ()=>{
    test("should return a 401 when an invalid password is sent", async () => {        
        const res = await request(app)
          .post("/api/users/login")
          .send({ email: user.email, password: "doesnotmatch" });

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
            success: false,
            msg: "Invalid password"
        });
    });
})