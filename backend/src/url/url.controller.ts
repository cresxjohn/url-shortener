import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@ApiTags('urls')
@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @ApiOperation({ summary: 'Create a shortened URL' })
  @ApiResponse({ status: 201, description: 'URL successfully shortened' })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
  async create(@Body() createUrlDto: CreateUrlDto, @Request() req) {
    // Check if user is authenticated by looking for Authorization header
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // User is authenticated, extract user info using JWT guard
      try {
        const token = authHeader.substring(7);
        // For now, we'll create a separate authenticated endpoint
        // This endpoint will remain for anonymous users
      } catch (error) {
        // Token invalid, continue as anonymous
      }
    }

    return this.urlService.createUrl(createUrlDto, userId);
  }

  @Post('authenticated')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a shortened URL (authenticated)' })
  @ApiResponse({ status: 201, description: 'URL successfully shortened' })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
  async createAuthenticated(
    @Body() createUrlDto: CreateUrlDto,
    @Request() req
  ) {
    const userId = req.user.id; // Required - for authenticated users only
    return this.urlService.createUrl(createUrlDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user URLs with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'URLs retrieved successfully' })
  async getUserUrls(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const userId = req.user.id;
    return this.urlService.getUserUrls(userId, +page, +limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get URL details by ID' })
  @ApiResponse({ status: 200, description: 'URL details retrieved' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async getUrlById(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.urlService.getUrlById(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update URL' })
  @ApiResponse({ status: 200, description: 'URL updated successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to update this URL',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.urlService.updateUrl(id, updateUrlDto, userId);
  }

  @Post(':id/reactivate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivate URL with extended expiration' })
  @ApiResponse({ status: 200, description: 'URL reactivated successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to reactivate this URL',
  })
  async reactivate(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.urlService.reactivateUrl(id, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete URL' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to delete this URL',
  })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.urlService.deleteUrl(id, userId);
  }
}
