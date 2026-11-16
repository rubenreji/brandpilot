import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    let pageCount = 1;

    if (filename.toLowerCase().endsWith('.docx')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value ? result.value.trim() : '';
      const words = extractedText.split(/\s+/).filter(Boolean).length;
      pageCount = Math.max(1, Math.ceil(words / 300));
    } else if (filename.toLowerCase().endsWith('.pdf')) {
      const pdfParseModule = await import('pdf-parse');
      const { PDFParse } = pdfParseModule;
      if (PDFParse) {
        const parser = new PDFParse({ data: buffer });
        const res = await parser.getText();
        extractedText = res && res.text ? res.text.trim() : '';
        pageCount = (parser as any).doc?.numPages || Math.max(1, Math.ceil(extractedText.split(/\s+/).length / 300));
        await parser.destroy();
      }
    } else {
      // txt, md, or other text formats
      extractedText = buffer.toString('utf-8').trim();
      const words = extractedText.split(/\s+/).filter(Boolean).length;
      pageCount = Math.max(1, Math.ceil(words / 300));
    }

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      success: true,
      filename,
      page_count: pageCount,
      word_count: wordCount,
      character_count: extractedText.length,
      text: extractedText
    });
  } catch (error: any) {
    console.error('Multi-page extraction error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to extract text from multi-page document' },
      { status: 500 }
    );
  }
}
