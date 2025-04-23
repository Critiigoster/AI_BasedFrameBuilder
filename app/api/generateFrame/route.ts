import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import * as Sentry from '@sentry/nextjs'
import logger from '../../utils/logger'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      logger.warn('Empty query received')
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    logger.info('Generating frame for query', { query })

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates detailed frame descriptions based on shoot briefs. Provide clear, technical details about camera angles, lighting, composition, and other relevant aspects."
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "gpt-4-turbo-preview",
    })

    const result = completion.choices[0].message.content
    logger.info('Frame generated successfully', { result })

    return NextResponse.json({ result })
  } catch (error) {
    logger.error('Error generating frame', { error })
    Sentry.captureException(error)
    
    return NextResponse.json(
      { error: 'Failed to generate frame' },
      { status: 500 }
    )
  }
} 