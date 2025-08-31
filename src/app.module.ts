import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    AuthModule, 
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`
      }
    ),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DB_AUTH'),
        entities: [User],
        synchronize: config.get<boolean>('DB_AUTH_SYNC'),
        ssl: {
          rejectUnauthorized: false
        }
      })
    })
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
