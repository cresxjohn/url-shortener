import { NextRequest, NextResponse } from 'next/server';
import { RedirectService } from '@/lib/services/redirect';

interface Context {
  params: { shortCode: string };
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    // In Next.js 14+, params is a Promise
    const resolvedParams = await params;
    const redirectService = new RedirectService();
    const longUrl = await redirectService.redirect(resolvedParams.shortCode, request);
    
    // Return a 302 redirect
    return NextResponse.redirect(longUrl, { status: 302 });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'URL not found' ||
        error.message === 'URL has been deactivated' ||
        error.message === 'URL has expired'
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }
    
    console.error('Redirect error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
