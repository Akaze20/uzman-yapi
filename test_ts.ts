import { UIMessage } from 'ai';
const m: UIMessage = { role: 'user', id: '1', parts: [{ type: 'text', text: 'hi' }] };
console.log(m.parts[0].text);
