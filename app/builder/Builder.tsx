"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Loader2,
  ArrowLeft,
  Mail,
  Copy,
} from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  summary: z
    .string()
    .min(10, "Professional summary must be at least 10 characters"),
  education: z.string().min(1, "Education is required"),
  experience: z.string().min(10, "Experience must be at least 10 characters"),
  skills: z.string().min(1, "Skills are required"),
  languages: z.string().optional(),
  achievements: z.string().optional(),
  targetRole: z.string().min(1, "Target role is required"),
});

const coverLetterSchema = z.object({
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().optional(),
  jobCircular: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;
type CoverLetterData = z.infer<typeof coverLetterSchema>;

interface GeneratedContent {
  professional: string;
  concise: string;
  creative: string;
  coverLetter: string;
  email: string;
}

const CVTemplate = ({ content, title }: { content: string; title: string }) => (
  <div
    id={`cv-${title.toLowerCase()}`}
    className="bg-white min-h-[800px] shadow-lg rounded-lg overflow-hidden"
  >
    <div className="max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

const CoverLetterTemplate = ({ content }: { content: string }) => (
  <div
    id="cover-letter"
    style={{ width: "580px"}}
    className="bg-white min-h-[600px] shadow-lg rounded-lg overflow-hidden p-8"
  >
    <div
      style={{
        textAlign: "justify",
        fontSize: "10.5pt",
        lineHeight: "1.2",
        fontFamily: "Times New Roman, serif"
      }}
      className="max-w-none prose prose-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
);

const EmailTemplate = ({ content }: { content: string }) => (
  <div className="bg-gray-50 p-6 rounded-lg border">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Mail className="mr-2 h-5 w-5" />
        Email Template
      </h3>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ""))
        }
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy Email
      </Button>
    </div>
    <div
      className="text-sm whitespace-pre-wrap font-mono bg-white p-4 rounded border"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
);

