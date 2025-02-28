
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AIImageGeneration = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Mock function to simulate AI image generation
  // In a real app, this would call an API endpoint connected to an AI service
  const generateImage = async (promptText: string) => {
    setGenerating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we're using a placeholder image
      // In a real implementation, this would be the URL returned from your AI service
      const demoImageUrl = "https://source.unsplash.com/random/512x512/?"+encodeURIComponent(promptText);
      setGeneratedImage(demoImageUrl);
      
      // Log the generation in transaction history
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('ai_generations').insert({
          user_id: user.id,
          prompt: promptText,
          type: 'image_generation',
          result_url: demoImageUrl,
        }).maybeSingle();
      }
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    await generateImage(prompt);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
      {/* Top Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <span className="text-xl font-bold">AI Image Generation</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Prompt input */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Generate an Image</h2>
            <p className="text-muted-foreground mb-6">
              Enter a detailed description of the image you want to generate.
              The more specific your prompt, the better the results.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="E.g., A serene lake surrounded by mountains at sunset with reflections in the water"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-20"
                  disabled={generating}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={generating || !prompt.trim()}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </form>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Tips for better results:</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Be specific about the subject, setting, and style</li>
                <li>Mention lighting, angle, and mood</li>
                <li>Include artistic references if you have a specific style in mind</li>
                <li>Specify what you don't want in the image</li>
              </ul>
            </div>
          </Card>

          {/* Right side - Generated image */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Generated Image</h2>
            <CardContent className="flex flex-col items-center justify-center p-0">
              {generating ? (
                <div className="w-full aspect-square flex items-center justify-center bg-muted rounded-md">
                  <div className="text-center">
                    <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">
                      Creating your masterpiece...
                    </p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full space-y-4">
                  <div className="relative aspect-square rounded-md overflow-hidden border">
                    <img
                      src={generatedImage}
                      alt="AI generated image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-muted rounded-md">
                  <p className="text-muted-foreground text-center px-8">
                    Your generated image will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIImageGeneration;
