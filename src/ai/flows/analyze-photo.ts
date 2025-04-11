// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use server';

/**
 * @fileOverview Analyzes a photo to identify key elements like objects, scenes, and emotions.
 *
 * - analyzePhoto - A function that handles the photo analysis process.
 * - AnalyzePhotoInput - The input type for the analyzePhoto function.
 * - AnalyzePhotoOutput - The return type for the analyzePhoto function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzePhotoInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the photo to analyze.'),
});
export type AnalyzePhotoInput = z.infer<typeof AnalyzePhotoInputSchema>;

const AnalyzePhotoOutputSchema = z.object({
  objects: z.array(z.string()).describe('Key objects identified in the photo.'),
  scenes: z.array(z.string()).describe('Key scenes identified in the photo.'),
  emotions: z.array(z.string()).describe('Emotions detected in the photo.'),
  description: z.string().describe('A detailed description of the photo.'),
});
export type AnalyzePhotoOutput = z.infer<typeof AnalyzePhotoOutputSchema>;

export async function analyzePhoto(input: AnalyzePhotoInput): Promise<AnalyzePhotoOutput> {
  return analyzePhotoFlow(input);
}

const analyzePhotoPrompt = ai.definePrompt({
  name: 'analyzePhotoPrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the photo to analyze.'),
    }),
  },
  output: {
    schema: z.object({
      objects: z.array(z.string()).describe('Key objects identified in the photo.'),
      scenes: z.array(z.string()).describe('Key scenes identified in the photo.'),
      emotions: z.array(z.string()).describe('Emotions detected in the photo.'),
      description: z.string().describe('A detailed description of the photo.'),
    }),
  },
  prompt: `You are an AI expert in understanding photos.

Analyze the photo at the given URL and identify the key objects, scenes, and emotions present in the photo.

Provide a detailed description of the photo, including the identified objects, scenes, and emotions.

Photo URL: {{photoUrl}}`,
});

const analyzePhotoFlow = ai.defineFlow<
  typeof AnalyzePhotoInputSchema,
  typeof AnalyzePhotoOutputSchema
>({
  name: 'analyzePhotoFlow',
  inputSchema: AnalyzePhotoInputSchema,
  outputSchema: AnalyzePhotoOutputSchema,
}, async input => {
  const {output} = await analyzePhotoPrompt(input);
  return output!;
});

