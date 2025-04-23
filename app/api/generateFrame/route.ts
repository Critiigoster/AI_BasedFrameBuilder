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
      logger.warn('Empty query received for image generation')
      return NextResponse.json(
        { error: 'Query (prompt) is required for image generation' },
        { status: 400 }
      )
    }

    logger.info('Generating image for prompt', { query })

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: query,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
      response_format: "url",
    })

    const imageUrl = imageResponse.data[0].url
    logger.info('Image generated successfully', { imageUrl })

    return NextResponse.json({ imageUrl })
  } catch (error) {
    logger.error('Error generating image', { error })
    Sentry.captureException(error)
    
    if (error instanceof OpenAI.APIError) {
        logger.error('OpenAI API Error details', { 
            status: error.status,
            code: error.code,
            type: error.type,
            message: error.message
        });
        return NextResponse.json(
            { error: `Failed to generate image: ${error.message}` },
            { status: error.status || 500 }
        );
    }

    return NextResponse.json(
      { error: 'Failed to generate image due to an internal server error' },
      { status: 500 }
    )
  }
} 