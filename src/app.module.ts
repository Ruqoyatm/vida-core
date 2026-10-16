import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedactInterceptor } from './common/redact.interceptor.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RolesModule } from './roles/roles.module.js';
import { PatientsModule } from './patients/patients.module.js';
import { EncountersModule } from './encounters/encounters.module.js';
import { VitalsModule } from './vitals/vitals.module.js';
import { ClinicalModule } from './clinical/clinical.module.js';
import { DiagnosesModule } from './diagnoses/diagnoses.module.js';
import { ServicesModule } from './services/services.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { AnalytesModule } from './analytes/analytes.module.js';
import { ResultsModule } from './results/results.module.js';
import { ProductsModule } from './products/products.module.js';
import { PrescriptionsModule } from './prescriptions/prescriptions.module.js';
import { AuditModule } from './audit/audit.module.js';
import { AdminModule } from './admin/admin.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    PatientsModule,
    EncountersModule,
    VitalsModule,
    ClinicalModule,
    DiagnosesModule,
    ServicesModule,
    OrdersModule,
    AnalytesModule,
    ResultsModule,
    ProductsModule,
    PrescriptionsModule,
    AuditModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RedactInterceptor,
    },
  ],
})
export class AppModule {}