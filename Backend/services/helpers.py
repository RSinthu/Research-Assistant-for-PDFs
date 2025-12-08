import fitz

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text content from PDF file with error handling"""
    try:
        doc = fitz.open(pdf_path)
        full_text = ""
        
        for page_num, page in enumerate(doc):
            try:
                text = page.get_text()
                full_text += f"\n--- Page {page_num + 1} ---\n{text}"
            except Exception as e:
                print(f"Error extracting page {page_num + 1}: {str(e)}")
                continue
        
        doc.close()
        return full_text.strip()
        
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")