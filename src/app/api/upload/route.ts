import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    // Basic auth check
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const uniqueFilename = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Use the centralized helper which handles production/local context
    try {
      const { getR2 } = require('@/db');
      const R2 = getR2();
      
      await R2.put(uniqueFilename, buffer, {
        httpMetadata: { contentType: file.type },
      });
      
      const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueFilename}`;
      return NextResponse.json({ url: publicUrl });
    } catch (r2Error) {
      console.warn("R2 upload failed or not available:", r2Error);
      // For local development, if R2 is not bound, return a mock URL
      // This allows the form to at least "work" without a real upload
      return NextResponse.json({ 
        url: `https://mock.url/${uniqueFilename}`,
        warning: "Running in mock mode. R2 is only active on Cloudflare Pages."
      });
    }
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
