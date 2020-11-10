import { css } from "catom";
import { underlined } from "../../styles";

export function Questions() {
  return (
    <section>
      <Question
        question="why?"
        answer="college warden is an easy to use app that allows you to access all
        your portal links, documents, deadlines at one place"
      />
      <Question
        question="how?"
        answer="you enter the list of colleges you have applied to, mention your deadlines, upload documents safely, save your portal links and access them here. Your files are encrypted locally using your password"
      />
      <Question
        question="data?"
        answer="everything you upload will be encrypted on your device first.. the only information you provide will be your username and name"
      />
    </section>
  );
}
interface QuestionProps {
  question: string;
  answer: string;
}
function Question({ question, answer }: QuestionProps) {
  return (
    <div>
      <h2 class={[underlined, css({ fontWeight: "bold", marginTop: "2rem" })]}>
        {question}
      </h2>
      <div>{answer}</div>
    </div>
  );
}
