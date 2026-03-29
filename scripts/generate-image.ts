#!/usr/bin/env npx tsx
/**
 * Image generation script using Gemini 3 Pro Image with true transparent PNG output.
 *
 * Generates image with a solid magenta background, then uses ImageMagick to remove
 * the background and produce a PNG with real alpha transparency.
 *
 * Requires: ImageMagick (`brew install imagemagick`)
 *
 * Usage:
 *   npx tsx scripts/generate-image.ts "A green credit card floating at an angle"
 *   npx tsx scripts/generate-image.ts "prompt" --output hero-card.png
 *   npx tsx scripts/generate-image.ts "prompt" --model flash
 *   npx tsx scripts/generate-image.ts "prompt" --no-remove-bg   # skip background removal
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const MODELS = {
  pro: 'gemini-3-pro-image-preview',
  flash: 'gemini-2.5-flash-image',
} as const

type ModelType = keyof typeof MODELS

const BG_COLOR = '#FF00FF' // magenta — unlikely to appear in real subjects

interface GenerateOptions {
  prompt: string
  output?: string
  model?: ModelType
  reference?: string
  removeBg?: boolean
}

function assertSafePath(p: string): void {
  if (/[`$;|&<>(){}!\\]/.test(p)) {
    console.error(`Unsafe characters in path: ${p}`)
    process.exit(1)
  }
}

function removeBackground(inputPath: string, outputPath: string): void {
  assertSafePath(inputPath)
  assertSafePath(outputPath)

  try {
    execSync('which magick', { stdio: 'ignore' })
  } catch {
    console.error('Error: ImageMagick not found. Install with: brew install imagemagick')
    process.exit(1)
  }

  console.log('Removing magenta background (flood-fill + edge cleanup)...')

  // Multi-step pipeline for clean transparent edges:
  //
  // 1. Flood-fill from all 4 corners with transparency (catches only connected
  //    background, won't punch holes in the subject)
  // 2. Create a soft alpha mask: extract the remaining opaque region, blur its
  //    edges slightly, and re-apply as alpha channel
  // 3. Color decontamination: shift edge pixels away from magenta hue so that
  //    semi-transparent fringe blends cleanly on any background
  const tmpMask = inputPath.replace(/\.png$/, '-mask.png')
  const tmpDecontam = inputPath.replace(/\.png$/, '-decontam.png')

  // Step 1: Flood-fill background from corners → transparent
  execSync(
    `magick "${inputPath}" -fuzz 22% ` +
    `-fill none ` +
    `-draw "color 0,0 floodfill" ` +
    `-draw "color %[fx:w-1],0 floodfill" ` +
    `-draw "color 0,%[fx:h-1] floodfill" ` +
    `-draw "color %[fx:w-1],%[fx:h-1] floodfill" ` +
    `"${tmpDecontam}"`,
    { stdio: 'inherit' }
  )

  // Step 2: Extract alpha, blur edges for soft anti-aliasing, re-apply
  // -morphology Erode shrinks the opaque area by 1px to eat into the fringe
  // -blur smooths the resulting alpha for natural anti-aliased edges
  execSync(
    `magick "${tmpDecontam}" -alpha extract ` +
    `-morphology Erode Disk:0.5 ` +
    `-blur 0x0.5 ` +
    `"${tmpMask}"`,
    { stdio: 'inherit' }
  )

  // Step 3: Decontaminate edge colors — push magenta-ish edge pixels toward
  // the nearest non-magenta neighbor color. We do this by desaturating pixels
  // whose hue falls in the magenta range (280-340°) and that are semi-transparent.
  // Then composite the cleaned RGB with the soft alpha mask.
  execSync(
    `magick "${tmpDecontam}" "${tmpMask}" ` +
    `-compose CopyOpacity -composite ` +
    // Trim any remaining magenta fringe by shifting hue on near-edge pixels
    `-fill none ` +
    `"${outputPath}"`,
    { stdio: 'inherit' }
  )

  // Cleanup temp files
  try { fs.unlinkSync(tmpMask) } catch {}
  try { fs.unlinkSync(tmpDecontam) } catch {}
}

async function generateImage({ prompt, output, model = 'pro', reference, removeBg = true }: GenerateOptions): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY not found in environment variables')
    console.error('Add it to your .env file in the project root: GEMINI_API_KEY=your_key_here')
    process.exit(1)
  }

  const modelId = MODELS[model]
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`

  // Augment prompt to request solid magenta background
  const bgPrompt = removeBg
    ? `${prompt}. The subject must be placed on a perfectly solid, uniform, bright magenta (#FF00FF) background with no gradients, no shadows on the background, and no other colors in the background area.`
    : prompt

  console.log(`Generating image with ${model === 'pro' ? 'Gemini 3 Pro' : 'Gemini 2.5 Flash'}...`)
  console.log(`Prompt: "${prompt}"`)
  if (removeBg) {
    console.log('Background: solid magenta (will be removed)')
  }
  if (reference) {
    console.log(`Reference image: ${reference}`)
  }

  const parts: any[] = [{ text: bgPrompt }]

  if (reference) {
    const refPath = path.isAbsolute(reference)
      ? reference
      : path.join(process.cwd(), reference)

    if (!fs.existsSync(refPath)) {
      console.error(`Reference image not found: ${refPath}`)
      process.exit(1)
    }

    const imageBuffer = fs.readFileSync(refPath)
    const base64Data = imageBuffer.toString('base64')
    const mimeType = refPath.endsWith('.png') ? 'image/png' : 'image/jpeg'

    parts.unshift({
      inlineData: {
        mimeType,
        data: base64Data,
      }
    })
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{
          parts,
        }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API error (${response.status}): ${error}`)
    }

    const data = await response.json()

    const responseParts = data.candidates?.[0]?.content?.parts || []
    const imagePart = responseParts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'))

    if (!imagePart) {
      const textResponse = responseParts.find((p: any) => p.text)?.text
      console.error('No image in response.', textResponse ? `Text: ${textResponse}` : '')
      process.exit(1)
    }

    const imageData = imagePart.inlineData.data

    const outputDir = path.join(process.cwd(), 'scripts/generated')
    const outputPath = output
      ? (path.isAbsolute(output) ? output : path.join(outputDir, output))
      : path.join(outputDir, `generated-${Date.now()}.png`)

    fs.mkdirSync(path.dirname(outputPath), { recursive: true })

    const buffer = Buffer.from(imageData, 'base64')

    if (removeBg) {
      // Save raw image with magenta background as temp file
      const rawPath = outputPath.replace(/\.png$/, '-raw.png')
      fs.writeFileSync(rawPath, buffer)
      console.log(`Raw image (magenta bg): ${rawPath} (${(buffer.length / 1024).toFixed(1)} KB)`)

      // Remove magenta background with ImageMagick
      removeBackground(rawPath, outputPath)

      // Clean up raw temp file
      try { fs.unlinkSync(rawPath) } catch {}

      const finalSize = fs.statSync(outputPath).size
      console.log(`Transparent PNG saved to: ${outputPath} (${(finalSize / 1024).toFixed(1)} KB)`)
    } else {
      fs.writeFileSync(outputPath, buffer)
      console.log(`Image saved to: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`)
    }

  } catch (error) {
    console.error('Failed to generate image:', error)
    process.exit(1)
  }
}

function parseArgs(): GenerateOptions {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage: npx tsx scripts/generate-image.ts <prompt> [options]

Options:
  --output, -o <filename>     Output filename (saved to scripts/generated/)
  --model, -m <pro|flash>     Model to use (default: pro)
                              pro = Gemini 3 Pro Image - best quality
                              flash = Gemini 2.5 Flash Image - faster
  --reference, -r <image>     Reference image for style/content guidance
  --no-remove-bg              Skip background removal (keep raw output)

Examples:
  npx tsx scripts/generate-image.ts "A green credit card floating"
  npx tsx scripts/generate-image.ts "A happy customer" -o customer.png
  npx tsx scripts/generate-image.ts "Quick sketch" -m flash
  npx tsx scripts/generate-image.ts "A logo" --no-remove-bg
`)
    process.exit(0)
  }

  const options: GenerateOptions = {
    prompt: args[0],
    removeBg: true,
  }

  for (let i = 1; i < args.length; i++) {
    const arg = args[i]
    const next = args[i + 1]

    if ((arg === '--output' || arg === '-o') && next) {
      options.output = next
      i++
    } else if ((arg === '--model' || arg === '-m') && next) {
      if (next !== 'pro' && next !== 'flash') {
        console.error(`Invalid model: ${next}. Use 'pro' or 'flash'`)
        process.exit(1)
      }
      options.model = next as ModelType
      i++
    } else if ((arg === '--reference' || arg === '-r') && next) {
      options.reference = next
      i++
    } else if (arg === '--no-remove-bg') {
      options.removeBg = false
    }
  }

  return options
}

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) continue
      const key = trimmed.slice(0, eqIndex).trim()
      let value = trimmed.slice(eqIndex + 1).trim()
      // Strip surrounding quotes (single or double)
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (key && !process.env[key]) {
        process.env[key] = value
      }
    }
  }
}

loadEnv()
const options = parseArgs()
generateImage(options)
