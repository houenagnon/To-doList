import request from 'supertest';
import app from '../src/app';
import start from '../src/index'; // Importez la fonction de démarrage de votre serveur

describe('API tests 404', () => {

  it('should return a 404 for an unknown route', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });
});