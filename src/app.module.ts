import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';
import { config } from './config/config';
import { LoggerModule } from 'nestjs-pino';
import { PatientModule } from './module/patient/patient.module';
import { DoctorModule } from './module/doctor/doctor.module';
import { AppointmentModule } from './module/appoinment/appointment.module';
import { MedicationModule } from './module/medication/medication.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
      csrfPrevention: false,
      playground: true,
      typePaths: ['./**/*.graphql'],
      path: '/graphql',
    }),
    PatientModule,
    DoctorModule,
    AppointmentModule,
    MedicationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
