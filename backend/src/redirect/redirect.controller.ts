import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RedirectService } from './redirect.service';

@ApiTags('redirect')
@Controller()
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redirect to original URL' })
  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
    @Req() req: any
  ) {
    const longUrl = await this.redirectService.redirect(shortCode, req);
    return res.redirect(302, longUrl);
  }
}
