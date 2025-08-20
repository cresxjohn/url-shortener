import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UrlModule } from './url/url.module';
import { UserModule } from './user/user.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { RedirectModule } from './redirect/redirect.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('THROTTLE_TTL') || 60,
        limit: configService.get('THROTTLE_LIMIT') || 10,
      }),
    }),

    // Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes
    }),

    // Core modules
    PrismaModule,
    AuthModule,
    UrlModule,
    UserModule,
    AnalyticsModule,
    RedirectModule,
  ],
})
export class AppModule {}
