import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import 'katex/dist/katex.min.css'

export default function CostumMarkdown({ children }: { children: string }) {

    let string = children.replace(/\[\s*([^[]*?)\s*\]/g, (match, p1) => `$$${p1.trim()}$$`);

    // Replace ( equation ) with $ equation $
    // string = string.replace(/\(\s*([^)]+?)\s*\)/g, (match, p1) => `$${p1.trim()}$`);

    // Handle backslashes in equations
    // string = string.replace(/\\\s*/g, '\\');

    console.log(string);

    return <>
        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {string}
            {/* \$x^7\$ */}
        </Markdown>
    </>
}