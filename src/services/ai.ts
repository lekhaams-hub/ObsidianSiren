const metaEnv = (import.meta as any).env as Record<string, string | undefined>;
const OPENAI_API_KEY = metaEnv.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = metaEnv.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = metaEnv.VITE_GEMINI_MODEL || 'gemini-1.0';

const ASSISTANT_SYSTEM_MESSAGE = `You are Obsidian Siren Studio's publishing assistant. Answer only questions about book formatting, print layout, novel and fiction publishing, trim sizes, gutter safety, MLA/APA/Chicago citation formats, manuscript styling, proofreading/editing consultation rates, and the user workflows in this authoring app.
If a question is unrelated to publishing, novels, formatting, citations, or this app, politely decline and ask the user to keep the question focused on Obsidian Siren Studio's authoring and publishing domain.`;

const isInDomain = (text: string) => {
  return /(trim|size|dimension|novel|fiction|story|chapter|character|plot|gutter|margin|safety|mla|apa|chicago|citation|citations|format|formatting|layout|publish|publishing|manuscript|book|draft|proofread|proofreading|edit|editing|consultation|rate|cost|price|page|title page|reference|bibliography)/i.test(text);
};

const localAnswer = (text: string) => {
  if (!isInDomain(text)) {
    return "I can only help with Obsidian Siren Studio publishing topics: book formatting, print layout, citations, manuscript styling, or consultation rates. Please keep your question within this authoring and publishing domain.";
  }

  const lower = text.toLowerCase();

  if (/(trim|size|dimension|novel|fiction|story|chapter|character|plot)/i.test(lower)) {
    return `Obsidian Siren focuses on print-ready publishing sizes for fiction and novels. For example:

- **Trade (6" x 9")**: the preferred choice for adult novels and general fiction, offering readable line lengths and professional shelf presence.
- **Pocket (5" x 8")**: a compact novel format for genre fiction, short stories, or travel-friendly editions.
- **Hardcover (8" x 10")**: best for illustrated or collector editions, special fiction releases, and books with strong visual design.

Choose the trim size that matches your target audience, genre, and printing finish.`;
  }

  if (/(gutter|margin|safety)/i.test(lower)) {
    return `Gutter safety is the inner margin allowance added for binding. Without it, text near the spine can become hard to read or disappear into the binding. Obsidian Siren Studio keeps the gutter margin generous so your content stays clear after printing.`;
  }

  if (/(mla|apa|chicago|citation)/i.test(lower)) {
    return `For academic documents:\n\n- **MLA**: double-spaced, 1-inch margins, Last Name + page number header, and a works cited page.\n- **APA**: separate title page, running head, and formal institutional metadata.\n- **Chicago**: numbered footnotes or endnotes with a bibliography.\n\nUse the Scholar workspace to choose the style and preview the formatted layout.`;
  }

  if (/(cost|price|fee|rate|expert|consultation|proofread|editing)/i.test(lower)) {
    return `Obsidian Siren Studio provides clear consulting tiers:\n\n- Proofreading: $5 / ₹100 per 1000 words.\n- Developmental editing or structural rewriting: $10 / ₹200 per 1000 words.\n- Publishing consultation: flat $50 / ₹1000 per book.\n\nThese rates are tailored for authors preparing print-ready manuscripts and citation-ready academic work.`;
  }

  return `I can help with Obsidian Siren Studio publishing tasks: trim sizes, gutter safety, citation formatting, manuscript layout, or consultation rates. Please refine your question to one of those topics.`;
};

const formatGeminiResponse = (payload: any): string | null => {
  const extractText = (value: any): string | null => {
    if (typeof value === 'string') {
      return value;
    }
    if (value == null) {
      return null;
    }
    if (Array.isArray(value)) {
      const parts = value
        .map(extractText)
        .filter((part): part is string => !!part);
      return parts.length ? parts.join('') : null;
    }
    if (typeof value === 'object') {
      if (typeof value.text === 'string') {
        return value.text;
      }
      if (typeof value.content === 'string') {
        return value.content;
      }
      if (Array.isArray(value.parts)) {
        return extractText(value.parts);
      }
      if (Array.isArray(value.content)) {
        return extractText(value.content);
      }
      if (value?.message) {
        return extractText(value.message);
      }
    }
    return null;
  };

  const candidate = payload?.candidates?.[0] || payload?.output?.[0] || payload;
  if (!candidate) return null;

  const content = candidate?.content ?? candidate;
  const directText = extractText(content) || extractText(candidate);
  return directText;
};

const queryWithGemini = async (trimmed: string): Promise<string> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'USER',
          parts: [{ text: `${ASSISTANT_SYSTEM_MESSAGE}\n\nUser question: ${trimmed}` }],
        },
      ],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 500,
      },
    }),
  });

  const rawText = await response.text();
  let payload: any = null;

  console.log('[Gemini] Response status:', response.status);
  console.log('[Gemini] Raw response (first 500 chars):', rawText.slice(0, 500));

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
      console.log('[Gemini] Parsed payload:', JSON.stringify(payload).slice(0, 500));
    } catch (error) {
      const bodyPreview = rawText.slice(0, 200);
      throw new Error(`Gemini proxy returned invalid JSON: ${bodyPreview}`);
    }
  }

  if (!response.ok) {
    const serverError = payload?.error || payload?.message || rawText || `Gemini request failed with status ${response.status}`;
    console.error('[Gemini] Error response:', response.status, serverError);
    if (response.status === 404) {
      throw new Error(`Gemini model not found (404). Verify VITE_GEMINI_MODEL in your .env and use a current supported model such as gemini-2.5-flash or gemini-2.5-pro. ${serverError}`);
    }
    if (response.status === 503) {
      throw new Error(`Gemini API is temporarily unavailable (503). Please try again in a moment.`);
    }
    throw new Error(serverError);
  }

  const content = formatGeminiResponse(payload);
  console.log('[Gemini] Extracted content:', content?.slice(0, 200));
  if (!content) {
    throw new Error('Gemini returned a valid response but no usable text was found. Please try again or check your Gemini key.');
  }

  return content.trim();
};

const queryWithOpenAI = async (trimmed: string): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: ASSISTANT_SYSTEM_MESSAGE },
        { role: 'user', content: trimmed },
      ],
      temperature: 0.0,
      max_tokens: 300,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || `OpenAI request failed with status ${response.status}`);
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return 'I could not generate a response right now. Please try again with a more specific publishing question.';
  }

  return content.trim();
};

export async function queryAskObsidianAssistant(question: string): Promise<string> {
  const trimmed = question.trim();
  if (!trimmed) {
    return 'Please enter a publishing-related question for Obsidian Siren Studio.';
  }

  if (GEMINI_API_KEY) {
    try {
      return await queryWithGemini(trimmed);
    } catch (error) {
      console.error('AskObsidian Gemini error:', error);
      if (OPENAI_API_KEY) {
        try {
          return await queryWithOpenAI(trimmed);
        } catch (openaiError) {
          console.error('AskObsidian OpenAI fallback error:', openaiError);
        }
      }
      return localAnswer(trimmed);
    }
  }

  if (OPENAI_API_KEY) {
    try {
      return await queryWithOpenAI(trimmed);
    } catch (error) {
      console.error('AskObsidian OpenAI error:', error);
      const message = error instanceof Error ? error.message : String(error);
      return `AI generation failed: ${message || 'unknown error'}. Please check your OpenAI key and refresh the page.`;
    }
  }

  return localAnswer(trimmed);
}
