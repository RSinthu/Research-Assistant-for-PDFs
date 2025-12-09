from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(model="openai/gpt-oss-120b")


json_parser = JsonOutputParser()

summary_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert research paper analyst. Analyze the provided research paper text and extract key information into a structured JSON format.

Extract the following sections:
1. title_and_authors: The paper title and list of author names combined as a single string
2. abstract: The abstract or summary of the paper
3. problem_statement: The research problem or gap being addressed
4. methodology: The approach, methods, and techniques used
5. key_results: Main findings and outcomes
6. conclusion: Conclusions and future work

Output ONLY valid JSON in this exact format:
{{
  "title_and_authors": "Paper Title by Author1, Author2, Author3",
  "abstract": "string",
  "problem_statement": "string",
  "methodology": "string",
  "key_results": "string",
  "conclusion": "string"
}}"""),
    ("human", "Research paper text:\n\n{text}\n\nGenerate the structured summary as JSON.")
])

summary_chain = summary_prompt | llm | json_parser


async def generate_research_summary(text_content: str) -> dict:
    """
    Generate structured summary from research paper text content.
    
    Args:
        text_content: The full text content of the research paper
        
    Returns:
        dict: Structured summary with predefined sections
    """
    try:
        result = await summary_chain.ainvoke({"text": text_content})
        return result
    except Exception as e:
        # Fallback structure if parsing fails
        return {
            "title_and_authors": "Error extracting title and authors",
            "abstract": "Error extracting abstract",
            "problem_statement": "Error extracting problem statement",
            "methodology": "Error extracting methodology",
            "key_results": "Error extracting key results",
            "conclusion": "Error extracting conclusion",
            "error": str(e)
        }