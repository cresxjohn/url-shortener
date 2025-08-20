import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('urls/:id/stats')
  @ApiOperation({ summary: 'Get URL analytics' })
  @ApiResponse({ status: 200, description: 'URL analytics retrieved' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async getUrlStats(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.analyticsService.getUrlStats(id, userId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get user dashboard analytics' })
  @ApiResponse({ status: 200, description: 'Dashboard analytics retrieved' })
  async getDashboard(@Request() req) {
    const userId = req.user.id;
    return this.analyticsService.getUserStats(userId);
  }
}
