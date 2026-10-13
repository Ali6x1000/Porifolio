import { randomUUID } from 'crypto';
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AGENT_NAME = process.env.LIVEKIT_AGENT_NAME || 'alijr-voice';

export async function POST() {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return NextResponse.json({ error: 'Voice mode is not configured.' }, { status: 503 });
  }

  // A fresh room per call keeps visitors from hearing each other.
  const roomName = `alijr-${randomUUID()}`;
  const identity = `visitor-${randomUUID().slice(0, 8)}`;

  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    name: 'Portfolio visitor',
    ttl: '15m',
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  token.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: AGENT_NAME })],
    emptyTimeout: 60,
    departureTimeout: 10,
  });

  return NextResponse.json(
    { token: await token.toJwt(), serverUrl: LIVEKIT_URL, roomName },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
