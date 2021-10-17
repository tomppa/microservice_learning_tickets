import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

const basePath = '/api/tickets/';

function generateValidMongoId() {
  return new mongoose.Types.ObjectId().toHexString();
}

export interface CreateRequestAttributes {
  generateCookie?: boolean;
  providedCookie?: string[];
  body: object;
  expectStatus?: number;
}

export interface UpdateRequestAttributes {
  generateCookie?: boolean;
  providedCookie?: string[];
  id?: string;
  body: object;
  expectStatus?: number;
}

export interface GetRequestAttributes {
  expectStatus?: number;
}

export interface GetSingleRequestAttributes extends GetRequestAttributes {
  id?: string;
}

export class RequestUtil {
  /**
   * Creates a cookie array with authorization.
   *
   * @returns string[] An array of cookies containing JWT's.
   */
  static signIn() {
    // Build a JWT payload. { id, email }
    const payload = {
      id: generateValidMongoId(),
      email: 'test@test.com',
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON.
    const sessionJson = JSON.stringify(session);

    // Take JSON, and encode it as base64.
    const base64 = Buffer.from(sessionJson).toString('base64');

    // Return a string that's the cookie with the encoded data.
    return [`express:sess=${base64}`];
  }

  /**
   * Fires off a create request to ticket microservice.
   *
   * @param attributes Attributes for creating a ticket. See {@link CreateRequestAttributes}
   * @returns Response object from the HTTP request.
   */
  static async createNewTicketRequest(attributes: CreateRequestAttributes) {
    let cookie;

    if (attributes.generateCookie) {
      cookie = RequestUtil.signIn();
    }

    if (attributes.providedCookie) {
      cookie = attributes.providedCookie;
    }

    if (cookie) {
      if (!attributes.expectStatus) {
        return await request(app)
          .post(basePath)
          .set('Cookie', cookie)
          .send(attributes.body);
      }

      return await request(app)
        .post(basePath)
        .set('Cookie', cookie)
        .send(attributes.body)
        .expect(attributes.expectStatus);
    }

    if (!attributes.expectStatus) {
      return await request(app).post(basePath).send(attributes.body);
    }

    return await request(app)
      .post(basePath)
      .send(attributes.body)
      .expect(attributes.expectStatus);
  }

  /**
   * Fires off a get request for a single ticket to ticket microservice.
   *
   * @param attributes Attributes for retrieving a ticket. See {@link GetSingleRequestAttributes}
   * @returns Response object from the HTTP request.
   */
  static async getTicketRequest(attributes: GetSingleRequestAttributes) {
    let path;

    if (!attributes.id) {
      const generatedId = generateValidMongoId();
      path = `${basePath}${generatedId}`;
    } else {
      path = `${basePath}${attributes.id}`;
    }

    if (!attributes.expectStatus) {
      return await request(app).get(path).send();
    }

    return await request(app).get(path).send().expect(attributes.expectStatus);
  }

  /**
   * Fires off a get request for all tickets to ticket microservice.
   *
   * @param attributes Attributes for retrieving tickets. See {@link GetRequestAttributes}
   * @returns Response object from the HTTP request.
   */
  static async getTicketsRequest(attributes: GetRequestAttributes) {
    if (!attributes.expectStatus) {
      return await request(app).get(basePath).send();
    }

    return await request(app)
      .get(basePath)
      .send()
      .expect(attributes.expectStatus);
  }

  /**
   * Fires off an update request to ticket microservice.
   *
   * @param attributes Attributes for updating a ticket. See {@link UpdateRequestAttributes}
   * @returns Response object from the HTTP request.
   */
  static async updateTicketRequest(attributes: UpdateRequestAttributes) {
    let path;
    let cookie;

    if (!attributes.id) {
      const generatedId = generateValidMongoId();
      path = `${basePath}${generatedId}`;
    } else {
      path = `${basePath}${attributes.id}`;
    }

    if (attributes.generateCookie) {
      cookie = RequestUtil.signIn();
    }

    if (attributes.providedCookie) {
      cookie = attributes.providedCookie;
    }

    if (cookie) {
      if (!attributes.expectStatus) {
        return await request(app)
          .put(path)
          .set('Cookie', cookie)
          .send(attributes.body);
      }

      return await request(app)
        .put(path)
        .set('Cookie', cookie)
        .send(attributes.body)
        .expect(attributes.expectStatus);
    }

    if (!attributes.expectStatus) {
      return await request(app).put(path).send(attributes.body);
    }

    return await request(app)
      .put(path)
      .send(attributes.body)
      .expect(attributes.expectStatus);
  }
}
