import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // Hybrid Upload Logic:
    // If Supabase environment variables are configured, upload directly to Supabase Storage.
    // Otherwise, fall back to local file storage (perfect for zero-config local development).
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      console.log('Supabase storage credentials found. Uploading to Supabase Storage...');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const bucketName = 'project-images';

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filename, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return NextResponse.json({ error: `Supabase upload failed: ${error.message}` }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);

      const fileUrl = publicUrlData.publicUrl;
      console.log('Uploaded to Supabase Storage successfully. URL:', fileUrl);
      return NextResponse.json({ url: fileUrl });
    } else {
      console.log('No Supabase credentials found. Falling back to local disk storage...');
      const uploadDir = join(process.cwd(), 'uploads');
      
      // Ensure local upload directory exists
      await mkdir(uploadDir, { recursive: true });

      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const fileUrl = `/api/uploads/${filename}`;
      return NextResponse.json({ url: fileUrl });
    }
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
