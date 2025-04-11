// src/ai/flows/generate-poem.ts
'use server';

/**
 * @fileOverview Generates a poem based on an image and its analysis.
 *
 * - generatePoem - A function that generates a poem based on the image analysis.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GeneratePoemInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the photo to analyze.'),
  photoAnalysis: z
    .string()
    .describe('The AI analysis of the photo, including key objects, scenes, and emotions.'),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('The generated poem based on the photo analysis.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const poemPrompt = ai.definePrompt({
  name: 'poemPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the photo.'),
      photoAnalysis: z
        .string()
        .describe('The AI analysis of the photo, including key objects, scenes, and emotions.'),
    }),
  },
  output: {
    schema: z.object({
      poem: z.string().describe('A poem inspired by the photo analysis.'),
    }),
  },
  prompt: `You are a poet laureate.  Given the following analysis of a photo, write a short poem that captures the essence and emotions of the image.

Photo Analysis: {{{photoAnalysis}}}

Write a poem that evokes the emotions of the photo analysis. The poem should not exceed 20 lines.
`,
});

const generatePoemFlow = ai.defineFlow<
  typeof GeneratePoemInputSchema,
  typeof GeneratePoemOutputSchema
>(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    const {output} = await poemPrompt(input);
    return output!;
  }
);
