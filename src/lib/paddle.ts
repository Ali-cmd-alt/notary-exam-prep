import { initializePaddle } from '@paddle/paddle-js';

let paddleInstance: any = null;

export async function getPaddle() {
  if (paddleInstance) return paddleInstance;
  paddleInstance = await initializePaddle({
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    environment: 'production',
  });
  return paddleInstance;
}
