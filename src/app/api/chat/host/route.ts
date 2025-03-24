import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const partykitHost = process.env.PARTYKIT_HOST;

	if (!partykitHost) {
		return NextResponse.json({ error: 'PARTYKIT_HOST is not set' }, { status: 500 });
	}

	return NextResponse.json({ host: partykitHost });
}
