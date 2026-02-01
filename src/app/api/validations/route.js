import { NextResponse } from 'next/server';
import { getValidations, getValidation } from '@/lib/services/storage';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const validation = await getValidation(id);
      if (!validation) {
        return NextResponse.json({ error: 'Validation not found' }, { status: 404 });
      }
      return NextResponse.json({ validation });
    }

    const validations = await getValidations();
    return NextResponse.json({ validations });
  } catch (error) {
    console.error('Get validations error:', error);
    return NextResponse.json(
      { error: 'Failed to get validations' },
      { status: 500 }
    );
  }
}
