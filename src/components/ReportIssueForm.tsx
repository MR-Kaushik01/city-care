import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, MapPin, Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  category: z.enum(["pothole", "garbage", "streetlight", "drainage", "other"]),
  address: z.string().min(10, "Please provide a detailed address"),
  location_lat: z.number().min(-90).max(90),
  location_lng: z.number().min(-180).max(180),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const ReportIssueForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "other",
      address: "",
      location_lat: 0,
      location_lng: 0,
      email: "",
    },
  });

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("location_lat", position.coords.latitude);
          form.setValue("location_lng", position.coords.longitude);
          toast.success("Location captured successfully");
        },
        (error) => {
          toast.error("Unable to get location. Please enter manually.");
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPG, PNG, GIF, or WebP)");
        e.target.value = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        e.target.value = '';
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!imageFile) {
      toast.error("Photo is required! Please upload a photo of the issue.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("issue-images")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("issue-images")
        .getPublicUrl(fileName);

      // Insert issue with email
      const { data: insertedData, error } = await supabase
        .from("issues")
        .insert([{
          title: data.title,
          description: data.description,
          category: data.category,
          address: data.address,
          location_lat: data.location_lat,
          location_lng: data.location_lng,
          image_url: publicUrl,
          email: data.email || null,
        }])
        .select('display_id')
        .single();

      if (error) throw error;

      toast.success(`Issue reported successfully! Your complaint ID is: ${insertedData.display_id}. ${data.email ? 'You will receive status updates via email.' : ''}`);
      form.reset();
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast.error("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="gradient-card shadow-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl">Report a Civic Issue</CardTitle>
        <CardDescription>
          Help us improve your community by reporting issues that need attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Large pothole on Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pothole">Pothole</SelectItem>
                      <SelectItem value="garbage">Garbage/Waste</SelectItem>
                      <SelectItem value="streetlight">Streetlight</SelectItem>
                      <SelectItem value="drainage">Drainage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide detailed information about the issue..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location_lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="0.0"
                        {...field}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="0.0"
                        {...field}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="button" variant="outline" onClick={getCurrentLocation} className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              Use Current Location
            </Button>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional - for status updates)</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your.email@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Upload Photo *</FormLabel>
              <p className="text-xs text-muted-foreground">
                Photo is required. Uploaded images will be publicly accessible. Please avoid including sensitive personal information.
              </p>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                  required
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded border"
                  />
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReportIssueForm;
