import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { MedicationService } from '../../medication.service';

const mockDate = new Date('2024-08-16T22:38:38.942Z');
const mockMedicationResponse = {
  medication: {
    id: '1',
    patientId: '28402215-9435-4e78-aa3c-c47c41051716',
    name: 'testing',
    dosage: 'testing',
    frequency: 'testing',
    createdAt: mockDate.toISOString(),
    updatedAt: mockDate.toISOString(),
  },
  history: {
    id: '2',
    patientId: '28402215-9435-4e78-aa3c-c47c41051716',
    condition: 'Bagus',
    diagnosisDate: new Date('2024-08-20').toISOString(),
    status: 'DONE',
    createdAt: mockDate.toISOString(),
    updatedAt: mockDate.toISOString(),
  },
};

describe('MedicationResolver (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime());

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MedicationService)
      .useValue({
        create: jest.fn().mockResolvedValue(mockMedicationResponse),
        detailMedication: jest.fn().mockResolvedValue(mockMedicationResponse.medication),
        detailMedicalHistory: jest.fn().mockResolvedValue(mockMedicationResponse.history),
        listMedicalHistory: jest.fn().mockResolvedValue({
          items: [mockMedicationResponse.medication],
          total: 1,
        }),
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('should create a medication and return the correct response', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createMedication(
              input: {
                patientId: "28402215-9435-4e78-aa3c-c47c41051716"
                medication: {
                  name: "testing"
                  dosage: "testing"
                  frequency: "testing"
                }
                history: {
                  condition: "Bagus"
                  diagnosisDate: "2024-08-20"
                  status: "DONE"
                }
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
        createMedication: {
          meta: {
            code: 200,
            success: true,
            message: 'Success',
          }
        },
      },
    });
  });

  it('should detaol a medication and return the correct response', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createMedication(
              input: {
                patientId: "28402215-9435-4e78-aa3c-c47c41051716"
                medication: {
                  name: "testing"
                  dosage: "testing"
                  frequency: "testing"
                }
                history: {
                  condition: "Bagus"
                  diagnosisDate: "2024-08-20"
                  status: "DONE"
                }
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
        createMedication: {
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
