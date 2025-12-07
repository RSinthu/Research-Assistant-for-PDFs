import SummaryAccordion from './SummaryAccordion';
import { Users, FileText, Target, Beaker, TrendingUp, CheckCircle } from 'lucide-react';

export default function SummaryPanel({ summary }) {
  const sections = [
    {
      id: 'title',
      title: 'Title & Authors',
      icon: Users,
      content: summary?.title || 'Loading...',
      defaultOpen: true
    },
    {
      id: 'abstract',
      title: 'Abstract',
      icon: FileText,
      content: summary?.abstract || 'Processing document...'
    },
    {
      id: 'problem',
      title: 'Problem Statement',
      icon: Target,
      content: summary?.problem || 'Extracting problem statement...'
    },
    {
      id: 'methodology',
      title: 'Methodology',
      icon: Beaker,
      content: summary?.methodology || 'Analyzing methodology...'
    },
    {
      id: 'results',
      title: 'Key Results',
      icon: TrendingUp,
      content: summary?.results || 'Extracting key results...'
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      icon: CheckCircle,
      content: summary?.conclusion || 'Processing conclusion...'
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Paper Summary
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-generated structured summary of the research paper
        </p>
      </div>

      <div className="space-y-3">
        {sections.map(section => (
          <SummaryAccordion
            key={section.id}
            title={section.title}
            icon={section.icon}
            defaultOpen={section.defaultOpen}
          >
            {section.content}
          </SummaryAccordion>
        ))}
      </div>
    </div>
  );
}