// File Upload Handler Edge Function
// Secure file upload with validation and storage

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const formId = formData.get('formId') as string;
    const fieldId = formData.get('fieldId') as string;

    if (!file || !formId || !fieldId) {
      throw new Error('Missing required parameters');
    }

    // File validation
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${formId}/${fieldId}/${timestamp}_${randomString}.${fileExtension}`;

    // Create upload URL (in real implementation, you'd use Supabase storage)
    const uploadUrl = `https://your-supabase-project.supabase.co/storage/v1/object/formforge-uploads/${fileName}`;
    
    // Simulate file upload (in real implementation, you'd upload to Supabase storage)
    const uploadResponse = {
      success: true,
      url: uploadUrl,
      fileName: fileName,
      size: file.size,
      type: file.type,
      originalName: file.name
    };

    return new Response(JSON.stringify({ data: uploadResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorResponse = {
      error: {
        code: 'UPLOAD_ERROR',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});