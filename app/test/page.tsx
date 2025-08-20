"use client";

import jsPDF from "jspdf";

export async function downloadPDF(
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

  const pdf = new jsPDF("p", "pt", "a4"); // portrait, mm, A4

  try {
    await pdf.html(element, {
      callback: (doc) => {
        const fileName =
          type === "cv"
            ? `cv-${templateName.toLowerCase()}.pdf`
            : "MD_Shahariar_Jaman_Siam_Cover_Letter.pdf";
        doc.save(fileName);
      },
      html2canvas: {
        scale: 1, // improves resolution
        useCORS: true,
      },
      autoPaging: true,
      x: 40,
      y: 40,
      width: 515, // width of the content
      windowWidth: 600, // width of the viewport for rendering
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("Error generating PDF. Please try again.");
  }
}

export default function Test() {
  return (
    <>
      <button onClick={() => downloadPDF("Professional", "cover-letter")}>
        download
      </button>

      <div
        id="cover-letter"
        style={{
          width: "520px",
          textAlign: "justify",
        }}
      >
        <h1>Cover Letter</h1>
        <div
          style={{ lineHeight: "1.2", fontSize: "12pt" }}
        >
          <p>
            Dear <b>Hiring Manager</b>,
          </p>

          <p>
            I am writing to express my interest in the <b>Software Developer</b>
            position at <b>XYZ Company</b>. With a strong background in <b>web development</b> and a passion for creating efficient and
            scalable applications, I am confident in my ability to contribute
            positively to your team.
          </p>

          <p>
            Over the past <b>3 years</b>, I have gained experience in
            <b>HTML, CSS, JavaScript, and PHP</b>, building dynamic websites and
            web applications. My recent project involved developing a
            <b>real-time data dashboard</b> that improved reporting efficiency
            by <b>30%</b>.
          </p>

          <p>
            I am particularly drawn to <b>XYZ Company&apos;s</b> commitment to
            innovation and excellence in software solutions. I am eager to bring
            my <b>problem-solving skills</b> and <b>team collaboration</b>
            experience to help drive your projects forward.
          </p>

          <p>
            Thank you for considering my application. I would welcome the
            opportunity to discuss how my skills and experience align with your
            needs. Please feel free to contact me at
            <b>your.email@example.com</b> or <b>(123) 456-7890</b>.
          </p>

          <p>
            Sincerely,<br></br>
            <b>John Doe</b>
          </p>
        </div>
      </div>
    </>
  );
}
