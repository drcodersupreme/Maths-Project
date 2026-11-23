import React, { useState } from 'react';
import { VIVA_QUESTIONS } from '../../engine/codeMetadata';
import { KatexMath } from '../common/KatexMath';

export const VivaPrepGuide: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Mathematical Foundations', 'Convergence & Curvature', 'Line Search Methods', 'Algorithmic Implementation'];

  const filteredQuestions =
    activeCategory === 'All'
      ? VIVA_QUESTIONS
      : VIVA_QUESTIONS.filter((q) => q.category === activeCategory);

  const programmingConcepts = [
    {
      concept: 'Vector Arithmetic & 2D Arrays',
      explanation: 'Points and search directions are stored as 2D tuples [number, number]. Operations like X + α d and dot product gᵀ d are computed using component-wise arithmetic.',
    },
    {
      concept: 'Symbolic AST Differentiation',
      explanation: 'math.js parses the formula string into an Abstract Syntax Tree (AST) and performs analytical differentiation using derivative rules (chain, product, power rules).',
    },
    {
      concept: 'Numerical Tolerance Epsilon (ε)',
      explanation: 'Because IEEE 754 floating point numbers cannot represent arbitrary reals exactly, testing exact zero (x === 0) causes infinite loops. We evaluate ||∇f|| < ε (e.g. 10⁻⁵).',
    },
    {
      concept: 'Safe Halting & Non-Finite Detection',
      explanation: 'Safeguards verify that α > 0 and coordinates remain finite (isFinite), halting if numerical overflow, saddle point stagnation, or divergence is encountered.',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header and Category Filter */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-3">
        <div>
          <h2 className="text-base font-bold text-[#202124]">
            Optimization Lab Viva & Examination Guide
          </h2>
          <p className="text-xs text-[#6B7280]">
            Core theoretical questions, mathematical proofs, and programming concepts frequently asked in university examinations.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-50 text-[#2563EB] border-blue-200 font-semibold'
                  : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:text-[#202124]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Q&A Accordion */}
      <div className="space-y-2">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden transition-colors"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full text-left p-4 flex items-start justify-between space-x-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wide">
                      {q.category}
                    </span>
                    <h3 className="text-sm font-semibold text-[#202124] mt-0.5">
                      {q.question}
                    </h3>
                  </div>
                </div>

                <span className="text-xs text-[#6B7280] shrink-0 font-mono">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </button>

              {isExpanded && (
                <div className="p-4 pt-1 border-t border-[#E5E7EB] bg-[#F7F8FA] space-y-3">
                  {q.mathFormula && (
                    <div className="bg-white p-2.5 rounded border border-[#E5E7EB] font-mono text-xs overflow-x-auto scrollbar-thin">
                      <span className="text-[10px] text-[#6B7280] block mb-0.5 uppercase font-medium">
                        Mathematical Formula:
                      </span>
                      <KatexMath math={q.mathFormula} block />
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wide mb-1">
                      Model Answer:
                    </h4>
                    <p className="text-xs text-[#374151] leading-relaxed bg-white p-3 rounded border border-[#E5E7EB]">
                      {q.answer}
                    </p>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-100 rounded p-2.5 text-xs">
                    <span className="font-semibold text-[#1E40AF] block text-[11px] mb-0.5">
                      Practical Engineering Context:
                    </span>
                    <span className="text-[#374151] text-[11px] leading-relaxed">
                      {q.practicalRelevance}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Programming Concepts Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-3">
        <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wide border-b border-[#E5E7EB] pb-2">
          Key Programming Concepts in Numerical Optimization
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {programmingConcepts.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F7F8FA] p-3 rounded border border-[#E5E7EB] space-y-1"
            >
              <h4 className="text-xs font-semibold text-[#202124]">{item.concept}</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
