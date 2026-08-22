import { useState } from "react";
import { createTest } from "../services/testsService";

const DEFAULT_QUESTION = {
  question_type: "MCQ",
  question: "",
  max_marks: 1,
  options: [{ option_text: "", is_correct: false }],
};

function CreateAssessmentModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [description, setDescription] = useState("");
  const [testFreq, setTestFreq] = useState("One-Time");
  const [questions, setQuestions] = useState([]);

  if (!isOpen) return null;

  const addQuestion = (questionType) => {
    const newQuestion = {
      ...DEFAULT_QUESTION,
      question_type: questionType,
      max_marks: questionType === "MCQ" ? 1 : 5,
      options:
        questionType === "MCQ"
          ? [{ option_text: "", is_correct: false }]
          : [],
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: [...(q.options || []), { option_text: "", is_correct: false }],
            }
          : q
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== questionIndex) return q;

        return {
          ...q,
          options: (q.options || []).map((opt, idx) =>
            idx === optionIndex ? { ...opt, [field]: value } : opt
          ),
        };
      })
    );
  };

  const handleCreate = async () => {
    const payload = {
      test_title: title,
      duration_minutes: Number(durationMinutes) || 0,
      description,
      test_freq: testFreq,
      questions: questions.map((q) => ({
        question_type: q.question_type,
        question: q.question,
        max_marks: Number(q.max_marks) || 0,
        options: (q.options || []).map((opt) => ({
          option_text: opt.option_text,
          is_correct: !!opt.is_correct,
        })),
      })),
    };

    const result = await createTest(payload);
    console.log("Created:", result);

    if (onCreated) {
      onCreated(result);
    }

    onClose();
  };

  const resetState = () => {
    setTitle("");
    setDurationMinutes(30);
    setDescription("");
    setTestFreq("One-Time");
    setQuestions([]);
  };

  const closeModal = () => {
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Create New Assessment</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Import Test
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="text-2xl leading-none text-slate-500 hover:text-slate-700"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Test Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full-Stack Engineering Assessment"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Test Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
                Category &amp; Schedule Recurrence
              </h3>
              <div className="flex gap-2">
                {[
                  "One-Time",
                  "Weekly",
                  "Monthly",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTestFreq(option)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      testFreq === option
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
                Questions &amp; Types Setup
              </h3>

              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  { label: "+ MCQ", value: "MCQ" },
                  { label: "+ Short Ans", value: "Short Ans" },
                  { label: "+ Embedded", value: "Embedded" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => addQuestion(type.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {questions.map((question, questionIndex) => (
                  <div key={`${question.question_type}-${questionIndex}`} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="block text-sm font-medium text-slate-700">Question Format</label>
                      <select
                        value={question.question_type}
                        onChange={(e) => updateQuestion(questionIndex, "question_type", e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="MCQ">MCQ</option>
                        <option value="Short Ans">Short Ans</option>
                        <option value="Embedded">Embedded</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="mb-1 block text-sm font-medium text-slate-700">Question Stem Prompt</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Enter the question prompt"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="mb-1 block text-sm font-medium text-slate-700">Max Marks</label>
                      <input
                        type="number"
                        min="1"
                        value={question.max_marks}
                        onChange={(e) => updateQuestion(questionIndex, "max_marks", Number(e.target.value) || 0)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {question.question_type === "MCQ" && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-slate-700">Answer Options</h4>
                          <button
                            type="button"
                            onClick={() => addOption(questionIndex)}
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            + Add Option
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(question.options || []).map((option, optionIndex) => (
                            <div key={`${questionIndex}-option-${optionIndex}`} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option.option_text}
                                onChange={(e) => updateOption(questionIndex, optionIndex, "option_text", e.target.value)}
                                placeholder="Option text"
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />
                              <label className="flex items-center gap-1 text-xs text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={!!option.is_correct}
                                  onChange={(e) => updateOption(questionIndex, optionIndex, "is_correct", e.target.checked)}
                                />
                                is correct
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAssessmentModal;
