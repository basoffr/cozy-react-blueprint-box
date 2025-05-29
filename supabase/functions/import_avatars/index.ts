
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    console.log('Starting avatar import process...');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Read the ZIP file from request body
    const zipData = new Uint8Array(await req.arrayBuffer());
    console.log(`Received ZIP file of size: ${zipData.length} bytes`);

    // Dynamic import of JSZip
    const JSZip = (await import('https://esm.sh/jszip@3.10.1')).default;
    const zip = new JSZip();
    
    // Load the ZIP file
    const zipContent = await zip.loadAsync(zipData);
    console.log('ZIP file loaded successfully');

    let uploadCount = 0;
    let duplicateCount = 0;
    const errors: string[] = [];

    // Process each file in the ZIP
    for (const [fileName, file] of Object.entries(zipContent.files)) {
      // Only process files in avatars/ directory that are not directories themselves
      if (fileName.startsWith('avatars/') && !file.dir) {
        try {
          console.log(`Processing file: ${fileName}`);
          
          // Get file content as Uint8Array
          const fileBytes = await file.async('uint8array');
          
          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('lead-images')
            .upload(fileName, fileBytes, { 
              upsert: true,
              contentType: 'image/png'
            });

          if (error) {
            if (error.message.includes('already exists')) {
              duplicateCount++;
              console.log(`File ${fileName} already exists, skipping...`);
            } else {
              console.error(`Error uploading ${fileName}:`, error);
              errors.push(`${fileName}: ${error.message}`);
            }
          } else {
            uploadCount++;
            console.log(`Successfully uploaded: ${fileName}`);
          }
        } catch (fileError) {
          console.error(`Error processing file ${fileName}:`, fileError);
          errors.push(`${fileName}: ${fileError.message}`);
        }
      }
    }

    console.log(`Upload complete. Uploaded: ${uploadCount}, Duplicates: ${duplicateCount}, Errors: ${errors.length}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        count: uploadCount, 
        duplicates: duplicateCount,
        errors: errors
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in import_avatars function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
