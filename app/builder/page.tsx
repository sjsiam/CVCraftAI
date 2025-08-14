import { Metadata } from 'next';
import Builder from './Builder';


export const metadata: Metadata = {
  title: 'CV & Cover Letter Builder - CVCraft',
  description: 'Build your professional CV and cover letter with CVCraft. Fill out the forms and generate optimized content in seconds.',
}

export default function BuilderPage() {
  return <Builder />;
}