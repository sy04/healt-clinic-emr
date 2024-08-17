import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AppointmentService } from '../../appointment.service';

// Mock data for the tests
const mockDate = new Date('2024-08-16T22:38:38.942Z');
const mockAppointmentResponse = {
  appointment: {
    id: '1',
    patientId: '28402215-9435-4e78-aa3c-c47c41051716',
    doctorId: 'd17cfbe5-9a7e-4d3a-8d56-6fd7a256d5f4',
    date: mockDate.toISOString(),
  },
};

describe('AppointmentResolver (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime());

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppointmentService)
      .useValue({
        create: jest.fn().mockResolvedValue(mockAppointmentResponse.appointment),
        detail: jest.fn().mockResolvedValue(mockAppointmentResponse.appointment),
        update: jest.fn().mockResolvedValue(mockAppointmentResponse.appointment),
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('should create an appointment and return the correct response', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createAppointment(
              input: {
                patientId: "28402215-9435-4e78-aa3c-c47c41051716"
                doctorId: "d17cfbe5-9a7e-4d3a-8d56-6fd7a256d5f4"
                date: "2024-08-16T22:38:38.942Z"
              }
            ) {
              meta {
                code
                success
                message
              }
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        createAppointment: {
          meta: {
            code: 200,
            success: true,
            message: 'Success',
          }
        },
      },
    });
  });

  it('should retrieve an appointment and return the correct response', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            getAppointment(id: "1") {
              meta {
                code
                success
                message
              }
              data {
                id
                patientId
                doctorId
                date
              }
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        getAppointment: {
          meta: {
            code: 200,
            success: true,
            message: 'Success',
          },
          data: mockAppointmentResponse.appointment,
        },
      },
    });
  });

  it('should update an appointment and return the correct response', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            updateAppointment(
              id: "1"
              input: {
                date: "2024-08-16T22:38:38.942Z"
              }
            ) {
              meta {
                code
                success
                message
              }
            }
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        updateAppointment: {
          meta: {
            code: 200,
            success: true,
            message: 'Success',
          }
        },
      },
    });
  });
});
