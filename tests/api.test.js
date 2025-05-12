import request from 'supertest';
import app from '../src/app.js';

describe('User API', () => {
    let userId;

    test('GET all users (empty)', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('POST create user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ username: 'John', age: 30, hobbies: ['Reading'] });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        userId = res.body.id;
    });

    test('GET user by id', async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(userId);
    });

    test('DELETE user', async () => {
        const res = await request(app).delete(`/api/users/${userId}`);
        expect(res.status).toBe(204);
    });

    test('GET deleted user (404)', async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.status).toBe(404);
    });
});
