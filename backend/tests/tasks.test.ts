import request from 'supertest';
import app from '../src/app';

const token:String = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZWU4NzhkMy00ZTljLTRkMzUtYjNkYS03M2NhNDUyZTM2ZDEiLCJuYW1lIjoiQ3JlYXRlIHRvZG8iLCJpYXQiOjE2OTQxODczNzgsImV4cCI6MTY5Njc3OTM3OH0.8eYx-kIbGcgaQ98Dks_JS9bi2W0F-Rk3Fy3XV_NKK_U"
const tokenFasle:String = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQtOiJiZWU4NzhkMy00ZTljLTRkMzUtYjNkYS03M2NhNDUyZTM2ZDEiLCJuYW1lIjoiQ3JlYXRlIHRvZG8iLCJpYXQiOjE2OTQxODczNzgsImV4cCI6MTY5Njc3OTM3OH0.8eYx-kIbGcgaQ98Dks_JS9bi2W0F-Rk3Fy3XV_NKK_U"
const id:String = "a247cf06-f649-4239-a628-40a979592b80"

describe('Tasks API tests', () => {
  describe('Creation', ()=>{
    const newTask = {
      name: 'ToDo',
      tag: 'en_cour',
    };
    it('should create a new Task', async () => {
      const response = await request(app)
        .post('/api/tasks').set({ Authorization: 'Bearer ' + token })
        .send(newTask);
      expect (response.status).toBe(201);
      expect (response.body.success).toEqual(true);
      expect (response.body.row.name).toEqual(newTask.name);
      expect (response.body.row.tag).toEqual(newTask.tag);
    });
    it('Should return 401 where token is not provided', async ()=>{
      const response = await request(app)
        .post('/api/tasks').set({ Authorization: 'Bearer '})
        .send(newTask);
      expect(response.status).toBe(401);
      expect (response.body.success).toEqual(false);
    });
    it('Should return 400 when name is not provided', async ()=>{
      const response = await request(app)
        .post('/api/tasks').set({ Authorization: 'Bearer ' + token })
        .send({"name": null, "tag": "null"});
      expect(response.status).toBe(400);
      expect (response.body.success).toEqual(false);
      expect (response.body.msg).toEqual("Task's name and tag are required");
    });
    it('Should return 400 when tag is not provided', async ()=>{
      const response = await request(app)
        .post('/api/tasks').set({ Authorization: 'Bearer ' + token })
        .send({"name": "null", "tag": null});
      expect(response.status).toBe(400);
      expect (response.body.success).toEqual(false);
      expect (response.body.msg).toEqual("Task's name and tag are required");
    });
    it('Should return 400 when nothing is not provided', async ()=>{
      const response = await request(app)
        .post('/api/tasks').set({ Authorization: 'Bearer ' + token })
        .send({});
      expect(response.status).toBe(400);
      expect (response.body.success).toEqual(false);
      expect (response.body.msg).toEqual("Task's name and tag are required");
    });
  });

  describe('Update', ()=>{
    const task: any = {
      "name": "update task",
      "tag": 'finie'
    }
    it('Should update task and return 200', async ()=>{
      const response = await request(app)
        .patch('/api/tasks/'+id).set({ Authorization: 'Bearer ' + token })
        .send(task);
      expect (response.status).toBe(200);
      expect (response.body.success).toEqual(true);
    });
    it('Should return 404 when task id is not provided', async ()=>{
      const response = await request(app)
        .patch('/api/tasks/').set({ Authorization: 'Bearer ' + token })
        .send(task);
      expect (response.status).toBe(404);
    });
    it('Should return 401 where token is not provided', async ()=>{
      const response = await request(app)
        .post('/api/tasks/'+id).set({ Authorization: 'Bearer '})
        .send(task);
      expect(response.status).toBe(401);
      expect (response.body.success).toEqual(false);
    });
    
  });

  describe('Get', ()=>{
    it('should return all Tasks', async () => {
      const response = await request(app)
        .get('/api/tasks').set({ Authorization: 'Bearer ' + token });
      expect (response.status).toBe(200);
      expect (response.body.success).toBe(true);
      //expect (response.body.rows.lenght >= 0).toBeTruthy();
    });
    it('should return a single Task', async () => {
      const response = await request(app)
        .get('/api/tasks/'+id).set({ Authorization: 'Bearer ' + token });
      expect (response.status).toBe(200);
      expect (response.body.success).toEqual(true);
      expect (response.body.row.id).toEqual(id);
    });
    it('past invalid token to get task', async () => {
      const response = await request(app)
        .get('/api/tasks').set({ Authorization: 'Bearer ' + tokenFasle });
      expect(response.status).toBe(401);
      expect (response.body.success).toEqual(false);
      expect (response.body.msg).toEqual("Not authorized to access this route");
    });
  });

  describe('Delete', ()=>{
    it('should return all Tasks', async () => {
      const response = await request(app)
        .get('/api/tasks/'+id).set({ Authorization: 'Bearer ' + token });
      expect (response.status).toBe(200);
      expect (response.body.success).toEqual(true);
    });
  });
});
