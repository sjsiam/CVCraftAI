import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const prompt = `
You are a professional CV writer, cover letter expert, and email communication specialist. Create comprehensive application materials based on the following information:

Personal Information:
- Name: ${data.fullName}
- Job Title: ${data.jobTitle}
- Email: ${data.email}
- Phone: ${data.phone}
- Location: ${data.location}

Professional Summary: ${data.summary}
Education: ${data.education}
Experience: ${data.experience}
Skills: ${data.skills}
Languages: ${data.languages || 'Not specified'}
Achievements: ${data.achievements || 'Not specified'}
Target Role: ${data.targetRole}

Cover Letter Details:
- Company Name: ${data.companyName || '[Company Name]'}
 - Company Address: ${data.companyAddress || '[Company Address]'}
- Recruiter Name: ${data.recruiterName || '[Hiring Manager]'}
- Recruiter Email: ${data.recruiterEmail || '[recruiter@company.com]'}
- Job Circular: ${data.jobCircular || 'General application for ' + data.targetRole}

Create 5 DISTINCTLY DIFFERENT items with unique designs and layouts:

1. PROFESSIONAL CV: A formal, traditional CV format with a blue color scheme. Include a professional header with contact info, clear section dividers, and bullet points. Use a clean, corporate layout.

2. CONCISE CV: A modern, minimalist design with a green accent color. Use a two-column layout with key information highlighted. Focus on metrics and achievements with icons or visual elements.

3. CREATIVE CV: A contemporary design with purple/teal accents and modern typography. Include visual elements like progress bars for skills, creative section headers, and a more dynamic layout while remaining professional.

4. COVER LETTER: A professional cover letter tailored to the target role and company. Address the recruiter by name if provided, mention the company specifically, and align the content with the job requirements. If job circular is provided, reference specific requirements.

5. EMAIL TEMPLATE: A professional email template for sending the application. Include subject line, greeting, brief introduction, mention of attached documents (CV and cover letter), and professional closing.

For each CV version, return ONLY the HTML content (no <html>, <head>, or <body> tags) with inline CSS styles. Use these guidelines:

PROFESSIONAL CV REQUIREMENTS:
- Use a blue color scheme (#1e40af, #3b82f6, #dbeafe)
- Design and heading will follow the color scheme but normal texts will be black
- Traditional layout with clear sections
- Professional fonts and spacing
- Clean header with contact information
- Use bullet points and proper hierarchy
- CV Background must be white
- Must be ATS focused

CONCISE CV REQUIREMENTS:
- Use a green color scheme (#059669, #10b981, #d1fae5)
- Design and heading will follow the color scheme but normal texts will be black
- Two-column layout where appropriate
- Compact design with essential information only
- Modern typography with good use of white space
- Highlight key metrics and achievements
- CV Background may be white
- Mid ATS and Mid Design focused

CREATIVE CV REQUIREMENTS:
- Use purple/teal color scheme (#7c3aed, #0d9488, #f3e8ff, #ccfbf1)
- Design and heading will follow the color scheme but normal texts will be black
- Modern, dynamic layout with visual elements
- Creative section headers and styling
- Include visual elements like colored bars or sections
- Contemporary typography and design elements
- Each Section will be a card with a white background and semi-circular corners
- Background will follow the color scheme, but be lighter and gradient
- Design Focused

COVER LETTER REQUIREMENTS:
- Professional business letter format
 - Include this date: ${new Date().toLocaleDateString()} at the top
 - Include company address if provided
- Address the recruiter by name if provided, otherwise use "Dear Hiring Manager"
- Mention the company name and specific role
- Reference job requirements if circular is provided
- Highlight relevant experience and skills
- Professional closing with contact information
- Use clean, readable formatting with proper spacing
- Include date and addresses in proper business letter format

EMAIL TEMPLATE REQUIREMENTS:
- Professional subject line mentioning the position
- Proper greeting using recruiter name if provided
- Brief, concise introduction
- Mention attached CV and cover letter
- Professional closing with full contact information
- Use proper email formatting
- Keep it concise but professional

GENERAL REQUIREMENTS FOR ALL ITEMS:
- Use inline CSS styles for all formatting
- Include proper padding and margins (use padding: 40px for main container)
- Use professional fonts (Arial, Helvetica, sans-serif)
- Ensure good contrast and readability
- Make each version visually distinct and recognizable
- Include all provided information appropriately formatted
- Ensure ATS-friendly structure with clear headings
- Use semantic HTML with proper heading hierarchy
- Structure: Header → Summary → Experience → Education → Skills → Additional sections
- Fix any grammatical errors made by the user in the user data
- Update the Professional Summary and Experience, depending on professional, concise and creative
- Tailor all content to the target role: ${data.targetRole}

Return the response as a JSON object with keys: professional, concise, creative, coverLetter, email
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert CV writer, cover letter specialist, and professional communication expert who creates ATS-optimized resumes and compelling application materials. Always respond with valid JSON containing HTML-formatted content. Do not include any Markdown formatting, code blocks, backticks, or extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 6000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const generatedContent = JSON.parse(response);
      return NextResponse.json(generatedContent);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      const fallbackResponse = {
        professional: `
          <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
            <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; margin: -40px -40px 30px -40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">${data.fullName}</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${data.jobTitle}</p>
              <p style="margin: 15px 0 0 0; font-size: 14px;">${data.email} | ${data.phone} | ${data.location}</p>
            </div>
            <h2 style="color: #1e40af; border-bottom: 2px solid #dbeafe; padding-bottom: 5px; margin-top: 30px;">Professional Summary</h2>
            <p style="margin: 15px 0;">${data.summary}</p>
            <h2 style="color: #1e40af; border-bottom: 2px solid #dbeafe; padding-bottom: 5px; margin-top: 30px;">Experience</h2>
            <p style="margin: 15px 0;">${data.experience}</p>
            <h2 style="color: #1e40af; border-bottom: 2px solid #dbeafe; padding-bottom: 5px; margin-top: 30px;">Education</h2>
            <p style="margin: 15px 0;">${data.education}</p>
            <h2 style="color: #1e40af; border-bottom: 2px solid #dbeafe; padding-bottom: 5px; margin-top: 30px;">Skills</h2>
            <p style="margin: 15px 0;">${data.skills}</p>
          </div>
        `,
        concise: `
          <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
            <div style="background: #d1fae5; padding: 25px; margin: -40px -40px 25px -40px; border-left: 5px solid #059669;">
              <h1 style="margin: 0; font-size: 28px; color: #059669;">${data.fullName}</h1>
              <p style="margin: 8px 0; color: #065f46; font-weight: 600;">${data.jobTitle}</p>
              <p style="margin: 8px 0; font-size: 14px; color: #047857;">${data.email} • ${data.phone} • ${data.location}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
              <div>
                <h2 style="color: #059669; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Summary</h2>
                <p style="font-size: 14px; margin-bottom: 20px;">${data.summary}</p>
                <h2 style="color: #059669; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Experience</h2>
                <p style="font-size: 14px;">${data.experience}</p>
              </div>
              <div>
                <h2 style="color: #059669; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Skills</h2>
                <p style="font-size: 14px; margin-bottom: 20px;">${data.skills}</p>
                <h2 style="color: #059669; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Education</h2>
                <p style="font-size: 14px;">${data.education}</p>
              </div>
            </div>
          </div>
        `,
        creative: `
          <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; background: linear-gradient(135deg, #f3e8ff, #ccfbf1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 36px; background: linear-gradient(135deg, #7c3aed, #0d9488); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">${data.fullName}</h1>
              <div style="background: linear-gradient(135deg, #7c3aed, #0d9488); height: 3px; width: 100px; margin: 10px auto;"></div>
              <p style="margin: 15px 0 5px 0; font-size: 20px; color: #7c3aed; font-weight: 600;">${data.jobTitle}</p>
              <p style="margin: 0; color: #0d9488;">${data.email} | ${data.phone} | ${data.location}</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <h2 style="color: #7c3aed; font-size: 18px; margin-bottom: 15px; position: relative;">✨ About Me</h2>
              <p style="margin: 0;">${data.summary}</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 20px;">
              <h2 style="color: #0d9488; font-size: 18px; margin-bottom: 15px;">🚀 Professional Journey</h2>
              <p style="margin: 0;">${data.experience}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <h2 style="color: #7c3aed; font-size: 18px; margin-bottom: 15px;">💼 Skills</h2>
                <p style="margin: 0; font-size: 14px;">${data.skills}</p>
              </div>
              <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <h2 style="color: #0d9488; font-size: 18px; margin-bottom: 15px;">🎓 Education</h2>
                <p style="margin: 0; font-size: 14px;">${data.education}</p>
              </div>
            </div>
          </div>
        `,
        coverLetter: `
          <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
            <div style="text-align: right; margin-bottom: 30px; font-size: 14px;">
              <p style="margin: 0;">${new Date().toLocaleDateString()}</p>
            </div>
            ${data.companyAddress ? `
            <div style="margin-bottom: 30px;">
              <p style="margin: 0; font-weight: bold;">${data.companyName || '[Company Name]'}</p>
              <p style="margin: 5px 0 0 0;">${data.companyAddress}</p>
            </div>
            ` : ''}
            <div style="margin-bottom: 30px;">
              <p style="margin: 0; font-weight: bold;">${data.recruiterName || '[Hiring Manager]'}</p>
              ${!data.companyAddress ? `<p style="margin: 5px 0 0 0;">${data.companyName || '[Company Name]'}</p>` : ''}
              <p style="margin: 5px 0 0 0;">${data.recruiterEmail || '[recruiter@company.com]'}</p>
            </div>
            <p style="margin-bottom: 20px;">Dear ${data.recruiterName || 'Hiring Manager'},</p>
            <p style="margin-bottom: 15px;">I am writing to express my strong interest in the ${data.targetRole} position at ${data.companyName || '[Company Name]'}. With my background in ${data.jobTitle} and expertise in the technologies and skills you're seeking, I am confident I would be a valuable addition to your team.</p>
            <p style="margin-bottom: 15px;">${data.summary}</p>
            <p style="margin-bottom: 15px;">My key qualifications include: ${data.skills}</p>
            <p style="margin-bottom: 15px;">I am excited about the opportunity to contribute to ${data.companyName || '[Company Name]'} and would welcome the chance to discuss how my experience and passion align with your team's goals.</p>
            <p style="margin-bottom: 30px;">Thank you for your time and consideration. I look forward to hearing from you.</p>
            <p style="margin-bottom: 5px;">Sincerely,</p>
            <p style="margin-bottom: 20px; font-weight: bold;">${data.fullName}</p>
            <div style="font-size: 14px; color: #666;">
              <p style="margin: 0;">${data.email}</p>
              <p style="margin: 0;">${data.phone}</p>
              <p style="margin: 0;">${data.location}</p>
            </div>
          </div>
        `,
        email: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
            <p style="margin-bottom: 15px;"><strong>Subject:</strong> Application for ${data.targetRole} Position - ${data.fullName}</p>
            <p style="margin-bottom: 15px;">Dear ${data.recruiterName || 'Hiring Manager'},</p>
            <p style="margin-bottom: 15px;">I hope this email finds you well. I am writing to submit my application for the ${data.targetRole} position at ${data.companyName || '[Company Name]'}.</p>
            <p style="margin-bottom: 15px;">Please find attached my CV and cover letter for your review. I am excited about the opportunity to contribute to your team and would welcome the chance to discuss my qualifications further.</p>
            <p style="margin-bottom: 15px;">Thank you for your time and consideration.</p>
            <p style="margin-bottom: 5px;">Best regards,</p>
            <p style="margin-bottom: 5px; font-weight: bold;">${data.fullName}</p>
            <p style="margin-bottom: 5px;">${data.email}</p>
            <p style="margin-bottom: 5px;">${data.phone}</p>
            <p style="margin: 0;">${data.location}</p>
          </div>
        `
      };
      
      return NextResponse.json(fallbackResponse);
    }

  } catch (error) {
    console.error('Error generating content:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to generate content. Please check your OpenAI API key and try again.' },
      { status: 500 }
    );
  }
}