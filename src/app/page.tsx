"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { analyzePhoto } from "@/ai/flows/analyze-photo";
import { generatePoem } from "@/ai/flows/generate-poem";
import { Share2, Save, Loader2, WarningTriangle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TagProps {
  tags: string[];
}

const Tag: React.FC<{ tag: string }> = ({ tag }) => (
  <span className="inline-flex items-center rounded-full bg-secondary px-3 py-0.5 text-sm font-medium text-secondary-foreground">
    {tag}
  </span>
);

const TaggedImage: React.FC<{ imageUrl: string; tags: string[] }> = ({ imageUrl, tags }) => (
  <div className="relative">
    <img
      src={imageUrl}
      alt="Uploaded"
      className="max-w-full h-auto rounded-md shadow-md"
    />
    <div className="absolute bottom-0 left-0 p-2 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  </div>
);

const formSchema = z.object({
  photoUrl: z.string().min(1, {
    message: "Photo URL is required.",
  }),
  photoAnalysis: z.string(),
  poem: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photoUrl: "",
      photoAnalysis: "",
      poem: "",
    },
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormError("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      form.setValue("photoUrl", imageUrl);
      setUploadedImage(imageUrl);
      setFormError(null);
    };
    reader.onerror = () => {
       setFormError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

   const handleClearImage = () => {
    setUploadedImage(null);
    form.setValue("photoUrl", "");
    setTags([]);
    form.setValue("photoAnalysis", "");
    form.setValue("poem", "");
    setFormError(null);
  };

  const handleAnalyzePhoto = async () => {
     if (!form.getValues("photoUrl")) {
        setFormError("Please upload a photo first.");
       return;
     }

    setIsAnalyzing(true);
    setFormError(null);
    try {
      const analysisResult = await analyzePhoto({ photoUrl: form.getValues("photoUrl") });
      form.setValue("photoAnalysis", JSON.stringify(analysisResult, null, 2));
      setTags(analysisResult.objects);
    } catch (error) {
       setFormError("Error analyzing photo. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePoem = async () => {
     if (!form.getValues("photoUrl")) {
        setFormError("Please upload a photo first.");
       return;
     }

    if (!form.getValues("photoUrl") || !form.getValues("photoAnalysis")) {
        setFormError("Please analyze the photo first.");
        return;
    }

    setIsGenerating(true);
    setFormError(null);
    try {
      const poemResult = await generatePoem({
        photoUrl: form.getValues("photoUrl"),
        photoAnalysis: form.getValues("photoAnalysis"),
      });
      form.setValue("poem", poemResult.poem);
    } catch (error) {
       setFormError("Error generating poem. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "Save functionality not implemented yet.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share functionality not implemented yet.",
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) {
        setFormError("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      form.setValue("photoUrl", imageUrl);
      setUploadedImage(imageUrl);
      setFormError(null);
    };
    reader.onerror = () => {
      setFormError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }, [form, toast]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onDrop(Array.from(event.dataTransfer.files));
      event.dataTransfer.clearData();
    }
  };

  return (
    
    <div className="container mx-auto p-4 min-h-screen">
     
      <Card className="w-full max-w-4xl mx-auto bg-base-100 text-base-content shadow-xl rounded">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Photo Poet</CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            Upload a photo and let AI generate a poem.
          </CardDescription>
        </CardHeader>
        <CardContent>
         {formError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
             {form.formState.errors.photoUrl && (
                <div className="mb-4 text-sm text-destructive">
                  {form.formState.errors.photoUrl.message}
                </div>
              )}
          <div className="md:grid md:grid-cols-2 md:gap-4">
            <div className="flex flex-col items-center space-y-4">
              <FormItem>
                <FormLabel className="hidden">Upload Photo</FormLabel>
                <FormControl>
                  <div
                    className="border-2 border-dashed rounded p-4 w-full flex flex-col items-center justify-center cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {uploadedImage ? (
                      <TaggedImage imageUrl={uploadedImage} tags={tags} />
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop an image here or click to upload
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          id="photo-upload"
                        />
                        <label htmlFor="photo-upload">
                          <Button variant="secondary" className="mt-2">
                            Upload Photo!
                          </Button>
                        </label>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
               {uploadedImage && (
                  <Button onClick={handleClearImage} variant="outline">
                    Clear Image
                  </Button>
                )}

              <Button
                onClick={handleAnalyzePhoto}
                className="w-full bg-accent text-black  hover:bg-teal-700"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    Analyzing...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Analyze Photo"
                )}
              </Button>
            </div>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleGeneratePoem}
                className="w-full bg-accent text-black hover:bg-teal-700"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    Generating Poem...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Generate Poem"
                )}
              </Button>
              <FormItem>
                <FormLabel className="hidden">Generated Poem</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Generated Poem"
                    value={form.watch("poem")}
                    readOnly
                    className="resize-none h-40 font-serif"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <Accordion type="single" collapsible>
                <AccordionItem value="analysis">
                  <AccordionTrigger>Photo Analysis</AccordionTrigger>
                  <AccordionContent>
                    <FormItem>
                      <FormLabel className="hidden">Photo Analysis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Photo Analysis"
                          value={form.watch("photoAnalysis")}
                          readOnly
                          className="resize-none h-40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex justify-between">
                <Button onClick={handleSave} variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  </div>
  );
}
