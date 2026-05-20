import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const CodingEditorPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('Java');
  const [message, setMessage] = useState('');
  const [runResult, setRunResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function loadQuestion() {
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data);
    }
    loadQuestion().catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!question?.starterCode) return;

    const starter = question.starterCode[language.toLowerCase()];
    if (starter) {
      setCode(starter);
      setRunResult(null);
      setMessage('');
    }
  }, [language, question]);

  const visibleTestCases = question?.testCases?.length
    ? question.testCases
    : question?.examples?.map((example) => `${example.input} -> ${example.output}`) || [];

  const handleRunTests = async () => {
    setIsRunning(true);
    setRunResult(null);
    setMessage('');
    try {
      const response = await api.post('/code/run', { questionId: Number(id), code, language });
      setRunResult(response.data);
    } catch (err) {
      setRunResult({
        status: 'ERROR',
        message: err.response?.data?.message || 'Unable to run code. Please check that the backend compiler service is running.',
        results: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/submissions', { questionId: Number(id), code, language });
      setMessage('Submission received! AI feedback will be available shortly.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed.');
    }
  };

  if (!question) return <div className="text-slate-300">Loading question...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800 p-6 shadow-lg shadow-slate-900">
        <h2 className="text-3xl font-semibold text-cyan-300">{question.title}</h2>
        <p className="mt-3 text-slate-300">{question.description}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-900 p-4">Sample Input: <pre className="mt-2 whitespace-pre-wrap text-slate-200">{question.sampleInput}</pre></div>
          <div className="rounded-xl bg-slate-900 p-4">Sample Output: <pre className="mt-2 whitespace-pre-wrap text-slate-200">{question.sampleOutput}</pre></div>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Test Cases</h3>
            <span className="rounded bg-slate-900 px-3 py-1 text-sm text-cyan-300">{visibleTestCases.length} cases</span>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {visibleTestCases.map((testCase, index) => (
              <div key={`${testCase}-${index}`} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                <p className="text-sm font-semibold text-cyan-200">Case {index + 1}</p>
                <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-300">{testCase}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-slate-800 p-6 shadow-lg shadow-slate-900">
        <div className="flex flex-col gap-4">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="max-w-xs rounded border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100">
            <option>Java</option>
            <option>JavaScript</option>
            <option>Python</option>
          </select>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={14} className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 font-mono" />
          <div className="grid gap-3 md:grid-cols-2">
            <button onClick={handleRunTests} disabled={isRunning} className="rounded bg-emerald-400 px-6 py-3 text-slate-950 font-semibold disabled:cursor-not-allowed disabled:bg-slate-500">
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </button>
            <button onClick={handleSubmit} className="rounded bg-cyan-500 px-6 py-3 text-slate-950 font-semibold">Submit Solution</button>
          </div>
          {runResult && (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">Compiler Output</h3>
                <span className={`rounded px-3 py-1 text-sm font-semibold ${runResult.status === 'ACCEPTED' ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'}`}>
                  {runResult.status}
                </span>
              </div>
              <p className="mt-2 text-slate-300">{runResult.message}</p>
              {!!runResult.results?.length && (
                <div className="mt-4 space-y-3">
                  {runResult.results.map((result) => (
                    <div key={result.caseNumber} className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-100">Case {result.caseNumber}</p>
                        <span className={`rounded px-2 py-1 text-xs font-semibold ${result.passed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                        <div>
                          <p className="text-slate-500">Input</p>
                          <pre className="mt-1 whitespace-pre-wrap break-words text-slate-300">{result.input}</pre>
                        </div>
                        <div>
                          <p className="text-slate-500">Expected</p>
                          <pre className="mt-1 whitespace-pre-wrap break-words text-slate-300">{result.expectedOutput}</pre>
                        </div>
                        <div>
                          <p className="text-slate-500">Your Output</p>
                          <pre className="mt-1 whitespace-pre-wrap break-words text-slate-300">{result.actualOutput || '-'}</pre>
                        </div>
                      </div>
                      {result.error && <pre className="mt-3 whitespace-pre-wrap break-words rounded bg-rose-950/60 p-3 text-sm text-rose-100">{result.error}</pre>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {message && <div className="rounded bg-emerald-500 px-4 py-3 text-slate-950">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default CodingEditorPage;
