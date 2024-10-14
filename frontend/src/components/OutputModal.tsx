import React, { useState } from 'react';
import { Tab, Tabs, Spinner, Button } from 'react-bootstrap';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';

interface Submission {
  localId: number;
  globalId: number;
  token: string;
}

interface OutputModalProps {
  submissions: Submission[];
  getSubmission: (token: string) => Promise<any>;
}

const OutputModal: React.FC<OutputModalProps> = ({ submissions, getSubmission }) => {
  const [activeTab, setActiveTab] = useState<string>(submissions[0]?.token || '');
  const queryClient = useQueryClient();

  const { data: submissionResult, isLoading, isError } = useQuery({
    queryKey: ['submission', activeTab],
    queryFn: () => getSubmission(activeTab),
    enabled: !!activeTab,
  });

  const handleRefresh = (token: string) => {
    queryClient.invalidateQueries(['submission', token]);
  };

  const renderSubmissionResult = () => {
    if (isLoading) return <Spinner animation="border" />;
    if (isError) return <div>Error fetching submission result</div>;
    if (!submissionResult) return null;

    return (
      <div>
        <h4>Status: {submissionResult.status.description}</h4>
        {submissionResult.stdout && (
          <div>
            <h5>Output:</h5>
            <pre>{submissionResult.stdout}</pre>
          </div>
        )}
        {submissionResult.stderr && (
          <div>
            <h5>Error:</h5>
            <pre>{submissionResult.stderr}</pre>
          </div>
        )}
        {submissionResult.compile_output && (
          <div>
            <h5>Compile Output:</h5>
            <pre>{submissionResult.compile_output}</pre>
          </div>
        )}
        <div>
          <h5>Execution Time: {submissionResult.time} seconds</h5>
          <h5>Memory Usage: {submissionResult.memory} KB</h5>
        </div>
      </div>
    );
  };

  return (
    <div className="output-modal">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || '')}
        className="mb-3"
      >
        {submissions.map((submission) => (
          <Tab
            key={submission.token}
            eventKey={submission.token}
            title={
              <div className="flex items-center">
                <span>Submission {submission.localId}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefresh(submission.token);
                  }}
                >
                  <RefreshCw size={16} />
                </Button>
              </div>
            }
          >
            {renderSubmissionResult()}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default OutputModal;