export default function Builder() {
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("Generate My CV");
  const [activeTab, setActiveTab] = useState("professional");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      education: "",
      experience: "",
      skills: "",
      languages: "",
      achievements: "",
      targetRole: "",
    },
  });

  const coverLetterForm = useForm<CoverLetterData>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      companyName: "",
      companyAddress: "",
      recruiterName: "",
      recruiterEmail: "",
      jobCircular: "",
    },
  });

  const loadingMessages = [
    "Summoning the AI from its digital cave...",
    "AI is brewing fresh ideas with extra caffeine...",
    "Negotiating with AI over creative differences...",
    "AI accidentally opened 37 Chrome tabs...",
    "Calming AI down after existential crisis...",
    "AI spilled virtual coffee on the data, cleaning up...",
    "Rebooting AI’s sense of humor...",
    "AI wrote poetry instead of code... redirecting focus...",
    "AI arguing with itself about the best answer...",
    "Packing answer with extra sprinkles of intelligence...",
    "AI took a dramatic pause for suspense...",
    "Triple-checking answer to avoid embarrassing typos...",
    "AI proudly submitting its masterpiece...",
    "Unveiling the grand creation just for you...",
  ];

  const loadSampleData = () => {
    form.reset({
      fullName: "Sarah Johnson",
      jobTitle: "Senior Software Engineer",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      summary:
        "Experienced software engineer with 6+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable solutions and mentoring junior developers.",
      education:
        "Bachelor of Science in Computer Science, University of California Berkeley, 2017-2021",
      experience:
        "Senior Software Engineer at TechCorp (2022-Present): Led development of microservices architecture serving 1M+ users, implemented CI/CD pipelines reducing deployment time by 60%, mentored 5 junior developers. Software Engineer at StartupXYZ (2021-2022): Built responsive web applications using React and Node.js, collaborated with cross-functional teams, improved application performance by 40%.",
      skills:
        "JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Kubernetes, PostgreSQL, MongoDB, Git, Agile/Scrum",
      languages: "English (Native), Spanish (Conversational), Mandarin (Basic)",
      achievements:
        "Led team that won internal hackathon for AI-powered analytics tool, Increased code coverage from 45% to 85% across multiple repositories, Published 3 technical articles with 10K+ views, Certified AWS Solutions Architect",
      targetRole: "Senior Full Stack Developer",
    });

    coverLetterForm.reset({
      companyName: "Google",
      companyAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043",
      recruiterName: "John Smith",
      recruiterEmail: "john.smith@google.com",
      jobCircular:
        "We are looking for a Senior Full Stack Developer to join our team. The ideal candidate should have experience with React, Node.js, and cloud technologies. You will be responsible for building scalable web applications and mentoring junior developers.",
    });
  };

  const onSubmit = async (data: FormData) => {
    const coverLetterData = coverLetterForm.getValues();
    setIsGenerating(true);

    let messageIndex = 0;
    const interval = setInterval(() => {
      setLoadingText(loadingMessages[messageIndex]);
      messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 3000);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          ...coverLetterData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const content = await response.json();
      setGeneratedContent(content);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Error generating content. Please try again.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
      setLoadingText("Generate My CV");
    }
  };

  async function downloadPDF(
    data: FormData,
    templateName: string,
    type: "cv" | "cover-letter" = "cv"
  ) {
    const elementId =
      type === "cv" ? `cv-${templateName.toLowerCase()}` : "cover-letter";
    const element = document.getElementById(elementId);

    if (!element) {
      alert("Element not found!");
      return;
    }

    const pdf = new jsPDF("p", "pt", "a4");

    try {
      await pdf.html(element, {
        callback: (doc) => {
          const fileName =
            type === "cv"
              ? `cv-${templateName.toLowerCase()}.pdf`
              : `${data.fullName.replace(/\s+/g, "_")}_Cover_Letter.pdf`;
          doc.save(fileName);
        },
        html2canvas: {
          scale: 1, // improves resolution
          useCORS: true,
        },
        autoPaging: true,
        x: 15,
        y: 15,
        width: 580, // width of the content
        windowWidth: 600, // width of the viewport for rendering
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Error generating PDF. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CVCraft</span>
          </Link>
          <div className="text-sm text-gray-600">CV & Cover Letter Builder</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="space-y-6">
            {/* CV Form */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-2xl">Build Your CV</CardTitle>
                <p className="text-blue-100">
                  Fill in your details to generate a professional CV
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          {...form.register("fullName")}
                          placeholder="John Doe"
                          className="mt-1"
                        />
                        {form.formState.errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="jobTitle">Current Job Title *</Label>
                        <Input
                          id="jobTitle"
                          {...form.register("jobTitle")}
                          placeholder="Software Engineer"
                          className="mt-1"
                        />
                        {form.formState.errors.jobTitle && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.jobTitle.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                          placeholder="john@example.com"
                          className="mt-1"
                        />
                        {form.formState.errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          placeholder="+1 (555) 123-4567"
                          className="mt-1"
                        />
                        {form.formState.errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          {...form.register("location")}
                          placeholder="New York, NY"
                          className="mt-1"
                        />
                        {form.formState.errors.location && (
                          <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.location.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Summary */}
                  <div>
                    <Label htmlFor="summary">Professional Summary *</Label>
                    <Textarea
                      id="summary"
                      {...form.register("summary")}
                      placeholder="Brief overview of your professional background, key skills, and career objectives..."
                      rows={3}
                      className="mt-1"
                    />
                    {form.formState.errors.summary && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.summary.message}
                      </p>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <Label htmlFor="education">Education *</Label>
                    <Textarea
                      id="education"
                      {...form.register("education")}
                      placeholder="Degree, Institution, Years (e.g., Bachelor of Science in Computer Science, MIT, 2018-2022)"
                      rows={2}
                      className="mt-1"
                    />
                    {form.formState.errors.education && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.education.message}
                      </p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <Label htmlFor="experience">Work Experience *</Label>
                    <Textarea
                      id="experience"
                      {...form.register("experience")}
                      placeholder="Job Title, Company, Years, Description of responsibilities and achievements..."
                      rows={4}
                      className="mt-1"
                    />
                    {form.formState.errors.experience && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.experience.message}
                      </p>
                    )}
                  </div>

                  {/* Skills & Additional Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="skills">Skills *</Label>
                      <Textarea
                        id="skills"
                        {...form.register("skills")}
                        placeholder="JavaScript, React, Node.js, Python..."
                        rows={3}
                        className="mt-1"
                      />
                      {form.formState.errors.skills && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.skills.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="languages">Languages</Label>
                      <Textarea
                        id="languages"
                        {...form.register("languages")}
                        placeholder="English (Native), Spanish (Fluent)..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="achievements">
                      Achievements & Certifications
                    </Label>
                    <Textarea
                      id="achievements"
                      {...form.register("achievements")}
                      placeholder="Awards, certifications, notable projects..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetRole">Target Role *</Label>
                    <Input
                      id="targetRole"
                      {...form.register("targetRole")}
                      placeholder="Full Stack Developer"
                      className="mt-1"
                    />
                    {form.formState.errors.targetRole && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.targetRole.message}
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Cover Letter Form */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="text-2xl">Cover Letter Details</CardTitle>
                <p className="text-purple-100">
                  Optional: Add company details for a personalized cover letter
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        {...coverLetterForm.register("companyName")}
                        placeholder="Google Inc."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyAddress">Company Address</Label>
                      <Input
                        id="companyAddress"
                        {...coverLetterForm.register("companyAddress")}
                        placeholder="1600 Amphitheatre Parkway, Mountain View, CA"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recruiterName">Recruiter Name</Label>
                      <Input
                        id="recruiterName"
                        {...coverLetterForm.register("recruiterName")}
                        placeholder="John Smith"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recruiterEmail">Recruiter Email</Label>
                      <Input
                        id="recruiterEmail"
                        type="email"
                        {...coverLetterForm.register("recruiterEmail")}
                        placeholder="john.smith@company.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="jobCircular">
                      Job Description/Circular
                    </Label>
                    <Textarea
                      id="jobCircular"
                      {...coverLetterForm.register("jobCircular")}
                      placeholder="Paste the job description or requirements here..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-base break-words sm:text-lg font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  "Generate My CV & Cover Letter"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={loadSampleData}
                className="flex-1 sm:flex-none"
              >
                Load Sample Data
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {generatedContent ? (
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
                  <CardTitle className="text-2xl">
                    Your Generated Content
                  </CardTitle>
                  <p className="text-green-100">
                    Choose your preferred template and download as PDF
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-5">
                      <TabsTrigger value="professional">
                        Professional
                      </TabsTrigger>
                      <TabsTrigger value="concise">Concise</TabsTrigger>
                      <TabsTrigger value="creative">Creative</TabsTrigger>
                      <TabsTrigger value="cover-letter">
                        Cover Letter
                      </TabsTrigger>
                      <TabsTrigger value="email">Email</TabsTrigger>
                    </TabsList>

                    <div className="mt-4">
                      <TabsContent value="professional">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              Professional Template
                            </h3>
                            <Button
                              onClick={() =>
                                downloadPDF(form.getValues(), "professional")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                          <CVTemplate
                            content={generatedContent.professional}
                            title="professional"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="concise">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              Concise Template
                            </h3>
                            <Button
                              onClick={() =>
                                downloadPDF(form.getValues(), "concise")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                          <CVTemplate
                            content={generatedContent.concise}
                            title="concise"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="creative">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              Creative Template
                            </h3>
                            <Button
                              onClick={() =>
                                downloadPDF(form.getValues(), "creative")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                          <CVTemplate
                            content={generatedContent.creative}
                            title="creative"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="cover-letter">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                              Cover Letter
                            </h3>
                            <Button
                              onClick={() =>
                                downloadPDF(
                                  form.getValues(),
                                  "cover-letter",
                                  "cover-letter"
                                )
                              }
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                          <CoverLetterTemplate
                            content={generatedContent.coverLetter}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="email">
                        <div className="space-y-4">
                          <EmailTemplate content={generatedContent.email} />
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Content Preview
                  </h3>
                  <p className="text-gray-500">
                    Fill out the forms and click &quot;Generate My CV & Cover
                    Letter&quot; to see your professional content here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
