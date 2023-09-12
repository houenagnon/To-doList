//Module for testing midddleware
const {authenticationMiddleware} = require('../src/middleware/auth')
const { StatusCodes } = require('http-status-codes')
import request from "supertest";
import app from "../src/app"

const token:String = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQtOiJiZWU4NzhkMy00ZTljLTRkMzUtYjNkYS03M2NhNDUyZTM2ZDEiLCJuYW1lIjoiQ3JlYXRlIHRvZG8iLCJpYXQiOjE2OTQxODczNzgsImV4cCI6MTY5Njc3OTM3OH0.8eYx-kIbGcgaQ98Dks_JS9bi2W0F-Rk3Fy3XV_NKK_U"

describe('Testing middleware function',() => {
    test('Should return "Token not Provide" when hearder does not have authorization key', async () => {
        
        const test = await request(app).get("/api/tasks/");
        //expect(spy).toHaveBeenCalled()
        expect(test.statusCode).toBe(401)
        expect(test.body).toEqual({
            success: false,
            msg:"Token not provided"
        });
    })
    test('Should return "Token not Provide" when hearder does not have valid authorisation', async () => {
       
        const test = await request(app).get("/api/tasks/").set({ Authorization: 'Test ' });
        expect(test.status).toBe(401)
        expect(test.body).toEqual({
            success: false,
            msg:"Token not provided"
        });
    })
    test('Should return "Not authorized to access this route" when hearder does not have a valid token', async () => {
        const res = await request(app).get("/api/tasks/").set({ Authorization: 'Bearer '+ token });
        expect(res.status).toBe(401)
        expect(res.body).toEqual({
            success: false,
            msg:"Not authorized to access this route"
        });
    })
})