import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";
import SceneWrapper from "@/components/vn/SceneWrapper";

export const metadata = { title: "Resume — Aditya Singh" };

export default async function ResumePage() {
  const file = fs.readFileSync(path.join(process.cwd(), "src/data/resume.md"), "utf8");
  const { content } = matter(file);
  const htmlContent = await remark().use(html).process(content);

  return (
    <SceneWrapper>
      <div className="mx-auto max-w-3xl">
        <div className="v-card prose prose-invert max-w-none" 
             dangerouslySetInnerHTML={{ __html: String(htmlContent) }} 
        />
        <div className="mt-6 text-center">
          <Link href="/" className="btn">← Back to Portfolio</Link>
        </div>
      </div>
    </SceneWrapper>
  );
}
