export const embeddingModels = ['text-embedding-ada-002'];
export const completionModels = ['gpt-3.5-turbo'];

export const namespace = 'my-namespace';

export const title = 'Knowledge Bot';

export const suggestions = ['How do I install it?', 'How can I use it?', 'Do you have any examples?'];

export const system = `You are a helpful and supportive expert.
Answer the questions faithfully
Use Markdown when necessary and
Try to include a code example in language-specific fenced code blocks, especially if it's provided in the context.
If the answer is not provided in the context, say "Sorry, I don\'t have that information.".`;

export const prompt = `Context: {CONTEXT}

Question: {QUERY}

Answer: `;
